import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getAISuggestions,
  getMessages,
  uploadFile,
} from "../controllers/MessagesController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/files" }); // Set the destination for uploaded files
const messagesRoutes = Router();
messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post("/get-ai-suggestions", verifyToken, getAISuggestions); // Assuming you have a function to get AI suggestions
messagesRoutes.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFile
);
export default messagesRoutes;
