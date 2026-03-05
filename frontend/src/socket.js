// src/socket.js
import { io } from "socket.io-client";

const socket = io(
  // "http://localhost:2000", 
  "https://mern-social-app-mu.vercel.app",
  {
  withCredentials: true,
});

export default socket;
