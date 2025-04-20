//import React from "react";
import { useAppStore } from "@/store";
import moment from "moment";
import { useEffect, useRef } from "react";
import { useState } from "react";

const MessageContainer = () => {
  const scrollRef = useRef(null);
  const { selectedChatData, selectedChatType, selectedChatMessages } =
    useAppStore();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);
  console.log({ selectedChatMessages });
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
                ? " bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-full"
                : "bg-[#2a2b33]/5 text-white/80 ☐ border-[#ffffff]/20 rounded-full"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4  md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
