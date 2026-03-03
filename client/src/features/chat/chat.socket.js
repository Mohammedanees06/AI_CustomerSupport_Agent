import { getSocket } from "../../services/socketClient";
import { addMessage, setConversations } from "../../store/chat.slice";

export const initializeChatSocket = (dispatch) => {
  const socket = getSocket();
  if (!socket) return;

  socket.off("new-message");
  socket.off("conversations-update");

  socket.on("new-message", (message) => {
    dispatch(addMessage(message));
  });

  socket.on("conversations-update", (data) => {
    dispatch(setConversations(data));
  });
};