import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import {setActiveConversation,setConversations,} from "../../store/chat.slice";
import ChatBox from "../../components/chat/ChatBox";
import useSocket from "../../hooks/useSocket";
import { getSocket } from "../../services/socketClient";
import axios from "../../services/apiClient";

export default function ChatPage() {
  const dispatch = useDispatch();
  useSocket();
 
  const { conversations, activeConversationId } =
    useSelector((state) => state.chat);

  const businessId = useSelector(
    (state) => state.business.business?._id
  );
  console.log("Redux business:", businessId);

  const previousConversationRef = useRef(null);

  /**
   * ============================================
   * FETCH CONVERSATIONS
   * ============================================
   */
  useEffect(() => {
    if (!businessId) return;

    axios.get(`/chat/conversations/${businessId}`)
      .then((res) => {
        dispatch(setConversations(res.data));

        // auto-select first conversation
        if (res.data.length > 0) {
          dispatch(setActiveConversation(res.data[0]._id));
        }
      })
      .catch((err) => console.error(err));
  }, [businessId, dispatch]);

  /**
   * ============================================
   * JOIN / LEAVE CONVERSATION ROOM
   * ============================================
   */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const previousId = previousConversationRef.current;
    const currentId = activeConversationId;

    if (previousId && previousId !== currentId) {
      socket.emit("leave-conversation", {
        conversationId: previousId,
      });
    }

    if (currentId && previousId !== currentId) {
      socket.emit("join-conversation", {
        conversationId: currentId,
      });
    }

    previousConversationRef.current = currentId;
  }, [activeConversationId]);

  const activeConversation = conversations.find(
    (c) => c._id === activeConversationId
  );

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white rounded shadow">

      {/* LEFT PANEL */}
      <div className="w-72 border-r bg-gray-50 p-4">
        <h3 className="font-semibold mb-4">Conversations</h3>

        <div className="space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() =>
                dispatch(setActiveConversation(conv._id))
              }
              className={`p-3 rounded cursor-pointer ${
                activeConversationId === conv._id
                  ? "bg-gray-200"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {conv.name || "Conversation"}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 font-semibold">
          {activeConversation
            ? activeConversation.name || "Conversation"
            : "Select Conversation"}
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <ChatBox conversationId={activeConversationId} />
        </div>
      </div>
    </div>
  );
}