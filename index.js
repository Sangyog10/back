import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
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

  app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
