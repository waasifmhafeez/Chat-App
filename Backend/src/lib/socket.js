import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export function getRceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId }

// listen for connections
io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  // handle user authentication and store in userSocketMap
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    // console.log("User connected:", userId, "Socket ID:", socket.id);
  }

  // io.emit() is used to send events to all the connected clients
  // socket.to(socketId).emit() is used to send event to a specific client

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // handle disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
    // remove user from userSocketMap
    // for (const [userId, socketId] of Object.entries(userSocketMap)) {
    //   if (socketId === socket.id) {
    //     delete userSocketMap[userId];
    //     break;
    //   }
    // }
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
