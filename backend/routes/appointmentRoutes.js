const express = require("express");
const router = express.Router();
const  protect  = require("../middlewares/authMiddleware");
const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  getAppointmentsForDoctor,
  cancelAppointmentByDoctor,
  completeAppointment
} = require("../controllers/appointmentController");

router.post("/book", protect, bookAppointment);
router.get("/my", protect, getAppointments);
router.get('/doctor', protect, getAppointmentsForDoctor);
router.delete("/:id", protect, cancelAppointment);
router.put("/cancel/:id", protect, cancelAppointmentByDoctor);
router.put("/complete/:id", protect, completeAppointment);

module.exports = router;