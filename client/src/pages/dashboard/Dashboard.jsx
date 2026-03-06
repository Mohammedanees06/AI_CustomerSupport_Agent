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
        // PDF
        if (!file) return setStatus(null);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("businessId", businessId);
        res = await apiClient.post("/knowledge/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setFile(null);

      } else if (tab === 1) {
        // Plain text
        if (!textContent.trim()) return setStatus(null);
        res = await apiClient.post("/knowledge/upload", { businessId, content: textContent });
        setTextContent("");

      } else if (tab === 2) {
        // Website URL
        if (!url.trim()) return setStatus(null);
        res = await apiClient.post("/knowledge/scrape", { businessId, url });
        setUrl("");

      } else if (tab === 3) {
        // FAQ
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

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Upload content so your AI can answer customer questions.
          </p>
        </div>
        <button
          onClick={handleClear}
          className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => { setTab(i); reset(); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              tab === i
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
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
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            dragOver ? "border-gray-900 bg-gray-50" : file ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <input ref={fileRef} type="file" accept=".pdf" className="hidden"
            onChange={(e) => handleFile(e.target.files[0])} />
          {file ? (
            <div>
              <div className="text-3xl mb-2">📄</div>
              <p className="font-medium text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB — Click to change</p>
            </div>
          ) : (
            <div>
              <div className="text-3xl mb-2">☁️</div>
              <p className="font-medium text-gray-700">Drag & drop a PDF here</p>
              <p className="text-sm text-gray-400 mt-1">or click to browse</p>
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
          className="w-full border rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
        />
      )}

      {/* Website URL */}
      {tab === 2 && (
        <div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourwebsite.com/about"
            className="w-full border rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <p className="text-xs text-gray-400 mt-2">
            We'll extract the text content from this page and add it to your knowledge base.
          </p>
        </div>
      )}

      {/* FAQ Builder */}
      {tab === 3 && (
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border rounded-xl p-4 bg-white space-y-2 relative">
              <input
                value={faq.question}
                onChange={(e) => updateFaq(i, "question", e.target.value)}
                placeholder="Question"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <textarea
                value={faq.answer}
                onChange={(e) => updateFaq(i, "answer", e.target.value)}
                placeholder="Answer"
                rows={2}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              />
              {faqs.length > 1 && (
                <button
                  onClick={() => removeFaq(i)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-400 text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addFaq}
            className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl px-4 py-2 w-full hover:border-gray-500 transition-colors"
          >
            + Add another FAQ
          </button>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={status === "loading"}
        className="mt-5 w-full bg-gray-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Processing..." : "Upload to Knowledge Base"}
      </button>

      {/* Status */}
      {status === "success" && result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
          {result.message}
          {result.chunksStored && <> — <strong>{result.chunksStored}</strong> chunks stored.</>}
        </div>
      )}
      {status === "error" && result && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
           {result.message}
        </div>
      )}
    </div>
  );
}