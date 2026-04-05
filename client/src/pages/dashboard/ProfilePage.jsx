import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../../services/apiClient";
import { setBusiness } from "../../store/business.slice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const business = useSelector((state) => state.business.business);

  const [form, setForm] = useState({
    name: "",
    widgetTitle: "",
    welcomeMessage: "",
    widgetColor: "#111827",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || "",
        widgetTitle: business.widgetTitle || "Support Chat",
        welcomeMessage: business.welcomeMessage || "Hi! How can we help you today?",
        widgetColor: business.widgetColor || "#111827",
      });
    }
  }, [business]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiClient.patch("/business/my", form);
      dispatch(setBusiness(res.data));
      setSuccess("Business profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteInput !== business.name) return;
    setDeleting(true);
    try {
      await apiClient.delete("/business/my");
      window.location.href = "/business-setup";
    } catch (err) {
      setError("Failed to delete business.");
      setDeleting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(business?._id || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4 pb-16 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your business settings and widget customization.</p>
      </div>

      {/* General Info */}
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">General</h2>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Business Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Business ID</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={business?._id || ""}
              readOnly
              className="flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              {copied ? "✓ Copied" : "Copy ID"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Used in your embed script and API calls.</p>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Created</label>
          <p className="text-sm text-gray-600">
            {business?.createdAt ? new Date(business.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric"
            }) : "—"}
          </p>
        </div>
      </div>

      {/* Widget Customization */}
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Widget Customization</h2>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Chat Title</label>
          <input
            type="text"
            value={form.widgetTitle}
            onChange={(e) => setForm({ ...form, widgetTitle: e.target.value })}
            placeholder="Support Chat"
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Welcome Message</label>
          <textarea
            value={form.welcomeMessage}
            onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
            placeholder="Hi! How can we help you today?"
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-2 block">Widget Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.widgetColor}
              onChange={(e) => setForm({ ...form, widgetColor: e.target.value })}
              className="w-10 h-10 rounded-lg border cursor-pointer"
            />
            <span className="text-sm text-gray-500 font-mono">{form.widgetColor}</span>

            {/* Color presets */}
            <div className="flex gap-2 ml-2">
              {["#111827", "#2563eb", "#7c3aed", "#059669", "#dc2626"].map((color) => (
                <button
                  key={color}
                  onClick={() => setForm({ ...form, widgetColor: color })}
                  style={{ backgroundColor: color }}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    form.widgetColor === color ? "border-gray-400 scale-110" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-2 block">Preview</label>
          <div className="border rounded-xl overflow-hidden w-64 shadow-sm">
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ backgroundColor: form.widgetColor }}
            >
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-sm">🤖</div>
              <span className="text-white text-sm font-medium">{form.widgetTitle || "Support Chat"}</span>
            </div>
            <div className="bg-gray-50 px-4 py-3">
              <div className="bg-white rounded-lg px-3 py-2 text-xs text-gray-600 shadow-sm inline-block">
                {form.welcomeMessage || "Hi! How can we help you today?"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      {success && (
        <p className="text-green-600 text-sm bg-green-50 border border-green-100 rounded-lg px-4 py-2">{success}</p>
      )}
      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wide">Danger Zone</h2>
        <p className="text-sm text-gray-500">
          Deleting your business will permanently remove all conversations, tickets, knowledge base, and orders. This cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete Business
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Type <span className="font-semibold text-gray-900">{business?.name}</span> to confirm deletion:
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder={business?.name}
              className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteInput !== business?.name || deleting}
                className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-40"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}