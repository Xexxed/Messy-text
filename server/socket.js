import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";

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
    const senderSocketId = userSocketMap.get(message.sender);
    console.log(message);

    const receiverSocketId = userSocketMap.get(message.receiver);

    const createdMessage = await Message.create(message);
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("receiver", "id email firstName lastName image color");
    console.log("messageData", messageData);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
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
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
