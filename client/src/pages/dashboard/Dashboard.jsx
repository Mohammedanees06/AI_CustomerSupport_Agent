import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import apiClient from "../../services/apiClient";

const TABS = ["PDF Upload", "Paste Text", "Website URL", "FAQ Builder"];

export default function Dashboard() {
  const businessId = useSelector((state) => state.business.business?._id);

  const [tab, setTab] = useState(0);
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [url, setUrl] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const reset = () => { setStatus(null); setResult(null); };

  const handleFile = (f) => {
    if (f?.type === "application/pdf") { setFile(f); reset(); }
    else { setStatus("error"); setResult({ message: "Only PDF files are supported." }); }
  };

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const removeFaq = (i) => setFaqs(faqs.filter((_, idx) => idx !== i));
  const updateFaq = (i, field, value) => {
    const updated = [...faqs];
    updated[i][field] = value;
    setFaqs(updated);
  };

  const handleUpload = async () => {
    if (!businessId) return;
    setStatus("loading");
    setResult(null);

    try {
      let res;

      if (tab === 0) {
        if (!file) return setStatus(null);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("businessId", businessId);
        res = await apiClient.post("/knowledge/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setFile(null);
      } else if (tab === 1) {
        if (!textContent.trim()) return setStatus(null);
        res = await apiClient.post("/knowledge/upload", { businessId, content: textContent });
        setTextContent("");
      } else if (tab === 2) {
        if (!url.trim()) return setStatus(null);
        res = await apiClient.post("/knowledge/scrape", { businessId, url });
        setUrl("");
      } else if (tab === 3) {
        const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());
        if (validFaqs.length === 0) return setStatus(null);
        res = await apiClient.post("/knowledge/faq", { businessId, faqs: validFaqs });
        setFaqs([{ question: "", answer: "" }]);
      }

      setResult(res.data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setResult({ message: err.response?.data?.message || "Upload failed" });
    }
  };

  const handleClear = async () => {
    if (!businessId || !window.confirm("Clear all knowledge base data?")) return;
    try {
      await apiClient.delete(`/knowledge/${businessId}`);
      setResult({ message: "Knowledge base cleared." });
      setStatus("success");
    } catch {
      setStatus("error");
      setResult({ message: "Failed to clear knowledge base." });
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors";
  const inputStyle = { background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: "var(--text)" }}>Knowledge Base</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Upload content so your AI can answer customer questions.
          </p>
        </div>
        <button
          onClick={handleClear}
          className="text-xs px-3 py-1.5 rounded-lg border shrink-0 transition-colors hover:opacity-80"
          style={{ color: "#ef4444", borderColor: "#fca5a5", background: "transparent" }}
        >
          Clear All
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto" style={{ borderColor: "var(--border)" }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => { setTab(i); reset(); }}
            className="px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
            style={{
              borderBottomColor: tab === i ? "var(--text)" : "transparent",
              color: tab === i ? "var(--text)" : "var(--text-muted)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* PDF Upload */}
      {tab === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}
          className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors"
          style={{
            borderColor: dragOver ? "var(--text)" : file ? "#4ade80" : "var(--border)",
            background: dragOver ? "var(--surface)" : file ? "rgba(74,222,128,0.05)" : "transparent",
          }}
        >
          <input ref={fileRef} type="file" accept=".pdf" className="hidden"
            onChange={(e) => handleFile(e.target.files[0])} />
          {file ? (
            <div>
              <div className="text-3xl mb-2">📄</div>
              <p className="font-medium text-sm" style={{ color: "var(--text)" }}>{file.name}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{(file.size / 1024).toFixed(1)} KB — Click to change</p>
            </div>
          ) : (
            <div>
              <div className="text-3xl mb-2">☁️</div>
              <p className="font-medium text-sm" style={{ color: "var(--text)" }}>Drag & drop a PDF here</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>or click to browse</p>
            </div>
          )}
        </div>
      )}

      {/* Paste Text */}
      {tab === 1 && (
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Paste your business information here — FAQs, policies, product details, opening hours, etc."
          rows={10}
          className={inputClass}
          style={{ ...inputStyle, resize: "none" }}
        />
      )}

      {/* Website URL */}
      {tab === 2 && (
        <div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourwebsite.com/about"
            className={inputClass}
            style={inputStyle}
          />
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            We'll extract the text content from this page and add it to your knowledge base.
          </p>
        </div>
      )}

      {/* FAQ Builder */}
      {tab === 3 && (
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border rounded-xl p-4 space-y-2 relative" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <input
                value={faq.question}
                onChange={(e) => updateFaq(i, "question", e.target.value)}
                placeholder="Question"
                className={inputClass}
                style={inputStyle}
              />
              <textarea
                value={faq.answer}
                onChange={(e) => updateFaq(i, "answer", e.target.value)}
                placeholder="Answer"
                rows={2}
                className={inputClass}
                style={{ ...inputStyle, resize: "none" }}
              />
              {faqs.length > 1 && (
                <button
                  onClick={() => removeFaq(i)}
                  className="absolute top-3 right-3 text-lg leading-none hover:opacity-70 transition-opacity"
                  style={{ color: "var(--text-muted)" }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addFaq}
            className="text-sm w-full px-4 py-2 rounded-xl border border-dashed transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "transparent" }}
          >
            + Add another FAQ
          </button>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={status === "loading"}
        className="mt-5 w-full py-3 rounded-xl font-medium text-sm transition-colors hover:opacity-90 disabled:opacity-50"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        {status === "loading" ? "Processing..." : "Upload to Knowledge Base"}
      </button>

      {/* Status */}
      {status === "success" && result && (
        <div className="mt-4 p-4 rounded-xl border text-sm" style={{ background: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.3)", color: "#16a34a" }}>
          {result.message}
          {result.chunksStored && <> — <strong>{result.chunksStored}</strong> chunks stored.</>}
        </div>
      )}
      {status === "error" && result && (
        <div className="mt-4 p-4 rounded-xl border text-sm" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)", color: "#dc2626" }}>
          {result.message}
        </div>
      )}

    </div>
  );
}