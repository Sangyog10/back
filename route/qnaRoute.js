import express from "express";
import {
  createQuestion,
  getAllQuestions,
  getQuestionDetails,
  createAnswer,
} from "../controllers/qnaController.js";

import { authenticateUser } from "../middleware/authentication.js";

const router = express.Router();

router.get("/", getAllQuestions);

router.post("/", createQuestion);

router.get("/:id", getQuestionDetails);

router.post("/:id/answer", authenticateUser, createAnswer);

export default router;
