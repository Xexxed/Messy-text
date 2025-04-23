import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // Cloudinary folder for profile images
    allowed_formats: ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp"], // Allowed file types
  },
});

const uploadProfileImage = multer({ storage: profileStorage });

export default uploadProfileImage;
