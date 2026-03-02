import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // token → user logged in or not
  // initialized → auth check finished or still loading
  const { token, initialized } = useSelector((state) => state.auth);

  // while auth restore is running, don't redirect yet
  if (!initialized) {
    return <div>Loading...</div>;
  }

  // after auth check, if no token → block route
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // user authenticated → allow page
  return children;
}