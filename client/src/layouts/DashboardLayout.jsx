import { Outlet, NavLink } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";

const links = [
  { to: "/dashboard/chat", label: "Chat" },
  { to: "/dashboard/tickets", label: "Tickets" },
  { to: "/dashboard/orders", label: "Orders" },
  { to: "/dashboard/knowledge", label: "Knowledge Base" },
  { to: "/dashboard/analytics", label: "Analytics" },
  { to: "/dashboard/embed", label: "Embed Widget" },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">

      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">AI Support</h2>
        <nav className="space-y-3">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${
                  isActive ? "bg-gray-700 text-blue-400" : "hover:bg-gray-800"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}