import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosInstance.get("/users/doctors"); 
        setDoctors(res.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading doctors...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Doctors List
      </h1>

      {doctors.length === 0 ? (
        <p className="text-center text-gray-600">No doctors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white shadow-md rounded-2xl p-4 text-center border hover:shadow-lg transition"
            >
              <img
                src={doctor.image || "https://via.placeholder.com/150"}
                alt={doctor.name}
                className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {doctor.name}
              </h2>
              <p className="text-sm text-gray-500"> {doctor.email}</p>
              <p className="text-sm text-gray-500"> {doctor.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
