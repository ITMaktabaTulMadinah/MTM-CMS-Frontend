import { useAuth } from "../store/authContext.jsx";
import UserDashboard from "../components/dashboard/UserDashboard.jsx";
import AdminDashboard from "../components/dashboard/AdminDashboard.jsx";

const Dashboard = () => {
	const { user } = useAuth();

	return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
