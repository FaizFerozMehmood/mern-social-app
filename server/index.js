import dotenv from "dotenv";
dotenv.config();

console.log("bissmillah.........!");

import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { connectdataBase } from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoute.js";
import comments from "./routes/commentRoute.js";
import uploadFile from "./routes/uploadFile.js";
import likeRoute from "./routes/likeroute.js";
import msgRoutes from "./routes/msgRoute.js"

connectdataBase();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://mern-social-app-pfjf.vercel.app",
    // origin: "http://localhost:5173",
    // methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
  // ...............................
);
app.options("*", cors());

app.use("/", userRoutes);
app.use("/post", postRoutes);
app.use("/comments", comments);
app.use("/likes", likeRoute);
app.use("/upload", uploadFile);
app.use("/profile", uploadFile);
// app.use("/api/auth", authRoutes);
app.use("/api/messages", msgRoutes);


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("user connected:", socket.id);
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`${userId} joined their chat`);
  });
  socket.on("sendMessage", ({ sender, receiver, content }) => {
    io.to(receiver).emit("receiveMessage", { sender, content });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});
  server.listen(2000, () => {
    console.log("server + socket.iO running on port 2000");
  });