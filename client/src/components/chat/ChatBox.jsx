import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../store/chat.slice";
import Message from "./Message";
import axios from "../../services/apiClient";

export default function ChatBox({ conversationId }) {
  const dispatch = useDispatch();

  const EMPTY = [];

  const messages = useSelector(
    (state) =>
      state.chat.messagesByConversation[conversationId] || EMPTY
  );

  const businessId = useSelector(
    (state) => state.business.business?._id
  );

  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim()) return;

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
      <div className="flex-1 space-y-3 overflow-y-auto mb-3">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))
        )}
      </div>

      <div className="flex border-t pt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
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