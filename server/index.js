import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import constactsRoutes from "./routes/ContactsRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL;
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contacts", constactsRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log(`DB connection Successful`);
  })
  .catch((err) => {
    console.log(err.message);
  });
