import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const FEATURES = [
  { icon: "🧠", title: "RAG Knowledge Retrieval", desc: "Upload docs or text. The AI searches your knowledge base using vector embeddings to answer accurately." },
  { icon: "⚡", title: "Real-time Chat", desc: "Conversations stream live between customers and the dashboard via WebSocket — no polling." },
  { icon: "🎙️", title: "Voice Pipeline (STT/TTS)", desc: "Customers can call in. Speech-to-text feeds the AI, text-to-speech delivers the reply." },
  { icon: "🔁", title: "Background Job Queue", desc: "BullMQ + Redis offloads AI processing so the server never blocks under load." },
  { icon: "🧩", title: "Embeddable Widget", desc: "One script tag. Any website. Businesses embed the chat widget like Intercom." },
  { icon: "🏢", title: "Multi-tenant", desc: "Each business gets isolated knowledge bases, analytics, orders, and tickets." },
  { icon: "🛒", title: "E-commerce Integrations", desc: "Shopify and WooCommerce connectors. Customers query order status directly in chat." },
  { icon: "📊", title: "Analytics Dashboard", desc: "Track conversations, tickets, AI confidence scores, and response rates — live." },
];

const STACK = ["React", "Redux Toolkit", "Node.js", "Express", "MongoDB", "Redis", "BullMQ", "Socket.io", "Gemini AI", "Twilio", "Passport.js", "Vite"];

const STEPS = [
  { n: "01", title: "Business signs up", desc: "Owner registers, creates a business profile, and uploads their knowledge base." },
  { n: "02", title: "Embed the widget", desc: "Copy one script tag and paste it into any website. The chat button appears instantly." },
  { n: "03", title: "Customer chats", desc: "Customer asks a question. The AI searches the knowledge base via RAG and replies in real time." },
  { n: "04", title: "Dashboard updates live", desc: "The owner sees conversations, analytics, tickets, and order lookups — all via WebSocket." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const business = useSelector((state) => state.business.business);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Determine dashboard link based on role
  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    return business ? "/dashboard/chat" : "/business-setup";
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: "var(--accent)" }}>🤖</div>
          <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>SupportAI</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "var(--text-muted)" }}>Features</a>
          <a href="#how-it-works" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "var(--text-muted)" }}>How it works</a>
          <a href="https://github.com/Mohammedanees06/AI_CustomerSupport_Agent" target="_blank" rel="noreferrer" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "var(--text-muted)" }}>GitHub</a>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            // ✅ Logged in — show user avatar + dashboard button
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-muted)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--accent)" }}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span>{user?.name}</span>
              </div>
              <button
                onClick={() => navigate(getDashboardPath())}
                className="text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Go to Dashboard →
              </button>
            </>
          ) : (
            // ✅ Not logged in — show login + register
            <>
              <Link
                to="/login"
                className="text-sm font-medium px-4 py-2 rounded-lg border hover:opacity-80 transition-opacity"
                style={{ color: "var(--text-muted)", borderColor: "var(--border)", background: "transparent" }}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-3xl mx-auto text-center px-6 py-20 md:py-28">
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-8 border" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Live demo available
          </div>
        </div>

        <h1 className={`text-4xl md:text-6xl font-semibold leading-tight tracking-tight mb-6 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ color: "var(--text)" }}>
          AI customer support,{" "}
          <span style={{ color: "var(--text-muted)" }}>embedded anywhere.</span>
        </h1>

        <p className={`text-lg leading-relaxed mb-10 max-w-xl mx-auto transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ color: "var(--text-muted)" }}>
          A multi-tenant SaaS platform with RAG-powered AI, real-time voice pipeline, background job queues, and a one-line embeddable widget.
        </p>

        <div className={`flex flex-wrap gap-3 justify-center transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          {isAuthenticated ? (
            <button
              onClick={() => navigate(getDashboardPath())}
              className="px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Open Dashboard →
            </button>
          ) : (
            <button
              onClick={() => window.open("https://ai-customer-support-system.netlify.app", "_blank")}
              className="px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Open Dashboard
            </button>
          )}
          <button
            onClick={() => window.open("https://chat-support-widget.netlify.app", "_blank")}
            className="px-6 py-3 rounded-lg font-medium text-sm border hover:opacity-80 transition-opacity"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
          >
            Try the widget →
          </button>
          <button
            onClick={() => window.open("https://github.com/Mohammedanees06/AI_CustomerSupport_Agent", "_blank")}
            className="px-6 py-3 rounded-lg font-medium text-sm border hover:opacity-80 transition-opacity"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
          >
            View source
          </button>
        </div>

        {/* Show greeting if logged in, demo creds if not */}
        {isAuthenticated ? (
          <p className={`mt-6 text-xs font-mono transition-all duration-700 delay-500 ${visible ? "opacity-100" : "opacity-0"}`} style={{ color: "var(--text-muted)" }}>
            👋 Welcome back, {user?.name}
          </p>
        ) : (
          <p className={`mt-6 text-xs font-mono transition-all duration-700 delay-500 ${visible ? "opacity-100" : "opacity-0"}`} style={{ color: "var(--text-muted)" }}>
            demo@aicustomer.com · demo1234
          </p>
        )}
      </section>

      <hr style={{ borderColor: "var(--border)" }} />

      {/* STACK */}
      <section className="py-12 px-6 text-center">
        <p className="text-xs font-mono tracking-widest mb-5" style={{ color: "var(--text-muted)" }}>BUILT WITH</p>
        <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
          {STACK.map(s => (
            <span key={s} className="px-3 py-1.5 rounded-full text-xs font-mono border" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
              {s}
            </span>
          ))}
        </div>
      </section>

      <hr style={{ borderColor: "var(--border)" }} />

      {/* FEATURES */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <p className="text-xs font-mono tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>FEATURES</p>
        <h2 className="text-2xl md:text-3xl font-semibold mb-10 tracking-tight" style={{ color: "var(--text)" }}>What's under the hood</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="p-5 rounded-xl border hover:opacity-90 transition-opacity" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ borderColor: "var(--border)" }} />

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-2xl mx-auto px-6 py-16 md:py-20">
        <p className="text-xs font-mono tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>HOW IT WORKS</p>
        <h2 className="text-2xl md:text-3xl font-semibold mb-10 tracking-tight" style={{ color: "var(--text)" }}>From signup to live chat in minutes</h2>
        <div className="flex flex-col">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`flex gap-8 py-8 ${i !== 0 ? "border-t" : ""}`} style={{ borderColor: "var(--border)" }}>
              <span className="text-xs font-mono pt-0.5 min-w-[28px]" style={{ color: "var(--text-muted)" }}>{s.n}</span>
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ borderColor: "var(--border)" }} />

      {/* FOOTER CTA */}
      <section className="text-center px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight" style={{ color: "var(--text)" }}>See it live</h2>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Open the widget as a customer, then login to the dashboard to watch it happen in real time.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => window.open("https://chat-support-widget.netlify.app", "_blank")}
            className="px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Try the widget
          </button>
          <button
            onClick={() => isAuthenticated ? navigate(getDashboardPath()) : navigate("/login")}
            className="px-6 py-3 rounded-lg font-medium text-sm border hover:opacity-80 transition-opacity"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface)" }}
          >
            {isAuthenticated ? "Go to dashboard →" : "Business login"}
          </button>
        </div>
        <p className="mt-6 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          ⚠ Free tier backend — first load may take ~30s to wake up
        </p>
      </section>

    </div>
  );
}