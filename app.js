import express from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./route/authRoute.js";
import mockTestRouter from "./route/mockTestRoute.js";
import courseRouter from "./route/courseRoute.js";
import noteRouter from "./route/noteRoute.js";

import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import { authenticateUser } from "./middleware/authentication.js";

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000", // Specify your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow specific methods
    // allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
    credentials: true, // Allow credentials such as cookies to be sent
  })
);
app.use(express.json());
app.use(cookieParser(process.env.jwtSecret));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/course", authenticateUser, courseRouter);
app.use("/api/v1/mocktest", authenticateUser, mockTestRouter);
app.use("/api/v1/course", authenticateUser, courseRouter);
app.use("/api/v1/note", authenticateUser, noteRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export { app };
