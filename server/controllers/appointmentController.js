const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, slot, reason } = req.body;
    const userId = req.user.id; 

    const patient = await Patient.findOne({ userId });
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found." });

    const doctor = await Doctor.findById(doctorId).populate("userId"); 
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    const isSlotTaken = await Appointment.findOne({
      doctorId,
      appointmentDate,
      "slot.startTime": slot.startTime,
      status: { $ne: "cancelled" },
    });

    if (isSlotTaken) return res.status(400).json({ success: false, message: "Slot already booked." });
    let newAppointment = await Appointment.create({
      doctorId,
      patientId: patient._id,
      appointmentDate,
      slot,
      reason,
      amount: doctor.consultationFee,
      status: "pending",
    });

  
    const fullAppointment = await Appointment.findById(newAppointment._id)
      .populate({
        path: "patientId",
        select: "gender age bloodGroup medicalHistory", 
        populate: { path: "userId", select: "name email" } 
      })
      .populate({
        path: "doctorId",
        select: "specialization address",
        populate: { path: "userId", select: "name" }
      });

    const io = req.app.get("io");
    if (doctor.userId) {
        console.log("Emitting status-updated to Doctor:", doctor.userId._id);
        
        io.to(doctor.userId._id.toString()).emit("status-updated", {
            message: `New Appointment Request from ${req.user.name || "a Patient"}`,
            appointment: fullAppointment, 
            isNew: true 
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
          populate: { path: "userId", select: "name" }
        })
        .sort({ appointmentDate: -1 });

    } else if (userRole === "doctor") {
      const doctor = await Doctor.findOne({ userId });
      if (!doctor) return res.status(404).json({ message: "Profile not found" });

      appointments = await Appointment.find({ doctorId: doctor._id })
        .populate({
          path: "patientId",
          select: "gender age bloodGroup medicalHistory",
          populate: { path: "userId", select: "name email" }
        })
        .sort({ appointmentDate: 1 });
    }

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const patientData = await Patient.findById(appointment.patientId).select("userId");

    const io = req.app.get("io");
    
    if (patientData && patientData.userId) {

        const roomID = patientData.userId.toString();
        
        console.log(`Emitting to Room: ${roomID}`); 

        io.to(roomID).emit("status-updated", {
            appointmentId,
            status,
            message: `Your appointment is now ${status}`
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

module.exports = { bookAppointment, getMyAppointments, updateAppointmentStatus };