const express = require("express");
const router = express.Router();

// Import controller functions
const {
  registerUser,
  loginUser,
  getAllDoctors,
  getAllPatients, 
  getProfile
} = require("../controllers/userController");

const authMiddleware = require('../middlewares/authMiddleware')

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/doctors", getAllDoctors);
router.get("/patients", getAllPatients);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;