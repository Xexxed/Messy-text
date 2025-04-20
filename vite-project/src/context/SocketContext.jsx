import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAppStore } from "@/store";

const SocketContext = createContext(null);
export const useSocket = () => {
  return useContext(SocketContext);
};
export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();
  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: {
          userId: userInfo.id,
        },
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });
      const handleReceiveMessage = (message) => {
        const {
          selectedChatData,
          selectedChatType,
          addMessage,
          selectedChatMessages,
        } = useAppStore.getState();
        console.log(message);
        console.log("selectedChatData", selectedChatData);
        if (
          selectedChatType !== undefined &&
          (selectedChatData.id === message.sender._id ||
            selectedChatData.id === message.receiver._id)
        ) {
          console.log("message received", message);
          addMessage(message);
          console.log("selectedChatMessages", { selectedChatMessages });
        }
      };
      socket.current.on("receiveMessage", handleReceiveMessage);
      return () => {
        socket.current.disconnect();
        console.log("Disconnected from socket server");
      };
    }
  }, [userInfo]);
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
