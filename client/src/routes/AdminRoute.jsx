import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, initialized } = useSelector((state) => state.auth);

  if (!initialized) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
}