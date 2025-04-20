import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { searchContacts } from "../controllers/ContactsController.js";
const constactsRoutes = Router();
constactsRoutes.post("/search", verifyToken, searchContacts); // Assuming you have a search function in your controller
export default constactsRoutes;
