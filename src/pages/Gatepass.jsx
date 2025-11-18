import { useState, useEffect } from "react";
import { complaintAPI, adminAPI } from "../services/authService.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner.jsx";
import { useAuth } from "../store/authContext.jsx";
import { format } from "date-fns";

const Gatepass = () => {
  const [gatepasses, setGatepasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    gatepassDate: "",
  });

  const { user } = useAuth();

  const to12HourFormat = (time24) => {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 -> 12
    return `${hour}:${minute} ${ampm}`;
  };

  useEffect(() => {
    fetchGatepass();
  }, [filter]);

  const fetchGatepass = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllGatepasses(filter);
      setGatepasses(response.gatepasses || response || []);
      // console.log(response);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await adminAPI.updateComplaintStatus(complaintId, newStatus);
      toast.success("Complaint status updated successfully");
      fetchComplaints();
    } catch (error) {
      toast.error("Failed to update complaint status");
    }
  };

  const handleDeleteGatepass = async (gatepassid) => {
    if (window.confirm("Are you sure you want to delete this gatepass?")) {
      try {
        await adminAPI.deleteGatepass(gatepassid);
        toast.success("Gatepass deleted successfully");
        fetchGatepass();
      } catch (error) {
        toast.error("Failed to delete gatepass");
      }
    }
  };

  const filteredGatepasses = gatepasses.filter((gatepass) => {
    const matchesSearch =
      gatepass.narration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gatepass.gatepassId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gatepass.createdBy?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GatePass</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and track all gate passes in the system
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            to={"/admin/gatepass/form"}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:cursor-pointer"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Gatepass
          </Link>
          <button
            onClick={fetchGatepass}
            disabled={loading}
            className=" hover:cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
          >
            <svg
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-4 justify-between">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Gatepasses
            </label>
            <input
              type="text"
              placeholder="Search by title, description, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full border-gray-300 rounded-lg p-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gatepass Date
            </label>
            <input
              value={filter.gatepassDate}
              type="date"
              onChange={(e) => setFilter({ gatepassDate: e.target.value })}
              className="block w-full border-gray-300 rounded-lg p-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></input>
          </div>
        </div>
      </div>

      {/* gatepass Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            {`${"All Gatepasses"} (${filteredGatepasses.length})`}
          </h3>
        </div>

        {filteredGatepasses.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No gatepass found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filter.gatepassDate
                ? "No gatepasses match your current filters."
                : "No gatepasses have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gatepass No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Narration
                  </th>
                  {user?.role === "admin" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gatepass Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gatepass Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGatepasses.map((gatepass) => (
                  <tr
                    key={gatepass._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`CMP-${gatepass.gatepassId}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900  max-w-xs">
                          {gatepass?.narration}
                        </div>
                      </div>
                    </td>
                    {user?.role === "admin" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {gatepass.createdBy?.name}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-800">
                        {(() => {
                          const date = new Date(gatepass?.gatepassDate);
                          const day = date
                            .getDate()
                            .toString()
                            .padStart(2, "0");
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
                        })()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                      >
                        {to12HourFormat(gatepass?.gatepassTime)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {format(
                        new Date(gatepass.createdAt),
                        "eee, MMM d, yyyy 'at' hh:mm a"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`${gatepass?._id}`}>
                          <button className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50">
                            View
                          </button>
                        </Link>
                        {user?.role === "admin" && (
                          <button
                            onClick={() => handleDeleteGatepass(gatepass?._id)}
                            className="text-red-600 cursor-pointer hover:text-red-900 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-red-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gatepass;
