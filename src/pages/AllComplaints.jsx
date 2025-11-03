import { useState, useEffect } from "react";
import { complaintAPI, adminAPI } from "../services/authService.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner.jsx";
import { useAuth } from "../store/authContext.jsx";

const AllComplaints = () => {
	const [complaints, setComplaints] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filter, setFilter] = useState({
		status: "",
		category: "",
		priority: "",
	});
	const { user } = useAuth();
	// const user = useAuth();
	// console.log(user);

	useEffect(() => {
		fetchComplaints();
	}, [filter]);

	const fetchComplaints = async () => {
		try {
			setLoading(true);
			const response =
				user?.role === "admin"
					? await complaintAPI.getAll(filter)
					: await complaintAPI.getMyComplaints();
			setComplaints(response.complaints || response || []);
			console.log(response);
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

	const handleDeleteComplaint = async (complaintId) => {
		if (window.confirm("Are you sure you want to delete this complaint?")) {
			try {
				await complaintAPI.deleteComplaint(complaintId);
				toast.success("Complaint deleted successfully");
				fetchComplaints();
			} catch (error) {
				toast.error("Failed to delete complaint");
			}
		}
	};

	const filteredComplaints = complaints.filter((complaint) => {
		const matchesSearch =
			complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			complaint.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesSearch;
	});

	const getStatusColor = (status) => {
		switch (status) {
			case "Pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "In Progress":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "Resolved":
				return "bg-green-100 text-green-800 border-green-200";
			case "Rejected":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
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

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						{user?.role === "admin" ? "All Complaints" : "My Complaints"}
					</h1>
					<p className="mt-2 text-sm text-gray-600">
						Manage and track all complaints in the system
					</p>
				</div>
				<button
					onClick={fetchComplaints}
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

			{/* Search and Filters */}
			<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Search Complaints
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
							Status
						</label>
						<select
							value={filter.status}
							onChange={(e) => setFilter({ ...filter, status: e.target.value })}
							className="block w-full border-gray-300 rounded-lg p-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						>
							<option value="">All Status</option>
							<option value="Pending">Pending</option>
							<option value="In Progress">In Progress</option>
							<option value="Resolved">Resolved</option>
							<option value="Rejected">Rejected</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Category
						</label>
						<select
							value={filter.category}
							onChange={(e) =>
								setFilter({ ...filter, category: e.target.value })
							}
							className="block w-full border-gray-300 rounded-lg p-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						>
							<option value="">All Categories</option>
							<option value="Hardware">Hardware</option>
							<option value="Software">Software</option>
							<option value="Network">Network</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Priority
						</label>
						<select
							value={filter.priority}
							onChange={(e) =>
								setFilter({ ...filter, priority: e.target.value })
							}
							className="block w-full border-gray-300 rounded-lg p-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						>
							<option value="">All Priorities</option>
							<option value="High">High</option>
							<option value="Medium">Medium</option>
							<option value="Low">Low</option>
						</select>
					</div>
				</div>
			</div>

			{/* Complaints Table */}
			<div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
				<div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
					<h3 className="text-lg font-semibold text-gray-900">
						{`${user?.role === "admin" ? "All Complaints" : "My Complaints"} (${
							filteredComplaints.length
						})`}
					</h3>
				</div>

				{filteredComplaints.length === 0 ? (
					<div className="px-6 py-12 text-center">
						<div className="text-gray-400 text-6xl mb-4">📋</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No complaints found
						</h3>
						<p className="text-gray-500">
							{searchTerm || filter.status || filter.category || filter.priority
								? "No complaints match your current filters."
								: "No complaints have been submitted yet."}
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Complain No.
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Complaint
									</th>
									{user?.role === "admin" && (
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											User
										</th>
									)}
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Category
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Priority
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Created
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredComplaints.map((complaint) => (
									<tr
										key={complaint._id}
										className="hover:bg-gray-50 transition-colors duration-200"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{`CMP-${complaint.complaintId}`}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<div className="flex-shrink-0 h-10 w-10">
													<div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
														<span className="text-blue-600 font-medium text-sm">
															{complaint.title.charAt(0).toUpperCase()}
														</span>
													</div>
												</div>
												<div className="ml-4">
													<div className="text-sm font-medium text-gray-900 truncate max-w-xs">
														{complaint?.title}
													</div>
													<div className="text-sm text-gray-500 truncate max-w-xs">
														{complaint?.description}
													</div>
												</div>
											</div>
										</td>
										{user?.role === "admin" && (
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{complaint.user?.name}
											</td>
										)}
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
												{complaint?.category}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
													complaint?.priority
												)}`}
											>
												{complaint?.priority}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<select
												value={complaint?.status}
												onChange={(e) =>
													handleStatusUpdate(complaint?._id, e.target.value)
												}
												className={`text-xs border-0 rounded-full px-3 py-1 font-medium ${getStatusColor(
													complaint.status
												)} focus:ring-2 focus:ring-blue-500`}
											>
												<option value="Pending">Pending</option>
												<option value="In Progress">In Progress</option>
												<option value="Resolved">Resolved</option>
												<option value="Rejected">Rejected</option>
											</select>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{new Date(complaint.createdAt).toLocaleDateString()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex space-x-2">
												<Link to={`${complaint?._id}`}>
													<button className="text-blue-600 hover:text-blue-900 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50">
														View
													</button>
												</Link>
												{user?.role === "admin" && (
													<button
														onClick={() =>
															handleDeleteComplaint(complaint?._id)
														}
														className="text-red-600 hover:text-red-900 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-red-50"
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

export default AllComplaints;
