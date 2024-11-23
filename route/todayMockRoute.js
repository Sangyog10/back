import express from "express";
import { sotreTodayMock } from "../controllers/todayMockController.js";
const router = express.Router();

router.post("/createToday", sotreTodayMock);


export default router;
