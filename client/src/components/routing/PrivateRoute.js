import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
    const auth = useSelector((state) => state.auth);
    const { isAuthenticated, loading } = auth;

    if (loading) return null;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
