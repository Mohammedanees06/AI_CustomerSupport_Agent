import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/auth.slice";
import { useLocation } from "react-router-dom";

export default function DashboardHeader() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // get last part of url as title
  const pageTitle =
    location.pathname.split("/").pop()?.toUpperCase() || "DASHBOARD";

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      {/* Dynamic title */}
      <h1 className="font-semibold text-lg">{pageTitle}</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.name || "User"}
        </span>

        <button
          onClick={() => dispatch(logout())}
          className="px-3 py-1 bg-gray-900 text-white rounded"
        >
          Logout
        </button>
      </div>

    </header>
  );
}