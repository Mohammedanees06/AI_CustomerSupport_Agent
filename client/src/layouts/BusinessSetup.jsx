import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import { setBusiness } from "../store/business.slice";

export default function BusinessSetup() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const existingBusiness = useSelector((state) => state.business.business);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post("/business", { name });
      dispatch(setBusiness(res.data));
      navigate("/dashboard/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create business");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // EXISTING BUSINESS VIEW
  // ============================================
  if (existingBusiness) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: "var(--accent)" }}
            >
              <span className="text-white text-2xl">🤖</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Your Business</h1>
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
              You already have a business set up.
            </p>
          </div>

          <div
            className="rounded-2xl border p-8 space-y-4"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            {/* Current business info */}
            <div
              className="rounded-xl px-4 py-3 border"
              style={{ background: "var(--bg)", borderColor: "var(--border)" }}
            >
              <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Current Business</p>
              <p className="text-lg font-semibold" style={{ color: "var(--text)" }}>{existingBusiness.name}</p>
            </div>

            {/* Go to dashboard */}
            <button
              onClick={() => navigate("/dashboard/chat")}
              className="w-full py-3 rounded-xl font-medium text-sm text-white hover:opacity-90 transition-opacity"
              style={{ background: "var(--accent)" }}
            >
              Go to Dashboard →
            </button>

            {/* Quick nav links */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { label: "💬 Chat", to: "/dashboard/chat" },
                { label: "🎫 Tickets", to: "/dashboard/tickets" },
                { label: "📦 Orders", to: "/dashboard/orders" },
                { label: "📊 Analytics", to: "/dashboard/analytics" },
              ].map((link) => (
                <button
                  key={link.to}
                  onClick={() => navigate(link.to)}
                  className="rounded-xl py-2 text-sm font-medium border hover:opacity-80 transition-opacity"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-muted)",
                    background: "var(--bg)",
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
            Your AI support system is active.
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // NEW BUSINESS SETUP VIEW
  // ============================================
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "var(--accent)" }}
          >
            <span className="text-white text-2xl">🤖</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Set up your business</h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
            This takes 10 seconds. You can change it later.
          </p>
        </div>

        <div
          className="rounded-2xl border p-8"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--text)" }}
              >
                Business Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Store, My Clinic, Tech Hub"
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-colors"
                style={{
                  background: "var(--bg)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-3 rounded-xl font-medium text-sm text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ background: "var(--cta)" }}
            >
              {loading ? "Creating..." : "Create Business →"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
          Your AI support system will be ready instantly after setup.
        </p>
      </div>
    </div>
  );
}