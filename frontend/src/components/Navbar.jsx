import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        🏥 HospitalSys
      </Link>

      <div className="flex gap-4 items-center">
        {userInfo ? (
          <>
            <Link to="/appointments" className="hover:underline">
              Appointments
            </Link>

            <Link to="/appointment/book" className="hover:underline">
              Book Appointment
            </Link>

            {userInfo.role === "admin" || userInfo.role === "doctor" ? (
              <Link to="/patients" className="hover:underline">
                Patients
              </Link>
            ) : (
              <Link to="/doctors" className="hover:underline">
                Doctors
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
