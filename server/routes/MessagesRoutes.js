import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getAISuggestions,
  getMessages,
} from "../controllers/MessagesController.js";

const messagesRoutes = Router();
messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post("/get-ai-suggestions", verifyToken, getAISuggestions); // Assuming you have a function to get AI suggestions

export default messagesRoutes;
