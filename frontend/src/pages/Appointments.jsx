import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance"; // ← If you set one
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("/appointments/my"); // Protected route
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };
const handleCancel = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
      withCredentials: true,
    });
    alert("Appointment cancelled");

    // Remove from state without re-fetch
     
    setAppointments(prev => prev.filter(appt => appt._id !== id));
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    alert("Failed to cancel appointment");
  }
};


  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-md p-5">
      <h2 className="text-xl font-bold mb-4 text-center">Your Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments booked yet.</p>
      ) : (
        appointments.map((appt) => (
          <div key={appt._id} className="mb-4 border-b pb-3">
            <p>
              <strong>Doctor:</strong> {appt.doctor.name}
            </p>
            <p>
              <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {appt.time}
            </p>
            <button
              onClick={() => handleCancel(appt._id)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
            >
              Cancel Appointment
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Appointments;
