import express from "express";
import {
  createPoll,
  getPolls,
  getSinglePoll,
  deletePoll,
  votePoll,
} from "../controllers/pollController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createPoll);

router.get("/", authMiddleware, getPolls);

router.get("/:id", getSinglePoll);

router.delete("/:id", authMiddleware, deletePoll);

router.post("/:id/vote", authMiddleware, votePoll);

export default router;