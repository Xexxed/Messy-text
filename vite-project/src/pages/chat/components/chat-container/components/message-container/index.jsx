//import React from "react";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES } from "@/utils/constants";
import moment from "moment";
import { use, useEffect, useRef } from "react";
import { useState } from "react";

const MessageContainer = () => {
  const [selectedMessageId, setSelectedMessageId] = useState(null); // Track the selected message ID

  const scrollRef = useRef(null);
  const {
    selectedChatData,
    selectedChatType,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES,
          { id: selectedChatData.id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    //console.log(selectedChatData, selectedChatType, "selected chat data");
    if (selectedChatData.id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);
  //console.log({ selectedChatMessages });
  const handleToggleTimestamp = (messageId) => {
    //Toggling the messageID
    setSelectedMessageId((prevId) => (prevId === messageId ? null : messageId));
  };
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };
  const renderDMMessages = (message) => {
    return (
      <div
        className={`${
          message.sender === selectedChatData.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData.id
                ? " bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-md"
                : "bg-[#2a2b33]/5 text-white/80 ☐ border-[#ffffff]/20 rounded-md"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
            onClick={() => handleToggleTimestamp(message._id)}
            style={{ cursor: "pointer" }}
          >
            {message.content}
          </div>
        )}
        {selectedMessageId === message._id && ( // Show timestamp only for the selected message
          <div className="text-xs text-gray-600">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4  md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full scrollbar-custom">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
