require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dbConnect = require("./config/dbConnect");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const publicRoutes = require("./routes/publicRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.json());

const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
  transports: ["websocket", "polling"], 
});

io.on("connection", (socket) => {
  console.log(" Socket connected:", socket.id);

  socket.on("join-room", (userId) => {
    if (!userId) return;
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.set("io", io);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/appointment", appointmentRoutes);

dbConnect();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
