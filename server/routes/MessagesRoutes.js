import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getAISuggestions,
  getMessages,
  getSignedFileUrl,
  uploadFile,
} from "../controllers/MessagesController.js";
import multer from "multer";
import fileUpload from "../config/multerFile.js";
//import upload from "../config/multerFile.js";

//const upload = multer({ dest: "uploads/files" }); // Set the destination for uploaded files
const messagesRoutes = Router();
messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post("/get-ai-suggestions", verifyToken, getAISuggestions); // Assuming you have a function to get AI suggestions
messagesRoutes.post(
  "/upload-file",
  verifyToken,
  fileUpload.single("file"),
  uploadFile
);
messagesRoutes.post("/get-signed-url", verifyToken, getSignedFileUrl); // Assuming you have a function to get AI suggestions
export default messagesRoutes;
