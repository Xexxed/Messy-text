// filepath: d:\Projects\Messy\server\config\multer.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads/files", // Folder name in Cloudinary
    resource_type: "auto", // Automatically determine the resource type (image, video, etc.)
    allowed_formats: [], // Allow all file types by leaving the array empty
  },
});

const fileUpload = multer({ storage });

export default fileUpload;
