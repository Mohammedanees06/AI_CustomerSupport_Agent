import { useState } from "react";
import { useSelector } from "react-redux";

export default function EmbedPage() {
  const businessId = useSelector((state) => state.business.business?._id);
  const businessName = useSelector((state) => state.business.business?.name);
  const [copied, setCopied] = useState(false);

  const serverUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

  const embedCode = `<script
  src="${serverUrl}/widget.js"
  data-business-id="${businessId}"
  data-server-url="${serverUrl}"
></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)]">Embed Widget</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Add your AI support chat widget to any website with one line of code.
        </p>
      </div>

      {/* Business Info */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg"
            style={{ background: "var(--accent)" }}
          >
            🤖
          </div>
          <div>
            <p className="font-semibold text-[var(--text)]">{businessName || "Your Business"}</p>
            <p className="text-xs text-[var(--text-muted)]">Business ID: {businessId}</p>
          </div>
        </div>

        <div className="flex gap-4 text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
            AI Chat
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
            Voice Calls
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
            Order Lookup
          </div>
        </div>
      </div>

      {/* Embed Code */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden mb-6">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg)]">
          <span className="text-sm font-medium text-[var(--text)]">Your embed code</span>
          <button
            onClick={handleCopy}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              copied
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "text-white hover:opacity-90"
            }`}
            style={!copied ? { background: "var(--cta)" } : {}}
          >
            {copied ? "✅ Copied!" : "Copy Code"}
          </button>
        </div>
        <pre className="p-4 text-sm bg-[#0d1117] text-green-400 overflow-x-auto whitespace-pre-wrap">
          {embedCode}
        </pre>
      </div>

      {/* Instructions */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="font-semibold text-[var(--text)] mb-4">How to add it to your website</h3>
        <ol className="space-y-3 text-sm text-[var(--text-muted)]">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "var(--accent)" }}>1</span>
            <span>Copy the embed code above by clicking <strong className="text-[var(--text)]">Copy Code</strong>.</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "var(--accent)" }}>2</span>
            <span>Open your website's HTML file and paste the code just before the closing <code className="bg-[var(--bg)] border border-[var(--border)] px-1 rounded text-[var(--text)]">&lt;/body&gt;</code> tag.</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "var(--accent)" }}>3</span>
            <span>Save and reload your website. The chat button will appear in the bottom right corner.</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "var(--accent)" }}>4</span>
            <span>For production, replace <code className="bg-[var(--bg)] border border-[var(--border)] px-1 rounded text-[var(--text)]">http://localhost:5000</code> with your deployed server URL.</span>
          </li>
        </ol>
      </div>

    </div>
  );
}