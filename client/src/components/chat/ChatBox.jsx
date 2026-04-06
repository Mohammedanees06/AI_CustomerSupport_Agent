import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setMessages } from "../../store/chat.slice";
import Message from "./Message";
import axios from "../../services/apiClient";
import { getSocket } from "../../services/socketClient";

const EMPTY_ARRAY = [];

export default function ChatBox({ conversationId }) {
  const dispatch = useDispatch();

  const messages = useSelector(
    (state) => state.chat.messagesByConversation?.[conversationId] || EMPTY_ARRAY
  );

  const [text, setText] = useState("");

  useEffect(() => {
    if (!conversationId) return;

    axios
      .get(`/chat/history/${conversationId}`)
      .then((res) => {
        dispatch(setMessages({ conversationId, messages: res.data }));
      })
      .catch((err) => console.error(err));

    const socket = getSocket();
    if (socket) {
      socket.emit("join-conversation", { conversationId });

      const handleNewMessage = (msg) => {
        const msgConvId = msg.conversation?._id || msg.conversation;
        if (msgConvId?.toString() === conversationId?.toString()) {
          dispatch(addMessage(msg));
        }
      };

      socket.on("new-message", handleNewMessage);

      return () => {
        socket.off("new-message", handleNewMessage);
      };
    }
  }, [conversationId, dispatch]);

  const handleSend = async () => {
    if (!text.trim() || !conversationId) return;

    const optimisticMessage = {
      conversation: conversationId,
      sender: "agent",
      content: text,
      createdAt: new Date().toISOString(),
    };

    dispatch(addMessage(optimisticMessage));
    setText("");

    try {
      await axios.post("/chat/agent-reply", {
        conversationId,
        message: text,
      });
    } catch (err) {
      console.error("Agent reply failed", err);
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto mb-3">
        {messages.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <Message key={msg._id || index} message={msg} />
          ))
        )}
      </div>

      {/* Agent Reply Input */}
      <div
        className="flex flex-col border-t pt-3 gap-1"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          💬 Replying as <strong>Agent</strong> — customer will see this in the widget
        </p>
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a reply to the customer..."
            className="flex-1 border rounded px-3 py-2 text-sm outline-none"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
          <button
            onClick={handleSend}
            className="text-white px-4 rounded text-sm"
            style={{ background: "var(--accent)" }}
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}