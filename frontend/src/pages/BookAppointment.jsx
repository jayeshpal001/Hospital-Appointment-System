import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //  Fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("/users/doctors", {
          withCredentials: true,
        });
        setDoctors(res.data);
      } catch (err) {
        console.error(" Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, []);

  //  Handle form input
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //  Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/appointments/book", formData, {
        withCredentials: true,
      });

      alert(" Appointment booked!");
      navigate("/appointments"); // Redirect to view appointments
    } catch (err) {
      console.error(" Booking failed", err);
      setError(err.response?.data?.message || "Failed to book appointment");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-xl font-bold text-center mb-4 text-blue-600">
        Book Appointment
      </h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/*  Doctor Dropdown */}
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              Dr. {doc.name}
            </option>
          ))}
        </select>

        {/* Date Field */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
        />

        {/* Time Field */}
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
