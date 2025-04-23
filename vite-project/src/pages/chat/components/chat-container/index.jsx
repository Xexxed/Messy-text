import ChatHeader from "./components/chat-header";
import MessageContainer from "./components/message-container";
import MessageBar from "./components/messager-bar";
import { useEffect } from "react";

const ChatContainer = () => {
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
    <div className="fixed top-0 h-[95vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1 ">
      <ChatHeader />
      {/* <div className="flex flex-col items-start"> */}
      <MessageContainer />
      <MessageBar />
      {/* </div> */}
    </div>
  );
};

export default ChatContainer;
