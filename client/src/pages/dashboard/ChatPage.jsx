import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
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

  return (
    <div className="h-[calc(100vh-120px)] flex bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">

      {/* LEFT PANEL — Sidebar */}
      <div className="w-72 border-r border-[var(--border)] bg-[var(--bg)] flex flex-col">
        <div className="p-4 border-b border-[var(--border)]">
          <h3 className="font-semibold text-[var(--text)]">Conversations</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{conversations.length} total</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] p-3">No conversations yet</p>
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
                  onClick={() => dispatch(setActiveConversation(conv._id))}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[var(--accent)] text-white"
                      : "hover:bg-[var(--border)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-[var(--text)]"}`}>
                      {displayName}
                    </span>
                    <span className={`text-[10px] ml-2 shrink-0 ${isActive ? "text-white/70" : "text-[var(--text-muted)]"}`}>
                      {timeLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate ${isActive ? "text-white/80" : "text-[var(--text-muted)]"}`}>
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
      <div className="flex-1 flex flex-col">

        {/* CHAT HEADER */}
        <div className="border-b border-[var(--border)] px-4 py-3 flex items-center justify-between bg-[var(--surface)]">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-[var(--text)]">
              {activeConversation
                ? (activeConversation.customerName || formatCustomerId(activeConversation.customerId))
                : "Select Conversation"}
            </span>

            {activeConversation?.orderInfo && (
              <div className="flex flex-wrap gap-3">
                <span className="text-xs text-[var(--text-muted)]">📧 {activeConversation.orderInfo.customerEmail}</span>
                <span className={`text-xs font-medium ${
                  activeConversation.orderInfo.status === "delivered" ? "text-green-500"
                  : activeConversation.orderInfo.status === "cancelled" ? "text-red-500"
                  : activeConversation.orderInfo.status === "shipped" ? "text-blue-500"
                  : "text-yellow-500"
                }`}>
                  ● {activeConversation.orderInfo.status}
                </span>
                <span className="text-xs text-[var(--text-muted)]">🚚 {activeConversation.orderInfo.trackingNumber || "N/A"}</span>
                <span className="text-xs text-[var(--text-muted)]">💰 ₹{activeConversation.orderInfo.totalAmount}</span>
              </div>
            )}

            {activeConversation && !activeConversation.orderInfo && (
              <div className="flex flex-wrap gap-3">
                {activeConversation.customerEmail && (
                  <span className="text-xs text-[var(--text-muted)]">📧 {activeConversation.customerEmail}</span>
                )}
                {!activeConversation.customerName && !activeConversation.customerEmail && (
                  <span className="text-xs text-[var(--text-muted)]">No contact details</span>
                )}
              </div>
            )}
          </div>

          {activeConversation && (
            <span className="text-xs text-[var(--text-muted)] font-normal shrink-0 ml-4">
              Agent handoff mode
            </span>
          )}
        </div>

        {/* CHAT BOX */}
        <div className="flex-1 p-4 overflow-y-auto bg-[var(--bg)]">
          {activeConversationId
            ? <ChatBox conversationId={activeConversationId} />
            : <p className="text-[var(--text-muted)] text-sm">Select a conversation</p>
          }
        </div>
      </div>
    </div>
  );
}