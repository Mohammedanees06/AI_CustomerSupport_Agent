import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "../../services/apiClient";

const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-white rounded-xl border p-5">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color || "text-gray-900"}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

export default function AnalyticsPage() {
  const businessId = useSelector((state) => state.business.business?._id);
  const [data, setData] = useState(null);
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;

    Promise.all([
      apiClient.get(`/monitor/analytics/${businessId}`),
      apiClient.get("/monitor/queue"),
    ])
      .then(([analyticsRes, queueRes]) => {
        setData(analyticsRes.data);
        setQueue(queueRes.data);
      })
      .catch((err) => console.error("Analytics fetch error:", err))
      .finally(() => setLoading(false));
  }, [businessId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading analytics...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Failed to load analytics.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of your AI support system performance.
        </p>
      </div>

      {/* Core Metrics */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Core Metrics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Messages"
          value={data.totalMessages}
          sub="All customer messages"
        />
        <StatCard
          label="AI Responses"
          value={data.totalAIResponses}
          sub="Handled by AI"
          color="text-blue-600"
        />
        <StatCard
          label="Conversations"
          value={data.totalConversations}
          sub="Total threads"
        />
        <StatCard
          label="Order Lookups"
          value={data.totalOrderLookups}
          sub="Order queries resolved"
          color="text-purple-600"
        />
      </div>

      {/* Tickets */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Tickets
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Tickets Created"
          value={data.totalTicketsCreated}
          sub="Escalated to humans"
          color="text-yellow-600"
        />
        <StatCard
          label="Open Tickets"
          value={data.openTickets}
          sub="Needs attention"
          color="text-red-600"
        />
        <StatCard
          label="Resolved Tickets"
          value={data.resolvedTickets}
          sub="Closed successfully"
          color="text-green-600"
        />
      </div>

      {/* AI Resolution Rate */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        AI Performance
      </h2>
      <div className="bg-white rounded-xl border p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">AI Resolution Rate</p>
          <p className="text-2xl font-bold text-gray-900">{data.resolutionRate}%</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              data.resolutionRate >= 70
                ? "bg-green-500"
                : data.resolutionRate >= 40
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${data.resolutionRate}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Percentage of messages resolved by AI without human escalation.
        </p>
      </div>

      {/* Queue Stats */}
      {queue && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Queue Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Waiting" value={queue.waiting} sub="In queue" />
            <StatCard label="Active" value={queue.active} sub="Processing now" color="text-blue-600" />
            <StatCard label="Completed" value={queue.completed} sub="Done" color="text-green-600" />
            <StatCard label="Failed" value={queue.failed} sub="Errored" color="text-red-600" />
          </div>
        </>
      )}
    </div>
  );
}