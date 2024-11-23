import express from "express";
const router = express.Router();
import { authenticateUser } from "../middleware/authentication.js";

router.get("/test", authenticateUser, (req, res) => {
  const user = req.user;

  res.send(user);
});

export default router;
