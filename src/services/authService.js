import api from "./api.js";

// Auth API calls
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

// Complaint API calls
export const complaintAPI = {
  // Create complaint
  create: async (complaintData) => {
    const response = await api.post("/complaints", complaintData);
    return response.data;
  },

  // Get all complaints (admin)
  getAll: async (params = {}) => {
    const response = await api.get("/complaints", { params });
    return response.data;
  },

  // Get user's complaints
  getMyComplaints: async () => {
    const response = await api.get("/complaints/my");
    return response.data;
  },

  // Get single complaint
  getById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  // Update complaint
  update: async (id, updateData) => {
    const response = await api.put(`/complaints/${id}`, updateData);
    return response.data;
  },

  // Delete complaint
  delete: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },
};

// Admin API calls
export const adminAPI = {
  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  // Get single user
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get dashboard stats
  getStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  // Get chart data
  getChartData: async (days = 30) => {
    const response = await api.get("/admin/chart-data", { params: { days } });
    return response.data;
  },

  // Update complaint status
  updateComplaintStatus: async (id, status) => {
    const response = await api.put(`/admin/complaints/${id}/status`, {
      status,
    });
    return response.data;
  },
};
