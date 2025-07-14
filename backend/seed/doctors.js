const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const seedDoctors = async () => {
  try {
    const doctors = [
      {
        name: "Dr. Akash Singh",
        email: "akash@example.com",
        password: "123456",
        role: "doctor",
      },
      {
        name: "Dr. Pooja Mehta",
        email: "pooja@example.com",
        password: "123456",
        role: "doctor",
      },
    ];

    // Clear existing doctors
    await User.deleteMany({ role: "doctor" });

    // Insert new doctors
    for (let doctor of doctors) {
      const newDoctor = new User(doctor);
      await newDoctor.save();
    }

    console.log("Doctors inserted!");
    process.exit();
  } catch (error) {
    console.error("Error inserting doctors:", error.message);
    process.exit(1);
  }
};

seedDoctors();
