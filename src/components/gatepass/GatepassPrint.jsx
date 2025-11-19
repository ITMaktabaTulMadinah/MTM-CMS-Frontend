import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminAPI } from "../../services/authService";
import QRCode from "react-qr-code";

const GatepassPrint = () => {
  const { id } = useParams();
  const [gatepass, setGatepass] = useState();
  const printRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGatepass();
  }, []);

  const fetchGatepass = async () => {
    try {
      const response = await adminAPI.getGatepassById(id);
      setGatepass(response);
    } catch (err) {
      console.log(err.response);
    }
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open("", "_blank");
    console.log(printContents);

    if (!newWindow) return; // popup blocked

    newWindow.document.write(`
      <html>
        <head>
          <title>Gatepass Print</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    
          <style>
            @page {
              size: A4;
            }
    
            /* Print area ko half A4 ka banao */
            .print-area {
              width: 160mm;
              margin: 0px auto;
              height: 135mm; /* half se thoda kam so it fits cleanly */
              border: 2px solid black;
              padding: 10mm;
              box-sizing: border-box; 
              page-break-inside: avoid;
              position: relative;
            }

            .borderclass {
            border: 1px solid black;
            width: 50mm;
            }
          </style>
        </head>
    
        <body>
          <div class="print-area">
            ${printContents}
          </div>
        </body>
      </html>
    `);

    newWindow.document.close();
    newWindow.focus();

    // Print aur close after print
    newWindow.print();
    newWindow.onafterprint = () => {
      newWindow.close();
    };
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div ref={printRef} className="print-area border-2 rounded-md relative">
          <h1 className="text-center font-semibold text-3xl pb-2 uppercase underline">
            Gatepass
          </h1>
          <div className="flex justify-between items-center px-4 py-4">
            <div className="font-medium text-sm underline">{`Date: ${(() => {
              const date = new Date(gatepass?.gatepassDate);
              const day = date.getDate().toString().padStart(2, "0");
              const month = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ][date.getMonth()];
              const year = date.getFullYear();
              return `${day}-${month}-${year}`;
            })()}`}</div>
            <div className="font-medium text-sm underline">{`Gatepass No: ${gatepass?.gatepassId}`}</div>
          </div>
          <h3 className="text-center font-semibold underline py-6 text-xl">{`Maktaba Tul Madinah (Head Office)`}</h3>
          <h4 className="text-center text-xl">{gatepass?.narration}</h4>
          <div className="absolute bottom-4 left-0 right-0 px-10 flex items-center justify-between">
            <div>
              <div className="borderclass"></div>
              <p className="text-center">Authorize By</p>
            </div>
            <QRCode value={gatepass?._id} size={80} />
            <div>
              <div className="borderclass"></div>
              <p className="text-center">STAMP</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePrint}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer"
        >
          Print Gatepass
        </button>
        <button
          onClick={() => navigate("/admin/gatepass")}
          className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 cursor-pointer"
        >
          Go to gatepass list
        </button>
      </div>
    </div>
  );
};

export default GatepassPrint;
