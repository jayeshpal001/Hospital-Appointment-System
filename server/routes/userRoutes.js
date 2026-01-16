const express = require("express"); 
const { userProfile, doctorProfile, getPatientProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const createDoctor = require("../controllers/doctorController");
const createPatient = require("../controllers/patientController");
const Router = express.Router(); 

Router.post("/doctorData",authMiddleware, createDoctor ); 
Router.post("/patientData",authMiddleware, createPatient ); 
Router.get("/doctorProfile",authMiddleware, doctorProfile ); 
Router.get("/patientProfile",authMiddleware, getPatientProfile ); 


module.exports = Router; 