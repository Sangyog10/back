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

router.post("/", addCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseDetails);

router.post("/add-section/:courseId", addSection);

router.post("/add-video/:courseId/:sectionId", addVideo);
router.get("/:courseId/video/:videoId", getVideoDetails);

router.post("/purchase/:userId/:courseId", purchaseCourse);

router.put(
  "/:courseId/section/:sectionId/video/:videoId/study-material",
  updateStudyMaterials
);
router.get(
  "/:courseId/section/:sectionId/video/:videoId/study-material",
  getStudyMaterials
);

export default router;
