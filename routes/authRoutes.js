import express from "express";

import {
  registerUser,
  loginUser,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();


// REGISTER
router.post("/register", registerUser);


// LOGIN
router.post("/login", loginUser);


// RESET PASSWORD
router.get("/reset-password", resetPassword);


export default router;