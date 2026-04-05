import { Outlet, NavLink } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";

const links = [
  { to: "/dashboard/chat", label: "💬 Chat" },
  { to: "/dashboard/tickets", label: "🎫 Tickets" },
  { to: "/dashboard/orders", label: "📦 Orders" },
  { to: "/dashboard/knowledge", label: "🧠 Knowledge Base" },
  { to: "/dashboard/analytics", label: "📊 Analytics" },
  { to: "/dashboard/embed", label: "🔗 Embed Widget" },
  { to: "/dashboard/profile", label: "⚙️ Profile" },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-zinc-950 transition-colors">

      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 dark:bg-zinc-900 border-r border-gray-800 dark:border-zinc-800 flex flex-col p-5 transition-colors">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">🤖</div>
          <h2 className="text-white font-bold text-base">AI Support</h2>
        </div>

        <nav className="space-y-1 flex-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white font-medium"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 bg-gray-100 dark:bg-zinc-950 p-6 overflow-auto transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}