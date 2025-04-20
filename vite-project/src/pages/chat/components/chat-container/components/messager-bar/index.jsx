//import React from 'react
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { useAppStore } from "@/store";
import { RiEmojiStickerLine } from "react-icons/ri";
import { useSocket } from "@/context/SocketContext";
const MessageBar = () => {
  const emojiRef = useRef(null);
  const [message, setMessage] = useState("");
  const socket = useSocket();
  const [showEmoji, setShowEmoji] = useState(false);
  const { userInfo, selectedChatType, selectedChatData } = useAppStore();
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);
  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };
  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        receiver: selectedChatData.id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
  };
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex  bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className=" flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 translate-all">
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 translate-all"
            onClick={() => setShowEmoji((prev) => !prev)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={showEmoji}
              onEmojiClick={handleEmojiClick}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda]  focus:outline-none focus:text-white duration-300 translate-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
