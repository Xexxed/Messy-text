import User from "../models/UserModel.js"; // Ensure this is the correct path
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000; // Example: 3 days in seconds
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
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
      maxAge: maxAge, // Convert to milliseconds
      sameSite: "none",
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
      maxAge: maxAge,
      sameSite: "none",
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
