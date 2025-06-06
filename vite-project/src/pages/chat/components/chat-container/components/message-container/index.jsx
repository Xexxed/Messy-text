//import React from "react";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import {
  GET_ALL_MESSAGES,
  GET_CHANNEL_MESSAGES,
  GET_SIGNED_URL,
  HOST,
} from "@/utils/constants";
import moment from "moment";
import { use, useEffect, useRef } from "react";
import { useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import axios from "axios";

const MessageContainer = () => {
  const [selectedMessageId, setSelectedMessageId] = useState(null); // Track the selected message ID
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const scrollRef = useRef(null);
  const {
    selectedChatData,
    selectedChatType,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
    userInfo,
  } = useAppStore();
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES,
          { id: selectedChatData.id || selectedChatData._id },
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
    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${
            selectedChatData.id || selectedChatData._id
          }`,

          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    if (selectedChatData.id || selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      } else if (selectedChatType === "channel") {
        getChannelMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);
  //console.log({ selectedChatMessages });
  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    //console.log(filePath, "is image path");
    return imageRegex.test(filePath);
  };
  const handleToggleTimestamp = (messageId) => {
    //Toggling the messageID
    setSelectedMessageId((prevId) => (prevId === messageId ? null : messageId));
  };
  const handleDownloadFile = async (message) => {
    console.log(message.fileUrl, "fileUrl");
    const fileUrl = message.fileUrl;
    const fileName = message.fileName;
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const signedUrl = await apiClient.post(
      GET_SIGNED_URL,
      {
        fileUrl: fileUrl,
      },
      { withCredentials: true }
    );
    const response = await axios.get(signedUrl, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.floor((loaded * 100) / total);
        setFileDownloadProgress(percentCompleted);
      },
    });
    console.log(response, " Download response");
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      //console.log("render messages", message);
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}

          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };
  const renderDMMessages = (message) => {
    //console.log("renderDMMessages", message);
    return (
      <div
        className={`${
          message.sender === (selectedChatData.id || selectedChatData._id)
            ? "text-left"
            : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== (selectedChatData.id || selectedChatData._id)
                ? " bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-md"
                : "bg-[#2a2b33]/5 text-white/80 ☐ border-[#ffffff]/20 rounded-md"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
            onClick={() => handleToggleTimestamp(message._id)}
            style={{ cursor: "pointer" }}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== (selectedChatData.id || selectedChatData._id)
                ? " bg-[#8417ff]/5 text-white/50 border-[#8417ff]/50 rounded-md"
                : "bg-[#2a2b33]/5 text-white/80 ☐ border-[#ffffff]/20 rounded-md"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
            onClick={(e) => {
              if (e.target === e.currentTarget)
                handleToggleTimestamp(message._id);
            }}
          >
            {checkIfImage(message.fileName) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img src={message.fileUrl} height={200} width={200} />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileName}</span>
                <span
                  className="bg-black/20 rounded-full p-3 text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => handleDownloadFile(message)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
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
  const renderChannelMessages = (message) => {
    return (
      <div
        className={`mt-5${
          message.sender._id !== userInfo.id ? " text-left" : " text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? " bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-md"
                : "bg-[#2a2b33]/5 text-white/80 ☐ border-[#ffffff]/20 rounded-md ml-7"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
            onClick={() => handleToggleTimestamp(message._id)}
            style={{ cursor: "pointer" }}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? " bg-[#8417ff]/5 text-white/50 border-[#8417ff]/50 rounded-md"
                : "bg-[#2a2b33]/5 text-white/80 ☐ border-[#ffffff]/20 rounded-md"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
            onClick={(e) => {
              if (e.target === e.currentTarget)
                handleToggleTimestamp(message._id);
            }}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img src={message.fileUrl} height={200} width={200} />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileName}</span>
                <span
                  className="bg-black/20 rounded-full p-3 text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => handleDownloadFile(message)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        {selectedMessageId === message._id && ( // Show timestamp only for the selected message
          <div className="text-xs text-gray-600">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3 ">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center">
              {message.sender.image && (
                <AvatarImage
                  src={message.sender.image}
                  alt="Profile"
                  className="object-cover w-[32px] h-[32px] bg-black rounded-full"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <span className=" text-xs text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  };
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4  md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full scrollbar-custom">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={imageUrl}
              alt="Selected"
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 top-0 mt-5">
            <button
              className="bg-black/20 rounded-full p-3 text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => handleDownloadFile(imageUrl)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 rounded-full p-3 text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setImageUrl(null);
                setShowImage(false);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
