import { Navigate } from "react-router-dom";
import { useAdmin } from "../pages/AdminLogin";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
