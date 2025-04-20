import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const { userInfo, selectedChatType } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please complete your profile setup before accessing the chat.", {
        type: "warning",
      });
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[95vh] text-white outline-hidden">
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
      {/* <EmptyChatContainer /> */}
      {/* <ChatContainer /> */}
    </div>
  );
};
export default Chat;
