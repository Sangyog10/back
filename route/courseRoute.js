import express from "express";
const router = express.Router();
import {
  getAllCourses,
  getCourseDetails,
  getVideoDetails,
  addCourse,
  addSection,
  addVideo,
  updateStudyMaterials,
  getStudyMaterials,
  purchaseCourse,
} from "../controllers/courseController.js";
import { authenticateUser } from "../middleware/authentication.js";

router.post("/", authenticateUser, addCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseDetails);

router.post("/add-section/:courseId", authenticateUser, addSection);

router.post("/add-video/:courseId/:sectionId", authenticateUser, addVideo);
router.get("/:courseId/video/:videoId", authenticateUser, getVideoDetails);

router.post("/purchase/:userId/:courseId", authenticateUser, purchaseCourse);

router.put(
  "/:courseId/section/:sectionId/video/:videoId/study-material",
  authenticateUser,
  updateStudyMaterials
);
router.get(
  "/:courseId/section/:sectionId/video/:videoId/study-material",
  authenticateUser,
  getStudyMaterials
);

export default router;
