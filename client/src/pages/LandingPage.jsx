import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "🧠",
    title: "RAG Knowledge Retrieval",
    desc: "Upload docs, PDFs, or text. The AI searches your knowledge base using vector embeddings to answer accurately.",
  },
  {
    icon: "⚡",
    title: "Real-time Chat & Socket.io",
    desc: "Conversations stream live between customers and the dashboard. No polling — pure WebSocket.",
  },
  {
    icon: "🎙️",
    title: "Voice Pipeline (STT/TTS)",
    desc: "Customers can call in. Speech-to-text feeds the AI, text-to-speech delivers the reply. Full loop.",
  },
  {
    icon: "🔁",
    title: "Background Job Queue",
    desc: "BullMQ + Redis offloads AI processing so the server never blocks. Handles spikes gracefully.",
  },
  {
    icon: "🧩",
    title: "Embeddable Widget",
    desc: "One script tag. Any website. Businesses embed the chat widget like Intercom — no dev required.",
  },
  {
    icon: "🏢",
    title: "Multi-tenant Architecture",
    desc: "Each business gets isolated knowledge bases, analytics, orders, and tickets. Built to scale.",
  },
  {
    icon: "🛒",
    title: "E-commerce Integrations",
    desc: "Shopify and WooCommerce connectors. Customers can query order status directly in chat.",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    desc: "Track total conversations, tickets raised, AI confidence scores, and response rates — all live.",
  },
];

const STACK = [
  "React", "Redux Toolkit", "Node.js", "Express",
  "MongoDB", "Redis", "BullMQ", "Socket.io",
  "Gemini AI", "Twilio", "Passport.js", "Vite",
];

