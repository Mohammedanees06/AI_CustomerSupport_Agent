import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function BusinessGuard({ children }) {
  const { initialized, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const business = useSelector(
    (state) => state.business.business
  );

  if (!initialized) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ✅ Admin has no business — skip this guard
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;

  if (!business) return <Navigate to="/business-setup" replace />;

  return children;
}