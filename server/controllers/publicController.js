const Doctor = require("../models/Doctor");
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({})
      .populate("userId", "name email") 
      .select("-__v"); 
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