const STEPS = [
  { n: "01", title: "Business signs up", desc: "Owner registers, creates a business profile, and uploads their knowledge base." },
  { n: "02", title: "Embed the widget", desc: "Copy one script tag and paste it into any website. The chat button appears instantly." },
  { n: "03", title: "Customer chats", desc: "Customer opens the widget, asks a question. The AI searches the knowledge base via RAG and replies in real time." },
  { n: "04", title: "Dashboard updates live", desc: "The owner sees the conversation, analytics, tickets, and order lookups — all updating via WebSocket." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#e8e8e2",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      overflowX: "hidden",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .land-fade { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .land-fade.in { opacity: 1; transform: translateY(0); }
        .land-fade.d1 { transition-delay: 0.1s; }
        .land-fade.d2 { transition-delay: 0.22s; }
        .land-fade.d3 { transition-delay: 0.34s; }
        .land-fade.d4 { transition-delay: 0.46s; }

        .feat-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 24px;
          transition: border-color 0.2s, background 0.2s;
        }
        .feat-card:hover { border-color: #444; background: #151515; }

        .step-num {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #555;
        }

        .pill {
          display: inline-block;
          background: #161616;
          border: 1px solid #2a2a2a;
          border-radius: 999px;
          padding: 5px 14px;
          font-size: 13px;
          color: #999;
          font-family: 'DM Mono', monospace;
        }

        .cta-primary {
          background: #e8e8e2;
          color: #0a0a0a;
          border: none;
          border-radius: 8px;
          padding: 13px 28px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .cta-primary:hover { opacity: 0.88; transform: translateY(-1px); }

        .cta-secondary {
          background: transparent;
          color: #888;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          padding: 13px 28px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, transform 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .cta-secondary:hover { border-color: #555; color: #ccc; transform: translateY(-1px); }

        .nav-link {
          color: #666;
          font-size: 14px;
          text-decoration: none;
          transition: color 0.15s;
          cursor: pointer;
        }
        .nav-link:hover { color: #ccc; }

        .divider { border: none; border-top: 1px solid #1a1a1a; margin: 0; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0f1a0f;
          border: 1px solid #1a3a1a;
          border-radius: 999px;
          padding: 5px 14px;
          font-size: 12px;
          color: #4a9a4a;
          font-family: 'DM Mono', monospace;
          margin-bottom: 28px;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #4a9a4a; }
      `}</style>

      {/* NAV */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px", borderBottom: "1px solid #141414",
        position: "sticky", top: 0, background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(12px)", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, background: "#e8e8e2", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>🤖</div>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#e8e8e2" }}>SupportAI</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          <a className="nav-link" href="#features">Features</a>
          <a className="nav-link" href="#how-it-works">How it works</a>
          <a className="nav-link" href="https://github.com/Mohammedanees06/AI_CustomerSupport_Agent" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="cta-secondary" style={{ padding: "9px 20px", fontSize: 14 }} onClick={() => navigate("/login")}>Log in</button>
          <button className="cta-primary" style={{ padding: "9px 20px", fontSize: 14 }} onClick={() => navigate("/register")}>Get started</button>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{
        maxWidth: 760, margin: "0 auto", textAlign: "center",
        padding: "100px 24px 80px",
      }}>
        <div className={`land-fade ${visible ? "in" : ""}`}>
          <div className="badge">
            <span className="badge-dot"></span>
            Live demo available
          </div>
        </div>

        <h1 className={`land-fade d1 ${visible ? "in" : ""}`} style={{
          fontSize: "clamp(38px, 6vw, 64px)",
          fontWeight: 600,
          lineHeight: 1.12,
          letterSpacing: "-0.03em",
          color: "#f0f0ea",
          margin: "0 0 24px",
        }}>
          AI customer support,<br />
          <span style={{ color: "#555" }}>embedded anywhere.</span>
        </h1>

        <p className={`land-fade d2 ${visible ? "in" : ""}`} style={{
          fontSize: 18, color: "#666", lineHeight: 1.7,
          margin: "0 0 48px", maxWidth: 560, marginLeft: "auto", marginRight: "auto",
        }}>
          A multi-tenant SaaS platform. RAG-powered AI, real-time voice pipeline, background job queues, and a one-line embeddable widget.
        </p>

        <div className={`land-fade d3 ${visible ? "in" : ""}`} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="cta-primary" onClick={() => window.open("https://ai-customer-support-system.netlify.app", "_blank")}>
            Open Dashboard
          </button>
          <button className="cta-secondary" onClick={() => window.open("https://chat-support-widget.netlify.app", "_blank")}>
            Try the widget →
          </button>
          <button className="cta-secondary" onClick={() => window.open("https://github.com/Mohammedanees06/AI_CustomerSupport_Agent", "_blank")}>
            View source
          </button>
        </div>

        <div className={`land-fade d4 ${visible ? "in" : ""}`} style={{ marginTop: 32, color: "#444", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
          demo@aicustomer.com · demo1234
        </div>
      </section>

      <hr className="divider" />

      {/* STACK PILLS */}
      <section style={{ padding: "48px 40px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#444", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: 20 }}>BUILT WITH</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 700, margin: "0 auto" }}>
          {STACK.map(s => <span key={s} className="pill">{s}</span>)}
        </div>
      </section>

      <hr className="divider" />

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <p style={{ fontSize: 12, color: "#444", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: 12 }}>FEATURES</p>
        <h2 style={{ fontSize: 32, fontWeight: 600, color: "#e8e8e2", margin: "0 0 48px", letterSpacing: "-0.02em" }}>
          What's under the hood
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}>
          {FEATURES.map(f => (
            <div key={f.title} className="feat-card">
              <div style={{ fontSize: 24, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e8e8e2", margin: "0 0 8px" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <p style={{ fontSize: 12, color: "#444", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: 12 }}>HOW IT WORKS</p>
        <h2 style={{ fontSize: 32, fontWeight: 600, color: "#e8e8e2", margin: "0 0 48px", letterSpacing: "-0.02em" }}>
          From signup to live chat in minutes
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{
              display: "flex", gap: 32, padding: "32px 0",
              borderTop: i === 0 ? "none" : "1px solid #161616",
            }}>
              <span className="step-num" style={{ paddingTop: 2, minWidth: 28 }}>{s.n}</span>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8e8e2", margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* CTA FOOTER */}
      <section style={{ textAlign: "center", padding: "80px 24px 100px" }}>
        <h2 style={{ fontSize: 36, fontWeight: 600, color: "#e8e8e2", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
          See it live
        </h2>
        <p style={{ fontSize: 16, color: "#555", margin: "0 0 40px" }}>
          Open the widget demo as a customer, then login to the dashboard to watch it happen.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="cta-primary" onClick={() => window.open("https://chat-support-widget.netlify.app", "_blank")}>
            Try the widget
          </button>
          <button className="cta-secondary" onClick={() => navigate("/login")}>
            Business login
          </button>
        </div>
        <p style={{ marginTop: 24, fontSize: 13, color: "#333", fontFamily: "'DM Mono', monospace" }}>
          ⚠ Free tier backend — first load may take ~30s to wake up
        </p>
      </section>

    </div>
  );
}