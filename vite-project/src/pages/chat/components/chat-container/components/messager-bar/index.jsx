//import React from 'react
import EmojiPicker from "emoji-picker-react";
import { use, useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { useAppStore } from "@/store";
import { RiEmojiStickerLine } from "react-icons/ri";
import { useSocket } from "@/context/SocketContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { RiRobotFill } from "react-icons/ri";
import { apiClient } from "@/lib/api-client";
import { GET_AI_SUGGESTIONS } from "@/utils/constants";
const MessageBar = () => {
  const emojiRef = useRef(null);
  const [message, setMessage] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [ai, setAi] = useState(false);
  const socket = useSocket();
  const [showEmoji, setShowEmoji] = useState(false);
  const { userInfo, selectedChatType, selectedChatData, selectedChatMessages } =
    useAppStore();

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
  useEffect(() => {
    console.log("selectedChatMessages", selectedChatMessages.slice(-5));
  }, [selectedChatMessages]);

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };
  const handleSendMessage = async () => {
    console.log("isAi", ai);
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        receiver: selectedChatData.id || selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
        isAi: ai,
      });
    }
  };
  const fetchAISuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const lastTenMessages = selectedChatMessages.slice(-10); // Get the last 10 messages
      const response = await apiClient.post(
        GET_AI_SUGGESTIONS,
        { messages: lastTenMessages },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.suggestions) {
        setAiSuggestions(response.data.suggestions);
      }
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className={`flex-1 p-5 rounded-md focus:border-none focus:outline-none ${
            message === "" ? "bg-[#2a2b33]" : "bg-transparent"
          }`}
          placeholder="Enter Message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setAi(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
              setMessage("");
            }
          }}
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 translate-all cursor-pointer">
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 translate-all cursor-pointer"
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
        <Popover>
          <PopoverTrigger className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 translate-all">
            <RiRobotFill className="text-2xl mb-1" />
          </PopoverTrigger>
          <PopoverContent className="bg-[#2a2b33] p-4 rounded-md shadow-lg text-white mb-30 mr-80">
            <div className="flex flex-col gap-2">
              <p className="text-sm">AI Suggestions:</p>
              <button
                className="bg-[#8417ff] text-white rounded-md p-2 hover:bg-[#741bda] focus:outline-none"
                onClick={() => {
                  setMessage("Hi");
                  setAi(true);
                }}
              >
                Suggestion 1
              </button>
              <button
                className="bg-[#8417ff] text-white rounded-md p-2 hover:bg-[#741bda] focus:outline-none"
                onClick={() => {
                  setMessage("Can you provide more details?");
                  setAi(true);
                }}
              >
                Suggestion 2
              </button>
              <button
                className="bg-[#8417ff] text-white rounded-md p-2 hover:bg-[#741bda] focus:outline-none"
                onClick={() => {
                  setMessage("Let me look into that for you.");
                  setAi(true);
                }}
              >
                Suggestion 3
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 translate-all"
        onClick={() => {
          handleSendMessage();
          setMessage("");
        }}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
