const Patient = require("../models/Patient");

const createPatient = async (req, res) => {
  try {
    const {
      gender,
      age,
      bloodGroup,
      phone,
      address,
      nationality,
      medicalHistory,
    } = req.body;

    const userId = req.user.id; 

    if (!gender || !age || !bloodGroup || !phone || !address || !nationality) {
      return res.status(400).json({
        success: false,
        message: "All mandatory fields are required. Please complete your profile.",
      });
    }
    const isExist = await Patient.findOne({ userId });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: "Patient profile already exists.",
      });
    }

    const newPatient = await Patient.create({
      userId,
      gender,
      age,
      bloodGroup,
      phone,
      address,
      nationality,
      medicalHistory,
    });

    res.status(201).json({
      success: true,
      message: "Patient profile created successfully",
      patient: newPatient,
    });

  } catch (error) {
    console.error("Error creating patient profile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = createPatient;