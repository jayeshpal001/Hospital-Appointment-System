const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // ✅ Make sure time is included and of type String
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'completed'],
    default: 'booked'
  },

}, {
  timestamps: true,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;