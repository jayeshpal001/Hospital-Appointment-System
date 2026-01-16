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

    // 2. Validate Essential Fields
    // Note: medicalHistory is excluded here as it is optional in the schema
    if (!gender || !age || !bloodGroup || !phone || !address || !nationality) {
      return res.status(400).json({
        success: false,
        message: "All mandatory fields are required. Please complete your profile.",
      });
    }

    // 3. Check for existing profile
    const isExist = await Patient.findOne({ userId });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: "Patient profile already exists.",
      });
    }

    // 4. Save to Database
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