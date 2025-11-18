import { useState } from "react";
import { adminAPI, complaintAPI } from "../../services/authService.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const GatepassForm = () => {
  const [formData, setFormData] = useState({
    gatepassDate: "",
    gatepassTime: "",
    narration: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminAPI.createGatepass(formData);
      toast.success("Complaint submitted successfully!");
      navigate("/admin/gatepass");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit complaint"
      );
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">📝</span>
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white">
                Submit New Gatepass
              </h1>
              <p className="text-blue-100 text-sm">Create new gatepass</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Narration */}
            <div>
              <label
                htmlFor="narration"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Gatepass Narration *
              </label>
              <textarea
                name="narration"
                id="narration"
                rows={6}
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                placeholder="Provide a detailed narration of the gatepass"
                value={formData.narration}
                onChange={handleChange}
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="gatepassDate"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Gatepass Date *
                </label>
                <input
                  name="gatepassDate"
                  id="gatepassDate"
                  type="date"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                  value={formData.gatepassDate}
                  onChange={handleChange}
                ></input>
              </div>

              <div>
                <label
                  htmlFor="gatepassTime"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Gatepass Time
                </label>
                <input
                  type="time"
                  name="gatepassTime"
                  id="gatepassTime"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                  value={formData.gatepassTime}
                  onChange={handleChange}
                ></input>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/gatepass")}
                className="cursor-pointer px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className=" cursor-pointer px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Complaint"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GatepassForm;
