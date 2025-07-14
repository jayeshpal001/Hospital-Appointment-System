import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get("/appointments/doctor", {
          withCredentials: true,
        });
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching doctor's appointments", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    

    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
  try {
    await axios.put(`/appointments/cancel/${id}`);
    alert("Appointment cancelled");
    setAppointments(prev => prev.map(appt =>
      appt._id === id ? { ...appt, status: "cancelled" } : appt
    ));
  } catch (error) {
    alert("Failed to cancel appointment");
  }
};

const handleComplete = async (id) => {
  try {
    await axios.put(`/appointments/complete/${id}`);
    alert("Appointment marked as completed");
    setAppointments(prev => prev.map(appt =>
      appt._id === id ? { ...appt, status: "completed" } : appt
    ));
  } catch (error) {
    alert("Failed to complete appointment");
  }
};


  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Appointments Booked With You
      </h2>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments found.</p>
      ) : (
        appointments.map((appt) => (
          <div key={appt._id} className="mb-4 border-b pb-3">
            <p>
              <strong>Patient:</strong> {appt.patient?.name}
            </p>
            <p>
              <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {appt.time}
            </p>
            {appt.status === "booked" && (
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleCancel(appt._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleComplete(appt._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Mark as Completed
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DoctorAppointments;
