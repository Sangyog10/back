import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config();

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the  DB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on http://localhost:4000");
  });
};

start();
