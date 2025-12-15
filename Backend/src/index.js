import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { app, server } from "./lib/socket.js";

import { connectDB } from "./lib/db.js";

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config();

// const app = express(); // we'll app from socket file

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT;
const __dirname = path.resolve();

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

// app.listen(port, () => {   // replaced app with server from socket file
//   console.log("server running", port);
//   connectDB();
// });

server.listen(port, () => {
  console.log("server running", port);
  connectDB();
});
