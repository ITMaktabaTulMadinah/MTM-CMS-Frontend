import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./store/authContext.jsx";
import Layout from "./layouts/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

// Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComplaintForm from "./pages/ComplaintForm.jsx";
import ComplaintDetails from "./pages/ComplaintDetails.jsx";
import AllComplaints from "./pages/AllComplaints.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import Gatepass from "./pages/Gatepass.jsx";
import GatepassForm from "./components/gatepass/GatepassForm.jsx";
import GatepassDetails from "./pages/GatepassDetails.jsx";
import GatepassPrint from "./components/gatepass/GatepassPrint.jsx";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/complaints/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComplaintForm />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/complaints/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComplaintDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/complaints"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AllComplaints />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <Layout>
                    <AdminUsers />
                  </Layout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <Layout>
                    <AdminAnalytics />
                  </Layout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/gatepass"
              element={
                <AdminRoute>
                  <Layout>
                    <Gatepass />
                  </Layout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/gatepass/form"
              element={
                <AdminRoute>
                  <Layout>
                    <GatepassForm />
                  </Layout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/gatepass/:id"
              element={
                <AdminRoute>
                  <Layout>
                    <GatepassDetails />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/gatepass/print/:id"
              element={
                <AdminRoute>
                  <Layout>
                    <GatepassPrint />
                  </Layout>
                </AdminRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
