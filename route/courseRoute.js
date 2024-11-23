import express from "express";
const router = express.Router();
import { authenticateUser } from "../middleware/authentication.js";
import {
  getAllCourses,
  getCourseDetails,
  getVideoDetails,
  addCourse,
  addSection,
  addVideo,
} from "../controllers/courseController.js";

router.post("/", addCourse);
router.post("/add-section/:courseId", addSection);
router.post("/add-video/:courseId/:sectionId", addVideo);
router.get("/:id", getCourseDetails);
router.get("/", getAllCourses);
router.get("/:courseId/video/:videoId", getVideoDetails);

export default router;
