import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/auth.thunks";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token } = useSelector((state) => state.auth);
  const hasBusiness = useSelector((state) => !!state.business.business);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (!token) return;
    navigate(hasBusiness ? "/dashboard" : "/business-setup", { replace: true });
  }, [token, hasBusiness]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  const handleGoogleRegister = () => {
    window.location.href = `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mx-auto mb-4" style={{ background: "var(--accent)" }}>
            🤖
          </div>
          <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--text)" }}>Create an account</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Start managing your AI customer support</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-7" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors focus:ring-2"
              style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors focus:ring-2"
              style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors focus:ring-2"
              style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold mt-1 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>OR</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleRegister}
            className="w-full py-3 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer links */}
        <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--accent)" }}>
            Log in
          </Link>
        </p>
        <p className="text-center text-xs mt-3">
          <Link to="/" className="hover:opacity-70 transition-opacity" style={{ color: "var(--text-muted)" }}>
            ← Back to home
          </Link>
        </p>

      </div>
    </div>
  );
}