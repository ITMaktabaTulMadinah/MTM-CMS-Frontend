import { Navigate } from "react-router-dom";
import { useAuth } from "../store/authContext.jsx";
import Spinner from "./Spinner.jsx";

const ProtectedRoute = ({ children, adminOnly = false }) => {
	const { isAuthenticated, user, loading } = useAuth();

	if (loading) {
		return (
			<Spinner
				size="large"
				className="flex justify-center items-center h-screen"
			/>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (adminOnly && user?.role !== "admin") {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
};

export default ProtectedRoute;
