import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/admin/businesses")
      .then((res) => setBusinesses(res.data))
      .catch((err) => console.error("Admin businesses error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSuspend = async (id) => {
    try {
      await apiClient.patch(`/admin/business/${id}/suspend`);
      setBusinesses((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "suspended" } : b))
      );
    } catch (err) {
      console.error("Suspend failed:", err);
    }
  };

  const handleActivate = async (id) => {
    try {
      await apiClient.patch(`/admin/business/${id}/activate`);
      setBusinesses((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "active" } : b))
      );
    } catch (err) {
      console.error("Activate failed:", err);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading businesses...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Businesses</h1>
        <p className="text-gray-500 text-sm mt-1">{businesses.length} registered businesses</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Business</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Owner</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Conversations</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Messages</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tickets</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {businesses.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  No businesses found
                </td>
              </tr>
            ) : (
              businesses.map((biz) => (
                <tr key={biz._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{biz.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(biz.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {biz.owner ? (
                      <>
                        <p className="text-gray-700">{biz.owner.name}</p>
                        <p className="text-xs text-gray-400">{biz.owner.email}</p>
                      </>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{biz.stats?.totalConversations ?? 0}</td>
                  <td className="px-4 py-3 text-gray-700">{biz.stats?.totalMessages ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className="text-gray-700">{biz.stats?.totalTickets ?? 0}</span>
                    {biz.stats?.openTickets > 0 && (
                      <span className="ml-1 text-xs text-red-500">
                        ({biz.stats.openTickets} open)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      biz.status === "suspended"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}>
                      {biz.status || "active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {biz.status === "suspended" ? (
                      <button
                        onClick={() => handleActivate(biz._id)}
                        className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSuspend(biz._id)}
                        className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}