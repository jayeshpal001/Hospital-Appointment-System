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
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    //  Make sure to match logged-in patient
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to cancel this appointment" });
    }

    await appointment.deleteOne(); //  This line deletes from DB

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

const getAppointmentsForDoctor = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: "Only doctors can access this" });
    }

    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email')   // Show patient info
      .sort({ date: 1 }); // Optional: sort by upcoming first

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelAppointmentByDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this appointment" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({ message: "Appointment cancelled by doctor" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to complete this appointment" });
    }

    appointment.status = "completed";
    await appointment.save();

    res.status(200).json({ message: "Appointment marked as completed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  bookAppointment,
  cancelAppointment,
  getAppointments, 
  getAppointmentsForDoctor, 
  cancelAppointmentByDoctor, 
  completeAppointment
};