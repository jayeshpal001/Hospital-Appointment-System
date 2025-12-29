const express = require("express");
const router = express.Router();

// Import controller functions
const {
  registerUser,
  loginUser,
  getAllDoctors,
  getAllPatients, 
  getUserProfile,
  logoutUser
} = require("../controllers/userController");

const authMiddleware = require('../middlewares/authMiddleware')

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser); 
router.get("/doctors", getAllDoctors);
router.get("/patients", getAllPatients);
router.get("/profile", authMiddleware, getUserProfile);


module.exports = router;