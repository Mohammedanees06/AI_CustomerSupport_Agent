import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "../../services/apiClient";

const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5 transition-colors">
    <p className="text-sm text-[var(--text-muted)] mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color || "text-[var(--text)]"}`}>{value}</p>
    {sub && <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>}
  </div>
);

export default function AnalyticsPage() {
  const businessId = useSelector((state) => state.business.business?._id);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;

    apiClient
      .get(`/monitor/analytics/${businessId}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Analytics fetch error:", err))
      .finally(() => setLoading(false));
  }, [businessId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
        Loading analytics...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
        Failed to load analytics.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)]">Analytics</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Overview of your AI support system performance.
        </p>
      </div>

      <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">
        Core Metrics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Messages" value={data.totalMessages} sub="All customer messages" />
        <StatCard label="AI Responses" value={data.totalAIResponses} sub="Handled by AI" color="text-blue-500" />
        <StatCard label="Conversations" value={data.totalConversations} sub="Total threads" />
        <StatCard label="Order Lookups" value={data.totalOrderLookups} sub="Order queries resolved" color="text-purple-500" />
      </div>

      <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">
        Tickets
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Tickets Created" value={data.totalTicketsCreated} sub="Escalated to humans" color="text-yellow-500" />
        <StatCard label="Open Tickets" value={data.openTickets} sub="Needs attention" color="text-red-500" />
        <StatCard label="Resolved Tickets" value={data.resolvedTickets} sub="Closed successfully" color="text-green-500" />
      </div>

      <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">
        AI Performance
      </h2>
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-[var(--text-muted)]">AI Resolution Rate</p>
          <p className="text-2xl font-bold text-[var(--text)]">{data.resolutionRate}%</p>
        </div>
        <div className="w-full bg-[var(--border)] rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              data.resolutionRate >= 70 ? "bg-green-500"
              : data.resolutionRate >= 40 ? "bg-yellow-500"
              : "bg-red-500"
            }`}
            style={{ width: `${data.resolutionRate}%` }}
          />
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          Percentage of messages resolved by AI without human escalation.
        </p>
      </div>

    </div>
  );
}