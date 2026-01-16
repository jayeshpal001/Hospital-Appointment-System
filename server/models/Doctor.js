const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- Personal Details ---
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    degree: {
      type: String,
      required: true, // e.g. "MBBS, MD"
    },

    age: {
      type: Number,
      required: true,
      min: 21, // practical minimum for doctors
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    nationality: {
      type: String,
      required: true,
    },

    // --- Professional Details ---
    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    availableDays: {
      type: [String],
      default: [],
    },

    availableSlots: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
    ],

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
