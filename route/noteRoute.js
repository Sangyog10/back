import express from "express";
const router = express.Router();
import { authenticateUser } from "../middleware/authentication.js";

import {
  createNote,
  updateNote,
  deleteNote,
  getNotes,
} from "../controllers/noteController.js";

router.get("/", authenticateUser, getNotes);
router.post("/", authenticateUser, createNote);
router.delete("/", authenticateUser, deleteNote);
router.patch("/", authenticateUser, updateNote);

export default router;
