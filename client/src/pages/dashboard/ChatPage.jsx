import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { setActiveConversation, setConversations } from "../../store/chat.slice";
import ChatBox from "../../components/chat/ChatBox";
import useSocket from "../../hooks/useSocket";
import { getSocket } from "../../services/socketClient";
import axios from "../../services/apiClient";

function formatCustomerId(customerId) {
  if (!customerId || customerId === "anonymous") return "Customer";
  if (customerId.startsWith("order:")) return `📦 ${customerId.replace("order:", "")}`;
  if (customerId.startsWith("guest_")) return "Guest Customer";
  return customerId;
}

export default function ChatPage() {
  const dispatch = useDispatch();
  useSocket();

  const [searchParams] = useSearchParams();
  const { conversations, activeConversationId } = useSelector((state) => state.chat);
  const businessId = useSelector((state) => state.business.business?._id);
  const previousConversationRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!businessId) return;
    axios
      .get(`/chat/conversations/${businessId}`)
      .then((res) => {
        dispatch(setConversations(res.data));
        const targetId = searchParams.get("conversation");
        if (targetId) {
          dispatch(setActiveConversation(targetId));
        } else if (res.data.length > 0) {
          dispatch(setActiveConversation(res.data[0]._id));
        }
      })
      .catch((err) => console.error("Conversations fetch failed:", err.message));
  }, [businessId, dispatch]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const previousId = previousConversationRef.current;
    const currentId = activeConversationId;
    if (previousId && previousId !== currentId) {
      socket.emit("leave-conversation", { conversationId: previousId });
    }
    if (currentId && previousId !== currentId) {
      socket.emit("join-conversation", { conversationId: currentId });
    }
    previousConversationRef.current = currentId;
  }, [activeConversationId]);

  const activeConversation = conversations.find((c) => c._id === activeConversationId);

  const handleSelectConversation = (id) => {
    dispatch(setActiveConversation(id));
    setSidebarOpen(false);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex rounded-xl border overflow-hidden relative" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT PANEL — Sidebar */}
      <div className={`
        absolute md:relative z-30 md:z-auto
        w-72 h-full flex flex-col
        border-r transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `} style={{ background: "var(--bg)", borderColor: "var(--border)" }}>

        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>Conversations</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{conversations.length} total</p>
          </div>
          <button className="md:hidden text-lg" style={{ color: "var(--text-muted)" }} onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <p className="text-xs p-3" style={{ color: "var(--text-muted)" }}>No conversations yet</p>
          ) : (
            conversations.map((conv) => {
              const lastMsg = conv.lastMessage;
              const isActive = activeConversationId === conv._id;

              const timeLabel = lastMsg
                ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : new Date(conv.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              const preview = lastMsg
                ? lastMsg.content.length > 45
                  ? lastMsg.content.slice(0, 45) + "..."
                  : lastMsg.content
                : "No messages yet";

              const displayName = conv.customerName
                ? conv.customerName
                : formatCustomerId(conv.customerId);

              return (
                <div
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv._id)}
                  className="p-3 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: isActive ? "var(--accent)" : "transparent",
                    color: isActive ? "#fff" : "var(--text)",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--border)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold truncate" style={{ color: isActive ? "#fff" : "var(--text)" }}>
                      {displayName}
                    </span>
                    <span className="text-[10px] ml-2 shrink-0" style={{ color: isActive ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>
                      {timeLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs truncate" style={{ color: isActive ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}>
                      {lastMsg?.sender === "ai" && <span className="opacity-70">AI: </span>}
                      {lastMsg?.sender === "agent" && <span className="text-blue-400">Agent: </span>}
                      {preview}
                    </p>
                    <span className={`ml-2 shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isActive
                        ? "bg-white/20 text-white"
                        : conv.status === "open"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : conv.status === "escalated"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-[var(--border)] text-[var(--text-muted)]"
                    }`}>
                      {conv.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* CHAT HEADER */}
        <div className="border-b px-4 py-3 flex items-center justify-between" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile sidebar toggle */}
            <button
              className="md:hidden shrink-0 text-sm px-2 py-1 rounded border"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg)" }}
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
                {activeConversation
                  ? (activeConversation.customerName || formatCustomerId(activeConversation.customerId))
                  : "Select Conversation"}
              </span>

              {activeConversation?.orderInfo && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>📧 {activeConversation.orderInfo.customerEmail}</span>
                  <span className={`text-xs font-medium ${
                    activeConversation.orderInfo.status === "delivered" ? "text-green-500"
                    : activeConversation.orderInfo.status === "cancelled" ? "text-red-500"
                    : activeConversation.orderInfo.status === "shipped" ? "text-blue-500"
                    : "text-yellow-500"
                  }`}>● {activeConversation.orderInfo.status}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>🚚 {activeConversation.orderInfo.trackingNumber || "N/A"}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>💰 ₹{activeConversation.orderInfo.totalAmount}</span>
                </div>
              )}

              {activeConversation && !activeConversation.orderInfo && (
                <div className="flex flex-wrap gap-2">
                  {activeConversation.customerEmail && (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>📧 {activeConversation.customerEmail}</span>
                  )}
                  {!activeConversation.customerName && !activeConversation.customerEmail && (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>No contact details</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {activeConversation && (
            <span className="text-xs shrink-0 ml-4 hidden sm:block" style={{ color: "var(--text-muted)" }}>
              Agent handoff mode
            </span>
          )}
        </div>

        {/* CHAT BOX */}
        <div className="flex-1 p-3 md:p-4 overflow-y-auto" style={{ background: "var(--bg)" }}>
          {activeConversationId
            ? <ChatBox conversationId={activeConversationId} />
            : <p className="text-sm" style={{ color: "var(--text-muted)" }}>Select a conversation</p>
          }
        </div>
      </div>
    </div>
  );
}