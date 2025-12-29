const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const generateToken = require("../utils/generateToken")
const getUserProfile = (req, res)=>{
    if (!req.user) {
        res.status(404)
        throw next(new Error("User not found"));
    }
    res.status(200).json({user: req.user}); 
}


// Register User Controller
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });

    generateToken(res, user._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Login Controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is invalid" });
    }

    generateToken(res, user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Get All Patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,      
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully."
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error logging out.",
      error: error.message
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser, 
  getAllPatients,
  getAllDoctors, 
  getUserProfile, 
  
};