import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function BusinessGuard({ children }) {
  const { user, initialized } = useSelector((state) => state.auth);

  // wait until auth restore finishes
  if (!initialized) {
    return <div>Loading...</div>;
  }

  // if user has no business → force setup
  if (!user?.businessId) {
    return <Navigate to="/business/setup" replace />;
  }

  // business exists → allow dashboard
  return children;
}