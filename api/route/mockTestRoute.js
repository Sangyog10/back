import express from "express";
const router = express.Router();
import {
  createMockTest,
  getAllMockTests,
  getSingleMockTest,
  submitMockTest,
  getQuestionsBySubject,
  getRandomQuestions,
} from "../controllers/mockTestController.js";

router.post("/create", createMockTest);
router.post("/:id/submit", submitMockTest);
router.get("/random", getRandomQuestions);
router.get("/questions", getQuestionsBySubject);
router.get("/", getAllMockTests);
router.get("/:id", getSingleMockTest);

export default router;
