import express from "express";
const router = express.Router();

import {
  getUserCourses,
  getUserNotes,
  getUserDetails,
} from "../controllers/userController.js";

router.get("/course", getUserCourses);
router.get("/", getUserDetails);
router.get("/note", getUserNotes);

export default router;
