import User from "../models/UserModel.js"; // Ensure this is the correct path
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { response } from "express";
import { renameSync, unlinkSync } from "fs";
import upload from "../config/multerFile.js";
import cloudinary from "../config/cloudinary.js";

const maxAge = 3 * 24 * 60 * 60 * 1000; // Example: 3 days in seconds
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    secure: true,
    sameSite: "none",
    expiresIn: maxAge,
  });
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.create({ email, password });

    res.cookie("jwt", createToken(email, user.id), {
      secure: true,
      sameSite: "none",
      maxAge: maxAge, // Convert to milliseconds
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,

        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.cookie("jwt", createToken(email, user.id), {
      secure: true,
      sameSite: "none",
      maxAge: maxAge,
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    console.log("User ID from token:", req.userId); // Log the user ID from the token
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    //   console.error(error);
    //   return res.status(500).json({ error: error.message });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).send({ error: "All fields are required" });
    }
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.error(error);
    //   return res.status(500).json({ error: error.message });
  }
};

export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
    }
    const date = Date.now();
    //let fileName = "uploads/profiles/" + date + req.file.originalname;
    // renameSync(req.file.path, fileName);
    console.log("Image File path:", req.file);
    const imageUrl = req.file.path;
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        image: imageUrl,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return res.status(500).json({ error: "Failed to upload profile image" });
    //   return res.status(500).json({ error: error.message });
  }
};
export const removeProfileImage = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (user.image) {
      //unlinkSync(user.image);
      const publicId = user.image.split("/").pop().split(".")[0];
      const filePath = `uploads/profiles/${publicId}`;
      await cloudinary.uploader.destroy(filePath, (error, result) => {
        if (error) {
          console.error("Error deleting image from Cloudinary:", error);
          return res.status(500).send("Failed to delete image");
        }
      });
    }
    user.image = null;
    await user.save();
    return res.status(200).send("Profile Image Removed Successfully");
  } catch (error) {
    console.error(error);
    //   return res.status(500).json({ error: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    return res.status(200).send("Logout succesfully");
  } catch (error) {
    console.error(error);
    //   return res.status(500).json({ error: error.message });
  }
};
