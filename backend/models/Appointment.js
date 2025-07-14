const mongoose = require("mongoose");

// Appointment schema
const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",           // Reference to User model (role: doctor)
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",           // Reference to User model (role: patient)
    required: true
  },
  date: {
    type: String,
    required: [true, "Date is required"]
  },
  time: {
    type: String,
    required: [true, "Time is required"]
  },
  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked"
  }
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;