import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please complete your profile setup before accessing the chat.", {
        type: "warning",
      });
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  useEffect(() => {
    // Set the background color of #root when the component is mounted
    const rootElement = document.body;
    if (rootElement) {
      rootElement.style.backgroundColor = "#1b1c24";
    }

    // Optional: Reset the background color when the component is unmounted
    return () => {
      if (rootElement) {
        rootElement.style.backgroundColor = ""; // Reset to default
      }
    };
  }, []);

  return (
    <div className="flex h-[95vh] text-white outline-hidden">
      {isUploading && (
        <div className=" h-[100vh] w-[100vw] fixed top-0 z-1000 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Uploading Files</h5>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className=" h-[100vh] w-[100vw] fixed top-0 z-1000 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Downloading Files</h5>
          {fileDownloadProgress}%
        </div>
      )}
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
