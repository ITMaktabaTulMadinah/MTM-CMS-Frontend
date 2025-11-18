import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { complaintAPI, adminAPI } from "../services/authService.js";
import { useAuth } from "../store/authContext.jsx";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner.jsx";
import ComplaintChat from "../components/complaints/ComplainChat.jsx";

const GatepassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gatepass, setGatepass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    remarks: "",
  });

  const to12HourFormat = (time24) => {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 -> 12
    return `${hour}:${minute} ${ampm}`;
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGatepass();
  }, [id]);

  const fetchGatepass = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getGatepassById(id);
      setGatepass(response);
      console.log(response);
      //   setUpdateData({
      //     status: response.status,
      //     remarks: response.remarks || "",
      //   });
    } catch (error) {
      toast.error("Failed to fetch complaint details");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (user?.role !== "admin") return;

    try {
      setUpdating(true);
      await complaintAPI.update(id, updateData);
      toast.success("Complaint updated successfully!");
      fetchComplaint();
    } catch (error) {
      toast.error("Failed to update complaint");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!gatepass) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">
          Complaint not found
        </h3>
        <p className="mt-2 text-gray-500">
          The complaint you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  // console.log("Complaint Detail: ", complaint);

  return (
    <div className="max-w-7xl  mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{gatepass?.narration}</h1>
          <p className="mt-1 text-blue-100 text-sm">
            Gatepass ID:{" "}
            <span className="font-semibold">{gatepass?.gatepassId}</span>
          </p>
        </div>
        <button
          onClick={() => navigate(`/admin/gatepass/print/${gatepass._id}`)}
          className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          Go to Print Screen
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Gatepass Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gatepass Info Card */}
          <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Gatepass Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1 text-lg font-semibold">
                  {new Date(gatepass?.gatepassDate).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Time</p>
                <p className="mt-1 text-lg font-semibold">
                  {to12HourFormat(gatepass?.gatepassTime)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p className="mt-1 text-lg font-semibold">
                  {new Date(gatepass?.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Narration</p>
                <p className="mt-1 text-gray-800 whitespace-pre-wrap">
                  {gatepass?.narration}
                </p>
              </div>
            </div>
          </div>

          {/* Created By Info */}
          <div className="bg-white shadow rounded-2xl p-6 border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {gatepass?.createdBy?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created By</p>
              <p className="text-lg font-semibold text-gray-900">
                {gatepass?.createdBy?.name}
              </p>
              <p className="text-sm text-gray-500">
                {gatepass?.createdBy?.department}
              </p>
              <p className="text-sm text-gray-500">
                {gatepass?.createdBy?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Stats / Actions */}
        <div className="space-y-6">
          {/* Quick Info Cards */}
          <div className="bg-white shadow rounded-2xl p-6 border border-gray-100 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Info</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Gatepass ID</span>
                <span className="font-semibold text-gray-900">
                  {gatepass?.gatepassId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Created At</span>
                <span className="font-semibold text-gray-900">
                  {new Date(gatepass?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Time</span>
                <span className="font-semibold text-gray-900">
                  {to12HourFormat(gatepass?.gatepassTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          {user?.role === "admin" && (
            <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Admin Actions
              </h3>
              <button className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all mb-3">
                Delete Gatepass
              </button>
              <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                Edit Gatepass
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GatepassDetails;

//   {/* Header */}
//   <div className="bg-white shadow sm:rounded-lg">
//     <div className="px-4 py-5 sm:p-6">
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             {gatepass?.narration}
//           </h1>
//           {/* <div className="mt-2 flex items-center space-x-4">
//             <span
//               className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
//                 gatepass?.status
//               )}`}
//             >
//               {gatepass?.status}
//             </span>
//             <span
//               className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
//                 gatepass?.priority
//               )}`}
//             >
//               {gatepass?.priority}
//             </span>
//             <span className="text-sm text-gray-500">
//               {gatepass?.category}
//             </span>
//           </div> */}
//         </div>
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="text-sm text-gray-500 hover:text-gray-700"
//         >
//           ← Back to Dashboard
//         </button>
//       </div>
//     </div>
//   </div>

//   {/* Details */}
//   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//     <div className="lg:col-span-2">
//       <div className="bg-white shadow sm:rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Gatepass Narration
//           </h3>
//           <p className="text-gray-700 whitespace-pre-wrap">
//             {gatepass?.narration}
//           </p>
//         </div>
//       </div>
//     </div>

//     <div className="space-y-6">
//       {/* Complaint Info */}
//       <div className="bg-white shadow sm:rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Complaint Details
//           </h3>
//           <dl className="space-y-3">
//             <div>
//               <dt className="text-sm font-medium text-gray-500">
//                 Complaint No.
//               </dt>
//               <dd className="text-sm text-gray-900">
//                 {gatepass.complaintId}
//               </dd>
//             </div>
//             <div>
//               <dt className="text-sm font-medium text-gray-500">
//                 Submitted by
//               </dt>
//               <dd className="text-sm text-gray-900">
//                 {gatepass.createdBy?.name}
//               </dd>
//             </div>
//             <div>
//               <dt className="text-sm font-medium text-gray-500">
//                 Department
//               </dt>
//               <dd className="text-sm text-gray-900">
//                 {gatepass.createdBy?.department}
//               </dd>
//             </div>
//             <div>
//               <dt className="text-sm font-medium text-gray-500">Created</dt>
//               <dd className="text-sm text-gray-900">
//                 {new Date(gatepass.createdAt).toLocaleString()}
//               </dd>
//             </div>
//             {/* {gate.resolvedAt && (
//               <div>
//                 <dt className="text-sm font-medium text-gray-500">
//                   Resolved
//                 </dt>
//                 <dd className="text-sm text-gray-900">
//                   {new Date(complaint.resolvedAt).toLocaleString()}
//                 </dd>
//               </div>
//             )}
//             {complaint.assignedTo && (
//               <div>
//                 <dt className="text-sm font-medium text-gray-500">
//                   Assigned to
//                 </dt>
//                 <dd className="text-sm text-gray-900">
//                   {complaint.assignedTo?.name}
//                 </dd>
//               </div>
//             )} */}
//           </dl>
//         </div>
//       </div>

//       {/* Admin Update Form */}
//       {user?.role === "admin" && (
//         <div className="bg-white shadow sm:rounded-lg">
//           <div className="px-4 py-5 sm:p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Update Complaint
//             </h3>
//             {/* <form onSubmit={handleUpdate} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Status
//                 </label>
//                 <select
//                   value={updateData.status}
//                   onChange={(e) =>
//                     setUpdateData({ ...updateData, status: e.target.value })
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-lg p-2 border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 >
//                   <option value="Pending">Pending</option>
//                   <option value="In Progress">In Progress</option>
//                   <option value="Resolved">Resolved</option>
//                   <option value="Rejected">Rejected</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Remarks
//                 </label>
//                 <textarea
//                   value={updateData.remarks}
//                   onChange={(e) =>
//                     setUpdateData({
//                       ...updateData,
//                       remarks: e.target.value,
//                     })
//                   }
//                   rows={3}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Add remarks..."
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={updating}
//                 className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//               >
//                 {updating ? "Updating..." : "Update Complaint"}
//               </button>
//             </form> */}
//           </div>
//         </div>
//       )}

//       {/* Remarks Display */}
//       {/* {complaint.remarks && (
//         <div className="bg-white shadow sm:rounded-lg">
//           <div className="px-4 py-5 sm:p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Admin Remarks
//             </h3>
//             <p className="text-gray-700 whitespace-pre-wrap">
//               {complaint.remarks}
//             </p>
//           </div>
//         </div>
//       )} */}
//     </div>
//   </div>
