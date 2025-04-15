import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { toast } from "sonner";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please complete your profile setup before accessing the chat.", {
        type: "warning",
      });
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return <div>Chat</div>;
};
export default Chat;
