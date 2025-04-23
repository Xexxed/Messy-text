import { Router } from "express";
import {
  signup,
  login,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";
import uploadProfileImage from "../config/multerProfile.js";
// Assuming you have a multer configuration file
const authRoutes = Router();
//const upload = multer({ dest: "uploads/profiles" }); // Set the destination for uploaded files
authRoutes.post("/signup", signup);
authRoutes.post("/login", login); // Assuming you have a login function in your controller
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-user-info", verifyToken, updateProfile); // Assuming you have an update function in your controller
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  uploadProfileImage.single("profile-image"),
  addProfileImage
);
authRoutes.post("/logout", logout); // Assuming you have a logout function in your controller
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage); // Assuming you have an update function in your controller
export default authRoutes;
