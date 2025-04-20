import ChatHeader from "./components/chat-header";
import MessageContainer from "./components/message-container";
import MessageBar from "./components/messager-bar";

const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1 ">
      <ChatHeader />
      {/* <div className="flex flex-col items-start"> */}
      <MessageContainer />
      <MessageBar />
      {/* </div> */}
    </div>
  );
};

export default ChatContainer;
