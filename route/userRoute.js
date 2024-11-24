import express from "express";
const router = express.Router();

import { getUserCourses, getUserNotes } from "../controllers/userController.js";

router.get("/course", getUserCourses);
router.get("/note", getUserNotes);

export default router;
