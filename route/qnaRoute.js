import express from "express";
import {
  createQuestion,
  getAllQuestions,
  getQuestionDetails,
  createAnswer,
  markAsAccepted,
} from "../controllers/qnaController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllQuestions);

router.post("/", authenticateUser, createQuestion);

router.get("/:id", getQuestionDetails);

router.post("/:id/answers", authenticateUser, createAnswer);

router.patch(
  "/:questionId/answers/:answerId/accept",
  authenticateUser,
  markAsAccepted
);

export default router;
