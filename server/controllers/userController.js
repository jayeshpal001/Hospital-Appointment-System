const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

exports.userProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.doctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const doctorProfile = await Doctor.findOne({ userId })
      .populate("userId", "name email role");

    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    res.status(200).json({
      success: true,
      doctor: doctorProfile,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPatientProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
  
    const patient = await Patient.findOne({ userId }).populate("userId", "name email");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};