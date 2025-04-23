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
          addContactsInDirectMessages,
        } = useAppStore.getState();
        //console.log(message);
        //console.log("selectedChatData", selectedChatData);
        console.log(message);
        if (
          selectedChatType !== undefined &&
          ((selectedChatData.id || selectedChatData._id) ===
            (message.sender._id || message.sender.id) ||
            (selectedChatData.id || selectedChatData._id) ===
              (message.receiver._id || message.receiver.id))
        ) {
          // console.log("message received", message);
          addMessage(message);
          //console.log("selectedChatMessages", { selectedChatMessages });
        }
        {
          addContactsInDirectMessages(message);
        }
      };
      const handleReceiveChannelMessage = (message) => {
        const {
          selectedChatData,
          selectedChatType,
          addMessage,
          addChannelInChannelList,
        } = useAppStore.getState();
        //console.log(message);
        //console.log("selectedChatData", selectedChatData);
        //console.log(message);
        if (
          selectedChatType !== undefined &&
          (selectedChatData.id || selectedChatData._id) === message.channelId
        ) {
          //console.log("message received", message);
          addMessage(message);
          //console.log("selectedChatMessages", { selectedChatMessages });
        }
        {
          addChannelInChannelList(message);
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message", handleReceiveChannelMessage);
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
