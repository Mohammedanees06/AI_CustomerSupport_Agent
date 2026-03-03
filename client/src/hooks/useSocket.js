import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { connectSocket, getSocket } from "../services/socketClient";
import { initializeChatSocket } from "../features/chat/chat.socket";

export default function useSocket() {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const businessId = useSelector((state) => state.business.business?._id);

  useEffect(() => {
    if (!token || !businessId) return;

    // Prevent duplicate connection
    if (!getSocket()) {
      const socket = connectSocket(token, businessId);

      // Join business room (admin-level monitoring if needed)
      socket.emit("join-business", businessId);

      // Initialize global chat listeners once
      initializeChatSocket(dispatch);
    }

    // IMPORTANT:
    // Do NOT disconnect here.
    // Disconnect should only happen on logout.
  }, [token, businessId, dispatch]);
}