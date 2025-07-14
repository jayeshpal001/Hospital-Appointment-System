const express = require("express");
const router = express.Router();
const  protect  = require("../middlewares/authMiddleware");
const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
} = require("../controllers/appointmentController");

router.post("/", protect, bookAppointment);
router.get("/", protect, getAppointments);
router.delete("/:id", protect, cancelAppointment);

module.exports = router;