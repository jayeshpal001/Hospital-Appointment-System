const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { bookAppointment, getMyAppointments, updateAppointmentStatus } = require("../controllers/appointmentController");
const router = express.Router();

router.post("/book", authMiddleware, bookAppointment);
router.get("/my-appointments", authMiddleware, getMyAppointments);
router.put("/status", authMiddleware, updateAppointmentStatus);

module.exports = router;