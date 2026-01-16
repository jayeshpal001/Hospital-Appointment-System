const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    // The specific date of the appointment (e.g., 2023-10-25)
    appointmentDate: {
      type: Date,
      required: true,
    },
    // The specific time slot (copied from doctor's available slots)
    slot: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    reason: {
      type: String,
      default: "General Consultation",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled", "completed"],
      default: "pending",
    },
    // Optional: To store payment status if you integrate Stripe/Razorpay later
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;