import express from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./route/authRoute.js";
import mockTestRouter from "./route/mockTestRoute.js";
import courseRouter from "./route/courseRoute.js";
import noteRouter from "./route/noteRoute.js";

import todayMock from "./route/todayMockRoute.js";

import qnaRouter from "./route/qnaRoute.js";
import userRouter from "./route/userRoute.js";


import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import { authenticateUser } from "./middleware/authentication.js";

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.jwtSecret));

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/course", courseRouter);
app.use("/api/v1/mocktest", mockTestRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/note", noteRouter);
app.use("/api/v1/", todayMock);

app.use("/api/v1/course", authenticateUser, courseRouter);
app.use("/api/v1/mocktest", authenticateUser, mockTestRouter);
app.use("/api/v1/course", authenticateUser, courseRouter);
app.use("/api/v1/note", authenticateUser, noteRouter);
app.use("/api/v1/qna", authenticateUser, qnaRouter);
app.use("/api/v1/user", authenticateUser, userRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export { app };
