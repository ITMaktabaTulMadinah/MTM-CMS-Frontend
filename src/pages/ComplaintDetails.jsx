import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { complaintAPI } from "../services/authService.js";
import { useAuth } from "../store/authContext.jsx";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner.jsx";
import ComplaintChat from "../components/complaints/ComplainChat.jsx";

const ComplaintDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [complaint, setComplaint] = useState(null);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [updateData, setUpdateData] = useState({
		status: "",
		remarks: "",
	});

	const token = localStorage.getItem("token");

	useEffect(() => {
		fetchComplaint();
	}, [id]);

	const fetchComplaint = async () => {
		try {
			setLoading(true);
			const response = await complaintAPI.getById(id);
			setComplaint(response);
			setUpdateData({
				status: response.status,
				remarks: response.remarks || "",
			});
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

	const getStatusColor = (status) => {
		switch (status) {
			case "Pending":
				return "bg-yellow-100 text-yellow-800";
			case "In Progress":
				return "bg-blue-100 text-blue-800";
			case "Resolved":
				return "bg-green-100 text-green-800";
			case "Rejected":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "High":
				return "bg-red-100 text-red-800";
			case "Medium":
				return "bg-yellow-100 text-yellow-800";
			case "Low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (loading) {
		return <Spinner />;
	}

	if (!complaint) {
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
			{/* Header */}
			<div className="bg-white shadow sm:rounded-lg">
				<div className="px-4 py-5 sm:p-6">
					<div className="flex justify-between items-start">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								{complaint.title}
							</h1>
							<div className="mt-2 flex items-center space-x-4">
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
										complaint.status
									)}`}
								>
									{complaint.status}
								</span>
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
										complaint.priority
									)}`}
								>
									{complaint.priority}
								</span>
								<span className="text-sm text-gray-500">
									{complaint.category}
								</span>
							</div>
						</div>
						<button
							onClick={() => navigate("/dashboard")}
							className="text-sm text-gray-500 hover:text-gray-700"
						>
							← Back to Dashboard
						</button>
					</div>
				</div>
			</div>

			{/* Details */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<div className="bg-white shadow sm:rounded-lg">
						<div className="px-4 py-5 sm:p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Description
							</h3>
							<p className="text-gray-700 whitespace-pre-wrap">
								{complaint.description}
							</p>
						</div>
					</div>

					{complaint.attachment && (
						<div className="mt-6 bg-white shadow sm:rounded-lg">
							<div className="px-4 py-5 sm:p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Attachment
								</h3>
								<a
									href={complaint.attachment}
									target="_blank"
									rel="noopener noreferrer"
									className="text-indigo-600 hover:text-indigo-500"
								>
									<img
										src={complaint.attachment}
										alt="Attachment"
										className="w-full h-full object-cover"
									/>
								</a>
							</div>
						</div>
					)}
				</div>

				<div className="space-y-6">
					{/* Complaint Info */}
					<div className="bg-white shadow sm:rounded-lg">
						<div className="px-4 py-5 sm:p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Complaint Details
							</h3>
							<dl className="space-y-3">
								<div>
									<dt className="text-sm font-medium text-gray-500">
										Complaint No.
									</dt>
									<dd className="text-sm text-gray-900">
										{complaint.complaintId}
									</dd>
								</div>
								<div>
									<dt className="text-sm font-medium text-gray-500">
										Submitted by
									</dt>
									<dd className="text-sm text-gray-900">
										{complaint.user?.name}
									</dd>
								</div>
								<div>
									<dt className="text-sm font-medium text-gray-500">
										Department
									</dt>
									<dd className="text-sm text-gray-900">
										{complaint.user?.department}
									</dd>
								</div>
								<div>
									<dt className="text-sm font-medium text-gray-500">Created</dt>
									<dd className="text-sm text-gray-900">
										{new Date(complaint.createdAt).toLocaleString()}
									</dd>
								</div>
								{complaint.resolvedAt && (
									<div>
										<dt className="text-sm font-medium text-gray-500">
											Resolved
										</dt>
										<dd className="text-sm text-gray-900">
											{new Date(complaint.resolvedAt).toLocaleString()}
										</dd>
									</div>
								)}
								{complaint.assignedTo && (
									<div>
										<dt className="text-sm font-medium text-gray-500">
											Assigned to
										</dt>
										<dd className="text-sm text-gray-900">
											{complaint.assignedTo?.name}
										</dd>
									</div>
								)}
							</dl>
						</div>
					</div>

					{/* Admin Update Form */}
					{user?.role === "admin" && (
						<div className="bg-white shadow sm:rounded-lg">
							<div className="px-4 py-5 sm:p-6">
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Update Complaint
								</h3>
								<form onSubmit={handleUpdate} className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Status
										</label>
										<select
											value={updateData.status}
											onChange={(e) =>
												setUpdateData({ ...updateData, status: e.target.value })
											}
											className="mt-1 block w-full border-gray-300 rounded-lg p-2 border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										>
											<option value="Pending">Pending</option>
											<option value="In Progress">In Progress</option>
											<option value="Resolved">Resolved</option>
											<option value="Rejected">Rejected</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700">
											Remarks
										</label>
										<textarea
											value={updateData.remarks}
											onChange={(e) =>
												setUpdateData({
													...updateData,
													remarks: e.target.value,
												})
											}
											rows={3}
											className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											placeholder="Add remarks..."
										/>
									</div>

									<button
										type="submit"
										disabled={updating}
										className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
									>
										{updating ? "Updating..." : "Update Complaint"}
									</button>
								</form>
							</div>
						</div>
					)}

					{/* Remarks Display */}
					{complaint.remarks && (
						<div className="bg-white shadow sm:rounded-lg">
							<div className="px-4 py-5 sm:p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Admin Remarks
								</h3>
								<p className="text-gray-700 whitespace-pre-wrap">
									{complaint.remarks}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* complain Chat */}
			<ComplaintChat complaintId={complaint._id} token={token} user={user} />
		</div>
	);
};

export default ComplaintDetails;
