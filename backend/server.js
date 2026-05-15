import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";

// Load Environment Variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*", // Production ke liye "*" allow kar sakte hain ya apna frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. Root Route (Sabse upar rakhein taaki "Cannot GET /" na aaye)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Real-time Polls Backend is running successfully!",
    status: "Healthy",
    timestamp: new Date().toISOString()
  });
});

// 2. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

// Socket.io Logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinPoll", (pollId) => {
    socket.join(pollId);
    console.log(`User joined poll: ${pollId}`);
  });

  socket.on("newVote", (data) => {
    io.to(data.pollId).emit("voteUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// MongoDB Connection Logic
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is not defined in Environment Variables!");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("🚀 MongoDB Connected Successfully"))
    .catch((err) => {
      console.error("❌ MongoDB Connection Error:");
      console.error(err.message);
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Port Setup (Render automatically sets PORT to 10000)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});