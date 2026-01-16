const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// --- 1. BOOK APPOINTMENT (Patient Only) ---
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, slot, reason } = req.body;
    const userId = req.user.id; // Logged in user (Patient)

    // A. Find the Patient Profile
    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found. Please complete your profile first.",
      });
    }

    // B. Check if Doctor exists & get Fee
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // C. DOUBLE BOOKING CHECK
    // Check if slot is taken (ignoring cancelled appointments)
    const isSlotTaken = await Appointment.findOne({
      doctorId,
      appointmentDate,
      "slot.startTime": slot.startTime,
      status: { $ne: "cancelled" }, 
    });

    if (isSlotTaken) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked. Please choose another.",
      });
    }

    // D. Create Appointment
    const newAppointment = await Appointment.create({
      doctorId,
      patientId: patient._id,
      appointmentDate,
      slot,
      reason,
      amount: doctor.consultationFee, // Snapshot fee
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment: newAppointment,
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- 2. GET USER APPOINTMENTS (The Enhanced Version) ---
const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let appointments = [];

    if (userRole === "patient") {
      // PATIENT VIEW: See which doctor I booked
      const patient = await Patient.findOne({ userId });
      if (!patient) return res.status(404).json({ message: "Profile not found" });

      appointments = await Appointment.find({ patientId: patient._id })
        .populate({
          path: "doctorId",
          select: "specialization consultationFee degree phone address", // Doctor details
          populate: { path: "userId", select: "name" } // Doctor Name
        })
        .sort({ appointmentDate: -1 }); // Newest first (History)

    } else if (userRole === "doctor") {
      // DOCTOR VIEW: See which patient booked me
      const doctor = await Doctor.findOne({ userId });
      if (!doctor) return res.status(404).json({ message: "Profile not found" });

      appointments = await Appointment.find({ doctorId: doctor._id })
        .populate({
          path: "patientId",
          select: "gender age bloodGroup medicalHistory phone", // Patient Medical Data
          populate: { path: "userId", select: "name email" } // Patient Name
        })
        .sort({ appointmentDate: 1 }); // Oldest/Upcoming first (Schedule)
    }

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });

  } catch (error) {
    console.error("Fetch Appointments Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- 3. UPDATE STATUS (Doctor/Admin Only) ---
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body; // status: 'approved', 'cancelled', 'completed'

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
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