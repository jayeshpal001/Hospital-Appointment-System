const mongoose = require("mongoose"); // 👈 IMP: Ye line missing thi
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// --- 1. BOOK APPOINTMENT ---
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, slot, reason } = req.body;
    const userId = req.user.id;

    // Patient Check
    const patient = await Patient.findOne({ userId });
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found." });

    // Doctor Check
    const doctor = await Doctor.findById(doctorId).populate("userId");
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    // Slot Check
    const isSlotTaken = await Appointment.findOne({
      doctorId,
      appointmentDate,
      "slot.startTime": slot.startTime,
      status: { $ne: "cancelled" },
    });

    if (isSlotTaken) return res.status(400).json({ success: false, message: "Slot already booked." });

    // Create
    let newAppointment = await Appointment.create({
      doctorId,
      patientId: patient._id,
      appointmentDate,
      slot,
      reason,
      amount: doctor.consultationFee,
      status: "pending",
    });

    // Populate for Real-time Card
    const fullAppointment = await Appointment.findById(newAppointment._id)
      .populate({
        path: "patientId",
        select: "gender age bloodGroup medicalHistory",
        populate: { path: "userId", select: "name email" },
      })
      .populate({
        path: "doctorId",
        select: "specialization address",
        populate: { path: "userId", select: "name" },
      });

    // Notification Logic
    const io = req.app.get("io");
    if (doctor.userId) {
      console.log("Emitting status-updated to Doctor:", doctor.userId._id);
      io.to(doctor.userId._id.toString()).emit("status-updated", {
        message: `New Appointment Request from ${req.user.name || "a Patient"}`,
        appointment: fullAppointment,
        isNew: true, // Frontend needs this to add card
      });
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment: fullAppointment,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- 2. DASHBOARD STATS (Fixed) ---
const getDoctorDashboardStats = async (req, res) => {
  try {
    // 🔥 FIX: Secure way to get Doctor ID
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor profile not found" });

    const doctorId = doctor._id; // Real ObjectId

    const stats = await Appointment.aggregate([
      {
        $match: {
          doctorId: new mongoose.Types.ObjectId(doctorId), // Ab ye crash nahi hoga
        },
      },
      {
        $group: {
          _id: "$doctorId",
          totalAppointments: { $sum: 1 },
          totalEarnings: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0],
            },
          },
          uniquePatients: { $addToSet: "$patientId" },
        },
      },
      {
        $project: {
          _id: 0,
          totalAppointments: 1,
          totalEarnings: 1,
          totalPatients: { $size: "$uniquePatients" },
        },
      },
    ]);

    const data = stats.length > 0
        ? stats[0]
        : { totalAppointments: 0, totalEarnings: 0, totalPatients: 0 };

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Stats fetch failed" });
  }
};

// --- 3. GET APPOINTMENTS ---
const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let appointments = [];

    if (userRole === "patient") {
      const patient = await Patient.findOne({ userId });
      if (!patient) return res.status(404).json({ message: "Profile not found" });

      appointments = await Appointment.find({ patientId: patient._id })
        .populate({
          path: "doctorId",
          select: "specialization consultationFee address",
          populate: { path: "userId", select: "name" },
        })
        .sort({ appointmentDate: -1 });

    } else if (userRole === "doctor") {
      const doctor = await Doctor.findOne({ userId });
      if (!doctor) return res.status(404).json({ message: "Profile not found" });

      appointments = await Appointment.find({ doctorId: doctor._id })
        .populate({
          path: "patientId",
          select: "gender age bloodGroup medicalHistory",
          populate: { path: "userId", select: "name email" },
        })
        .sort({ appointmentDate: 1 });
    }

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- 4. UPDATE STATUS ---
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    
    // Find appointment (Populate both sides to notify everyone)
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });

    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    const io = req.app.get("io");

    // 1. Notify Patient
    const patientData = await Patient.findById(appointment.patientId).populate("userId");
    if (patientData?.userId) {
        io.to(patientData.userId._id.toString()).emit("status-updated", {
            appointmentId,
            status,
            message: `Your appointment is now ${status}`,
        });
    }

    // 2. Notify Doctor (Agar Patient Cancel kare to Doctor ko pata chale)
    const doctorData = await Doctor.findById(appointment.doctorId).populate("userId");
    if (doctorData?.userId) {
        io.to(doctorData.userId._id.toString()).emit("status-updated", {
            appointmentId,
            status,
            message: `Appointment updated to ${status}`,
        });
    }

    res.status(200).json({
      success: true,
      message: `Appointment marked as ${status}`,
      appointment,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  getDoctorDashboardStats
};