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


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Real-time Polls Backend is running!",
    status: "Healthy"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

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

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("🚀 MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});