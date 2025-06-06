import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL;
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channels", channelRoutes);
app.get("/", (req, res) => {
  res.status(200).send("Server is running!");
});
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
setupSocket(server, () => {
  console.log("Socket is running");
});
mongoose
  .connect(databaseURL)
  .then(() => {
    console.log(`DB connection Successful`);
  })
  .catch((err) => {
    console.log(err.message);
  });
