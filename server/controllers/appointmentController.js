const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// --- 1. BOOK APPOINTMENT (Patient Only) ---
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, slot, reason } = req.body;
    const userId = req.user.id; 

    // A. Find Patient
    const patient = await Patient.findOne({ userId });
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found." });

    // B. Find Doctor (Populate userId for Socket)
    const doctor = await Doctor.findById(doctorId).populate("userId"); 
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    // C. Check Slot
    const isSlotTaken = await Appointment.findOne({
      doctorId,
      appointmentDate,
      "slot.startTime": slot.startTime,
      status: { $ne: "cancelled" },
    });

    if (isSlotTaken) return res.status(400).json({ success: false, message: "Slot already booked." });

    // D. Create Appointment (Raw Data)
    let newAppointment = await Appointment.create({
      doctorId,
      patientId: patient._id,
      appointmentDate,
      slot,
      reason,
      amount: doctor.consultationFee,
      status: "pending",
    });

    // 🔥 STEP E: POPULATE DATA (Ye nayi line hai jo card dikhayegi) 🔥
    // Hum usi appointment ko wapas dhoond kar poora data bhar rahe hain
    const fullAppointment = await Appointment.findById(newAppointment._id)
      .populate({
        path: "patientId",
        select: "gender age bloodGroup medicalHistory", 
        populate: { path: "userId", select: "name email" } // Patient Name
      })
      .populate({
        path: "doctorId",
        select: "specialization address",
        populate: { path: "userId", select: "name" }
      });

    // F. Notify Doctor (USING SAME OLD EVENT NAME)
    const io = req.app.get("io");
    if (doctor.userId) {
        console.log("📢 Emitting status-updated to Doctor:", doctor.userId._id);
        
        // Hum event name 'status-updated' hi rakhenge taaki notification fail na ho
        io.to(doctor.userId._id.toString()).emit("status-updated", {
            message: `New Appointment Request from ${req.user.name || "a Patient"}`,
            appointment: fullAppointment, // 👈 Ab ye Poora Object hai!
            isNew: true // 👈 Ye flag batayega ki ye naya hai
        });
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment: fullAppointment, // Response me bhi full data
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- 2. GET USER APPOINTMENTS (Perfect) ---
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

// --- 3. UPDATE STATUS (Fixed Socket Logic) ---
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    // 1. Update DB
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // 2. FIND REAL USER ID (Crucial Fix)
    // Appointment me sirf PatientId hai, humein uske andar ka UserId chahiye
    // Isliye hum Patient model ko dhoond kar populate karenge
    const patientData = await Patient.findById(appointment.patientId).select("userId");
    
    // 3. Emit Real-time Event
    const io = req.app.get("io");
    
    if (patientData && patientData.userId) {
        // Ab hum sahi kamre (Room) me awaz laga rahe hain
        const roomID = patientData.userId.toString();
        
        console.log(`Emitting to Room: ${roomID}`); // Debugging k liye

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