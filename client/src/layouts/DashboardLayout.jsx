import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30
          w-60 flex flex-col p-5 border-r transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          background: "var(--accent)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
            >
              🤖
            </div>
            <span className="text-white font-bold text-base tracking-tight">SupportAI</span>
          </div>
          {/* Close button mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/60 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="space-y-0.5 flex-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom brand */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-[11px] text-white/30 font-mono tracking-widest uppercase">SupportAI v1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main
          className="flex-1 p-4 md:p-6 overflow-auto"
          style={{ background: "var(--bg)" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}