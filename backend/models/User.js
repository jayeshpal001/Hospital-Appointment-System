const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User schema defines structure of user documents
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  role: {
    type: String,
    enum: ["patient", "doctor"],
    required: [true, "Role must be either 'patient' or 'doctor'"]
  }
}, { timestamps: true });

// Pre-save middleware: hash the password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Don't hash again if already hashed
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
  } catch (error) {
    return next(error); // Stop save and return error
  }
});

// Create the model and export
const User = mongoose.model("User", userSchema);
module.exports = User;