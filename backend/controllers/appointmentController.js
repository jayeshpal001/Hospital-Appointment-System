const Appointment = require("../models/Appointment");
const User = require("../models/User");

// Book Appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const patientId = req.user.id; // from auth middleware

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Create appointment
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patientId,
      date,
      time
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Allow only patient or doctor to cancel
    if (
      appointment.patient.toString() !== req.user.id &&
      appointment.doctor.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized to cancel" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({ message: "Appointment cancelled", appointment });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Appointments (for logged-in user)
const getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.find({
      $or: [
        { patient: userId },
        { doctor: userId }
      ]
    })
      .populate("doctor", "name email")  // doctor info
      .populate("patient", "name email") // patient info
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  bookAppointment,
  cancelAppointment,
  getAppointments
};