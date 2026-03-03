import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function BusinessGuard({ children }) {
  const { initialized, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const business = useSelector(
    (state) => state.business.business
  );

  // wait for auth restore
  if (!initialized) {
    return <div>Loading...</div>;
  }

  // not logged in → let ProtectedRoute handle it
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // logged in but no business → force onboarding
  if (!business) {
    return <Navigate to="/business-setup" replace />;
  }

  return children;
}