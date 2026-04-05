import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/auth.slice";
import { setTheme } from "../store/app.slice";
import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
  chat: "Chat",
  tickets: "Tickets",
  orders: "Orders",
  knowledge: "Knowledge Base",
  analytics: "Analytics",
  embed: "Embed Widget",
  profile: "Profile",
};

export default function DashboardHeader() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.app.theme);
  const location = useLocation();

  const slug = location.pathname.split("/").pop();
  const pageTitle = PAGE_TITLES[slug] || "Dashboard";

  const toggleTheme = () => {
    dispatch(setTheme(theme === "dark" ? "light" : "dark"));
  };

  return (
    <header className="h-14 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-6 transition-colors">

      <h1 className="font-semibold text-gray-800 dark:text-white text-sm tracking-wide">{pageTitle}</h1>

      <div className="flex items-center gap-3">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-sm"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <span className="text-sm text-gray-600 dark:text-zinc-400">{user?.name || "User"}</span>
        </div>

        <button
          onClick={() => dispatch(logout())}
          className="px-3 py-1.5 text-xs bg-gray-900 dark:bg-zinc-800 text-white dark:text-zinc-300 rounded-lg hover:bg-gray-700 dark:hover:bg-zinc-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}