import { getSocket } from "../../services/socketClient";
import { addMessage, setConversations } from "../../store/chat.slice";

export const initializeChatSocket = (dispatch) => {
  const socket = getSocket();
  if (!socket) return;

  socket.off("new-message");
  socket.off("conversations-update");

  /**NEW MESSAGE EVENT */
  socket.on("new-message", (message) => {
    console.log("Socket message received:", message);

    // message.conversation is the conversationId
    dispatch(addMessage(message));
  });

  /** CONVERSATION LIST UPDATE */
  socket.on("conversations-update", (data) => {
    console.log("Conversations updated:", data);

    dispatch(setConversations(data));
  });
};