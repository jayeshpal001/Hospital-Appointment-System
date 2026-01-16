const express = require("express");
const router = express.Router();
const { getAllDoctors, getDoctorById } = require("../controllers/publicController");
const authMiddleware = require("../middleware/authMiddleware");
router.get("/doctors", authMiddleware, getAllDoctors);
router.get("/doctor/:id", authMiddleware, getDoctorById);

module.exports = router;    