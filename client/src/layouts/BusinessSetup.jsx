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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-900 rounded-2xl mb-4">
              <span className="text-white text-2xl">🤖</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Your Business</h1>
            <p className="text-gray-500 text-sm mt-2">
              You already have a business set up.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-4">

            {/* Current business info */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 border">
              <p className="text-xs text-gray-400 mb-0.5">Current Business</p>
              <p className="text-lg font-semibold text-gray-900">{existingBusiness.name}</p>
            </div>

            {/* Go to dashboard */}
            <button
              onClick={() => navigate("/dashboard/chat")}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-700 transition-colors"
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
                  className="border rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-900 rounded-2xl mb-4">
            <span className="text-white text-2xl">🤖</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Set up your business</h1>
          <p className="text-gray-500 text-sm mt-2">
            This takes 10 seconds. You can change it later.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Business Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Store, My Clinic, Tech Hub"
                className="w-full border rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-400"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Business →"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your AI support system will be ready instantly after setup.
        </p>
      </div>
    </div>
  );
}