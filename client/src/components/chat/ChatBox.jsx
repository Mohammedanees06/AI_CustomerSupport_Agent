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

  const businessId = useSelector(
    (state) => state.business.business?._id
  );

  const [text, setText] = useState("");

  /**
   * ===============================
   * LOAD MESSAGE HISTORY
   * ===============================
   */
  useEffect(() => {
    if (!conversationId) return;

    axios
      .get(`/chat/history/${conversationId}`)
      .then((res) => {
        dispatch(setMessages({ conversationId, messages: res.data }));
      })
      .catch((err) => console.error(err));
  }, [conversationId, dispatch]);

  /**
   * ===============================
   * SEND MESSAGE
   * ===============================
   */
  const handleSend = async () => {
  if (!text.trim()) return;

  // ✅ ensure socket is in the room before sending
  const socket = getSocket();
  if (socket && conversationId) {
    socket.emit("join-conversation", { conversationId });
  }

  const optimisticMessage = {
    conversation: conversationId,
    sender: "user",
    content: text,
    createdAt: new Date().toISOString(),
  };

  dispatch(addMessage(optimisticMessage));
  setText("");

  try {
    await axios.post("/chat/message-async", {
      message: text,
      businessId,
      conversationId,
    });
  } catch (err) {
    console.error("Send failed", err);
  }
};

  return (
    <div className="flex flex-col h-full">

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto mb-3">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex border-t pt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type message..."
          className="flex-1 border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={handleSend}
          className="bg-gray-900 text-white px-4 rounded"
        >
          Send
        </button>
      </div>

    </div>
  );
}