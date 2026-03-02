import { Outlet, NavLink } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";

export default function DashboardLayout() {
  return (
    // full dashboard container
    <div className="min-h-screen flex">

      {/* SIDEBAR = persists across all dashboard pages */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">AI Support</h2>

        <nav className="space-y-3">

          {/* NavLink keeps SPA navigation + auto active styling */}
          <NavLink
            to="/dashboard/chat"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive
                  ? "bg-gray-700 text-blue-400"
                  : "hover:bg-gray-800"
              }`
            }
          >
            Chat
          </NavLink>

        </nav>
      </aside>

      {/* RIGHT SIDE (header + page content) */}
      <div className="flex-1 flex flex-col">

        {/* HEADER stays fixed while pages change */}
        <DashboardHeader />

        {/* Outlet renders child routes dynamically */}
        <main className="flex-1 bg-gray-100 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}