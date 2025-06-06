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
import { GET_AI_SUGGESTIONS, UPLOAD_FILE_ROUTES } from "@/utils/constants";
import axios from "axios";
const MessageBar = () => {
  const fileInputRef = useRef();
  const emojiRef = useRef();
  const [message, setMessage] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [ai, setAi] = useState(false);
  const socket = useSocket();
  const [showEmoji, setShowEmoji] = useState(false);
  const {
    userInfo,
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();

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
  //   useEffect(() => {
  //     const arr = selectedChatMessages.slice(-10); // Get the last 10 messages
  //     const lastTenMessages = { messages: arr };
  //     console.log("lastTenMessages", lastTenMessages);

  //     //console.log("selectedChatMessages", selectedChatMessages.slice(-5));
  //   }, [selectedChatMessages]);

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
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        channelId: selectedChatData.id || selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
        isAi: ai,
      });
    }
    //setMessage("");
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
      console.log("response", response.data);
      if (response.status === 200 && response.data) {
        setAiSuggestions(response.data);
        console.log("AI Suggestionsfdsfs:", aiSuggestions);
      }
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };
  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTES, formData, {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            setFileUploadProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            //console.log("handle attachment change", response.data.fileName);
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              receiver: selectedChatData.id || selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
              fileName: response.data.fileName,
              isAi: false,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              channelId: selectedChatData.id || selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
              fileName: response.data.fileName,
              isAi: false,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading file:", error);
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
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 translate-all cursor-pointer"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleAttachmentChange}
        />
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
          <PopoverTrigger
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 translate-all"
            onClick={fetchAISuggestions}
          >
            <RiRobotFill className="text-2xl mb-1" />
          </PopoverTrigger>
          <PopoverContent className="bg-[#2a2b33] p-4 rounded-md shadow-lg text-white mb-30 mr-80">
            <div className="flex flex-col gap-2">
              <p className="text-sm">AI Suggestions:</p>
              {loadingSuggestions ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : (
                aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="bg-[#8417ff] text-white rounded-md p-2 hover:bg-[#741bda] focus:outline-none"
                    onClick={() => {
                      setMessage(suggestion);
                      setAi(true);
                    }}
                  >
                    {suggestion}
                  </button>
                ))
              )}
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
