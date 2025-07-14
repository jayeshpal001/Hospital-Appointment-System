const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  cancelAppointment,
  getAppointments
} = require("../controllers/appointmentController");

const  protect  = require("../middlewares/authMiddleware");

// Book Appointment - Only logged-in user
router.post("/book", protect, bookAppointment);

// Cancel Appointment by ID - Only doctor or patient
router.put("/cancel/:id", protect, cancelAppointment);

// Get All Appointments for Logged-in user
router.get("/", protect, getAppointments);

module.exports = router;