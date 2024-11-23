import express from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./route/authRoute.js";
import courseRouter from "./route/courseRoute.js";

import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import { authenticateUser } from "./middleware/authentication.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.jwtSecret, {}));

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/course", courseRouter);

app.get("/test", (req, res) => {
  res.send("testing");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export { app };
