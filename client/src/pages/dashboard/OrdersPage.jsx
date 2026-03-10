import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "../../services/apiClient";

const STATUS_COLORS = {
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const STATUSES = ["processing", "shipped", "delivered", "cancelled"];

const emptyForm = {
  orderNumber: "",
  customerEmail: "",
  status: "processing",
  trackingNumber: "",
  totalAmount: "",
};

export default function OrdersPage() {
  const businessId = useSelector((state) => state.business.business?._id);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!businessId) return;
    fetchOrders();
  }, [businessId]);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get(`/orders/business/${businessId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.orderNumber || !form.customerEmail) {
      setError("Order number and email are required.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingOrder) {
        const res = await apiClient.patch(`/orders/${editingOrder._id}`, {
          status: form.status,
          trackingNumber: form.trackingNumber,
          totalAmount: form.totalAmount ? Number(form.totalAmount) : undefined,
          customerEmail: form.customerEmail,
        });
        setOrders((prev) =>
          prev.map((o) => (o._id === editingOrder._id ? res.data : o))
        );
      } else {
        const res = await apiClient.post("/orders", {
          businessId,
          orderNumber: form.orderNumber,
          customerEmail: form.customerEmail,
          status: form.status,
          trackingNumber: form.trackingNumber,
          totalAmount: form.totalAmount ? Number(form.totalAmount) : undefined,
        });
        setOrders((prev) => [res.data, ...prev]);
      }
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save order.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setForm({
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      status: order.status,
      trackingNumber: order.trackingNumber || "",
      totalAmount: order.totalAmount || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await apiClient.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingOrder(null);
    setForm(emptyForm);
    setError("");
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          + Add Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by order # or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
        >
          <option value="all">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Order #</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tracking</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  No orders found
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    #{order.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.customerEmail}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.trackingNumber || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.totalAmount ? `₹${order.totalAmount}` : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-xs px-3 py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingOrder ? "Edit Order" : "Add New Order"}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Order Number</label>
                <input
                  type="text"
                  value={form.orderNumber}
                  onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                  disabled={!!editingOrder}
                  placeholder="e.g. ORD-1001"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Customer Email</label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  placeholder="customer@email.com"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Tracking Number</label>
                <input
                  type="text"
                  value={form.trackingNumber}
                  onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })}
                  placeholder="e.g. TRK-5001"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Total Amount (₹)</label>
                <input
                  type="number"
                  value={form.totalAmount}
                  onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                  placeholder="e.g. 999"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={closeForm}
                className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                {submitting ? "Saving..." : editingOrder ? "Update Order" : "Create Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}