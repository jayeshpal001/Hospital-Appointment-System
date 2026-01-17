require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io"); 

const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const publicRoutes = require("./routes/publicRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

// 1. Create HTTP Server wrapping Express App
const server = http.createServer(app); 

// 2. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, 
    credentials: true
  },
});


io.on("connection", (socket) => {
  console.log("New socket Connected: ", socket.id);

  socket.on("join-room", (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});


app.set("io", io);


app.set("trust proxy", 1);
dbConnect();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/appointment", appointmentRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});