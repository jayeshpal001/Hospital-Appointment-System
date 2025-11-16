// Importing required modules
const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db")
const userRoutes = require('./routes/userRoutes')
const appointmentRoutes = require("./routes/appointmentRoutes");
// Initialize express app
const app = express();
const PORT = process.env.PORT
connectDB(); 
// Load environment variables
app.use(cookieParser());

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hospital-appointment-system-frontend.onrender.com",
      "https://hospital-appointment-system-2-e5li.onrender.com"
    ],
    credentials: true,
  })
);

app.use(express.json());


// Middleware to handle cookies

// Routes

app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);




// Default route
// app.get("/", (req, res) => {
//   res.send(" Hospital Appointment System Backend Running");
// });

app.listen(PORT, ()=>{
  console.log(`app running at ${PORT}`);
  
} )

