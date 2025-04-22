import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getContactsForDMList,
  searchContacts,
} from "../controllers/ContactsController.js";
const contactsRoutes = Router();
contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/get-contacts-dm", verifyToken, getContactsForDMList); // Assuming you have a search function in your controller
export default contactsRoutes;
