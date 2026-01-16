const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
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

    age: {
      type: Number,
      required: true,
      min: 0, // Patients can be newborns
      max: 120,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      required: true,
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

    // --- Medical History ---
    medicalHistory: {
      type: String, 
      default: "", // Optional: Can be empty if no conditions exist
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);