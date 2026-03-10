import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

const StatCard = ({ label, value, color, sub }) => (
  <div className="bg-white rounded-xl border p-5">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color || "text-gray-900"}`}>{value ?? "—"}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/admin/analytics")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Admin analytics error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading platform analytics...</div>;
  }

  if (!data) {
    return <div className="text-gray-400 text-sm">Failed to load analytics.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500 text-sm mt-1">All businesses combined stats.</p>
      </div>

      {/* Platform Stats */}
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Platform Stats
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Businesses" value={data.totalBusinesses} sub="Registered" color="text-blue-600" />
        <StatCard label="Total Users" value={data.totalUsers} sub="Business owners" />
        <StatCard label="Total Conversations" value={data.totalConversations} sub="All time" color="text-purple-600" />
        <StatCard label="Total Messages" value={data.totalMessages} sub="All time" />
      </div>

      {/* Ticket Stats */}
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Tickets
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Tickets" value={data.totalTickets} sub="All businesses" color="text-yellow-600" />
        <StatCard label="Open Tickets" value={data.openTickets} sub="Needs attention" color="text-red-500" />
        <StatCard label="Resolved Tickets" value={data.resolvedTickets} sub="Closed" color="text-green-600" />
      </div>

      {/* Messages per day */}
      {data.messagesPerDay?.length > 0 && (
        <>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Messages — Last 7 Days
          </h2>
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-end gap-2 h-32">
              {data.messagesPerDay.map((d) => {
                const max = Math.max(...data.messagesPerDay.map((x) => x.count));
                const height = max > 0 ? (d.count / max) * 100 : 0;
                return (
                  <div key={d._id} className="flex flex-col items-center flex-1 gap-1">
                    <span className="text-xs text-gray-500">{d.count}</span>
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${height}%`, minHeight: "4px" }}
                    />
                    <span className="text-[10px] text-gray-400">
                      {new Date(d._id).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}