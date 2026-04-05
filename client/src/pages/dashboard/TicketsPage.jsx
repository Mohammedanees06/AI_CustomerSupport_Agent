import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

const STATUS_STYLES = {
  open: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "in-progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const PRIORITY_STYLES = {
  low: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function TicketsPage() {
  const businessId = useSelector((state) => state.business.business?._id);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (!businessId) return;

    apiClient
      .get(`/tickets/${businessId}`)
      .then((res) => setTickets(res.data))
      .catch((err) => console.error("Failed to fetch tickets:", err))
      .finally(() => setLoading(false));
  }, [businessId]);

  const updateTicket = async (ticketId, changes) => {
    try {
      const res = await apiClient.patch(`/tickets/${ticketId}`, changes);
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? res.data : t))
      );
    } catch (err) {
      console.error("Failed to update ticket:", err);
    }
  };

  const filtered =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    "in-progress": tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">Support Tickets</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Escalated conversations where AI confidence was low.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[var(--border)]">
        {["all", "open", "in-progress", "resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              filter === s
                ? "border-[var(--accent)] text-[var(--text)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Tickets List */}
      {loading ? (
        <p className="text-[var(--text-muted)] text-sm">Loading tickets...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">
          <p className="text-4xl mb-3">🎉</p>
          <p className="font-medium">No tickets here</p>
          <p className="text-sm mt-1">All customer issues are resolved.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 transition-colors"
            >
              {/* Top: question + dropdowns */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-3">
                <div className="flex-1">

                  {/* Customer question */}
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                    Customer asked
                  </p>
                  <p className="text-sm text-[var(--text)] font-medium">
                    "{ticket.customerMessage}"
                  </p>

                  {/* AI response */}
                  {ticket.aiResponse && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                        AI replied
                      </p>
                      <p className="text-sm text-[var(--text-muted)] italic">
                        "{ticket.aiResponse.replace(/\n\nI've also opened.*$/, "").trim()}"
                      </p>
                    </div>
                  )}

                  {/* Confidence score */}
                  {ticket.confidenceScore != null && (
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-xs text-[var(--text-muted)]">AI confidence:</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        ticket.confidenceScore < 0.4
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {Math.round(ticket.confidenceScore * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Status + Priority dropdowns */}
                <div className="flex gap-2 shrink-0">
                  <select
                    value={ticket.status}
                    onChange={(e) => updateTicket(ticket._id, { status: e.target.value })}
                    className="text-xs border border-[var(--border)] rounded-lg px-2 py-1.5 bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <select
                    value={ticket.priority}
                    onChange={(e) => updateTicket(ticket._id, { priority: e.target.value })}
                    className="text-xs border border-[var(--border)] rounded-lg px-2 py-1.5 bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Bottom: meta + view conversation */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <div className="flex gap-2 items-center flex-wrap">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[ticket.status]}`}>
                    {ticket.status}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[ticket.priority]}`}>
                    {ticket.priority} priority
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </span>
                </div>

                {ticket.conversation && (
                  <button
                    onClick={() => navigate(`/dashboard/chat?conversation=${ticket.conversation}`)}
                    className="text-xs text-[var(--accent)] hover:text-[var(--accent2)] font-medium flex items-center gap-1 transition-colors"
                  >
                    View Conversation →
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}