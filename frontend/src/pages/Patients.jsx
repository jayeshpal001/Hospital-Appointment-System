import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {

        const response = await axiosInstance.get("/users/patients");
        setPatients(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold text-gray-700">
          Loading patients...
        </h2>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-red-600 text-lg font-semibold">{error}</h2>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
         All Registered Patients
      </h1>

      {patients.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          No patients found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
               
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-6 py-3 border-b text-gray-800">
                    {patient.name}
                  </td>
                  <td className="px-6 py-3 border-b text-gray-800">
                    {patient.email}
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
