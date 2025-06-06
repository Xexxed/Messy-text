import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`User disconnected with socket ID ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
        //console.log(`User ${userId} disconnected`);
      }
    }
  };
  const sendMessage = async (message) => {
    console.log("socket sendMessage", message);
    const senderSocketId = userSocketMap.get(message.sender);
    // console.log(message);

    const receiverSocketId = userSocketMap.get(message.receiver);

    const createdMessage = await Message.create(message);
    console.log("createdMessage", createdMessage);
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("receiver", "id email firstName lastName image color");
    //console.log("messageData", messageData);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };
  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl, isAi } = message;
    const fileName = message.fileName ? message.fileName : null;
    const createdMessage = await Message.create({
      sender,
      receiver: null,
      content,
      messageType,
      fileUrl,
      fileName,
      isAi,
      timestamp: new Date(),
    });
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec();
    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });
    const channel = await Channel.findById(channelId).populate("members");
    const finalChannelData = { ...messageData._doc, channelId: channel._id };
    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit(
            "receive-channel-message",
            finalChannelData
          );
        }
      });
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-channel-message", finalChannelData);
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
    } else {
      console.log(`User ID not provided on connection`);
    }
    socket.on("sendMessage", (message) => sendMessage(message));
    socket.on("send-channel-message", (message) => sendChannelMessage(message));
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
