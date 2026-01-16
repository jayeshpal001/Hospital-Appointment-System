const Doctor = require("../models/Doctor");

// --- GET ALL DOCTORS (For Patient Dashboard) ---
const getAllDoctors = async (req, res) => {
  try {
    // Ham sirf wahi fields bhejenge jo zaroori hain (Sensitive info hide karenge)
    const doctors = await Doctor.find({})
      .populate("userId", "name email") // User schema se naam uthao
      .select("-__v"); // Clean output

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Fetch Doctors Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- GET SINGLE DOCTOR BY ID (For Booking Page) ---
const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate("userId", "name email");
        
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        res.status(200).json({ success: true, doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

module.exports = { getAllDoctors, getDoctorById };