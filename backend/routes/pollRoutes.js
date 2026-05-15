// backend/routes/pollRoutes.js (ya jo bhi tumhari file ka naam hai)
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

// CREATE POLL (Sahi hai)
router.post("/create", authMiddleware, createPoll);

// GET ALL POLLS 
// 🔥 FIXED: Yahan authMiddleware lagaya taaki dashboard sahi se authenticated token bhej sake
router.get("/", authMiddleware, getPolls);

// GET SINGLE POLL (Sahi hai, user bina login ke bhi poll dekh sakta hai)
router.get("/:id", getSinglePoll);

// DELETE POLL (Sahi hai)
router.delete("/:id", authMiddleware, deletePoll);

// VOTE POLL
// 🔥 FIXED CRITICAL: Yahan authMiddleware lagana zaroori tha taaki req.user controller me mil sake!
router.post("/:id/vote", authMiddleware, votePoll);

export default router;