import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// 🟢 Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// 🟢 Middleware
app.use(cors());
app.use(express.json());

// 🟢 Routes
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

// 🟢 Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinPoll", (pollId) => {
    socket.join(pollId);
  });

  socket.on("newVote", (data) => {
    io.to(data.pollId).emit("voteUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// 🟢 MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// 🟢 Server start
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});