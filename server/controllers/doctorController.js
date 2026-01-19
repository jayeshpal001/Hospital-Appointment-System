const Doctor = require("../models/Doctor");

const createDoctor = async (req, res) => {
  try {
    const {
      gender,
      degree,
      age,
      phone,
      address,
      nationality,
      specialization,
      experience,
      availableDays,
      availableSlots,
      consultationFee,
    } = req.body;

    const userId = req.user.id;

    if (
      !gender ||
      !degree ||
      !age ||
      !phone ||
      !address ||
      !nationality ||
      !specialization ||
      !experience ||
      !consultationFee
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required. Please complete your profile.",
      });
    }

    const isExist = await Doctor.findOne({ userId });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: "Doctor profile already exists.",
      });
    }
    const newDoctor = await Doctor.create({
      gender,
      userId,
      degree,
      age,
      phone,
      address,
      nationality,
      specialization,
      experience,
      availableDays,
      availableSlots,
      consultationFee,
    });

    res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = createDoctor;
