import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "../../services/apiClient";

const STATUS_COLORS = {
  processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
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
        setOrders((prev) => prev.map((o) => (o._id === editingOrder._id ? res.data : o)));
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
      <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Orders</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">{orders.length} total orders</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[var(--cta)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
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
          className="flex-1 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] placeholder:text-[var(--text-muted)]"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        >
          <option value="all">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg)] border-b border-[var(--border)]">
            <tr>
              {["Order #", "Customer Email", "Status", "Tracking", "Amount", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[var(--text-muted)]">
                  No orders found
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order._id} className="hover:bg-[var(--bg)] transition-colors">
                  <td className="px-4 py-3 font-medium text-[var(--text)]">#{order.orderNumber}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{order.customerEmail}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">
                    {order.trackingNumber || <span className="opacity-30">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">
                    {order.totalAmount ? `₹${order.totalAmount}` : <span className="opacity-30">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)] text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-xs px-3 py-1 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg hover:border-[var(--accent)] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-xs px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-[var(--text)] mb-4">
              {editingOrder ? "Edit Order" : "Add New Order"}
            </h2>

            <div className="space-y-3">
              {[
                { label: "Order Number", key: "orderNumber", type: "text", placeholder: "e.g. ORD-1001", disabled: !!editingOrder },
                { label: "Customer Email", key: "customerEmail", type: "email", placeholder: "customer@email.com" },
                { label: "Tracking Number", key: "trackingNumber", type: "text", placeholder: "e.g. TRK-5001" },
                { label: "Total Amount (₹)", key: "totalAmount", type: "number", placeholder: "e.g. 999" },
              ].map(({ label, key, type, placeholder, disabled }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] placeholder:text-[var(--text-muted)] disabled:opacity-50"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={closeForm}
                className="flex-1 border border-[var(--border)] rounded-lg py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--bg)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-[var(--cta)] text-white rounded-lg py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
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