import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
<<<<<<< HEAD
import axiosInstance from "../api/axiosInstance";
=======
>>>>>>> 1447434633a0b35c79863834a7e5329f354f67bc

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(storedUser);
  }, []);

 const handleLogout = async () => {
  try {
    await axiosInstance.post("/users/logout", {}, {
      withCredentials: true, 
    });

    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/login");

  } catch (error) {
    console.log("Logout error:", error);
  }
};

  // Function to apply active style
  const linkClass = (path) =>
    `relative px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
      location.pathname === path
        ? "bg-white/20 text-yellow-300 shadow-sm"
        : "hover:bg-white/10"
    }`;

  // Function to apply active style
  const linkClass = (path) =>
    `relative px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
      location.pathname === path
        ? "bg-white/20 text-yellow-300 shadow-sm"
        : "hover:bg-white/10"
    }`;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
<<<<<<< HEAD
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide flex items-center gap-2"
        >
           <span>HospitalSys</span>
        </Link>
=======
        <h1
         
          className="text-2xl font-bold tracking-wide flex items-center gap-2"
        >
           <span>HospitalSys</span>
        </h1>
>>>>>>> 1447434633a0b35c79863834a7e5329f354f67bc

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {userInfo ? (
            <>
              {userInfo.role !== "doctor" ? (
                <Link to="/appointments" className={linkClass("/appointments")}>
                  Appointments
                </Link>
              ) : (
                <Link
                  to="/doctor/appointments"
                  className={linkClass("/doctor/appointments")}
                >
                  Appointments
                </Link>
              )}

              {userInfo.role === "patient" && (
                <Link
                  to="/appointment/book"
                  className={linkClass("/appointment/book")}
                >
                  Book
                </Link>
              )}

              {userInfo.role === "admin" || userInfo.role === "doctor" ? (
                <Link to="/patients" className={linkClass("/patients")}>
                  Patients
                </Link>
              ) : (
                <Link to="/doctors" className={linkClass("/doctors")}>
<<<<<<< HEAD
                  Doctors 
=======
                  Doctors
>>>>>>> 1447434633a0b35c79863834a7e5329f354f67bc
                </Link>
              )}

              <div className="ml-5 flex items-center gap-3 border-l border-white/20 pl-4">
                <span className="text-sm opacity-90">{userInfo.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass("/login")}>
                Login
              </Link>
              <Link to="/register" className={linkClass("/register")}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-6 py-4 space-y-3">
          {userInfo ? (
            <>
              {userInfo.role !== "doctor" ? (
                <Link
                  to="/appointments"
                  className={linkClass("/appointments")}
                  onClick={() => setMenuOpen(false)}
                >
                  Appointments
                </Link>
              ) : (
                <Link
                  to="/doctor/appointments"
                  className={linkClass("/doctor/appointments")}
                  onClick={() => setMenuOpen(false)}
                >
                  Appointments
                </Link>
              )}

              {userInfo.role === "patient" && (
                <Link
                  to="/appointment/book"
                  className={linkClass("/appointment/book")}
                  onClick={() => setMenuOpen(false)}
                >
                  Book Appointment
                </Link>
              )}

              {userInfo.role === "admin" || userInfo.role === "doctor" ? (
                <Link
                  to="/patients"
                  className={linkClass("/patients")}
                  onClick={() => setMenuOpen(false)}
                >
                  Patients
                </Link>
              ) : (
                <Link
                  to="/doctors"
                  className={linkClass("/doctors")}
                  onClick={() => setMenuOpen(false)}
                >
                  Doctors
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md mt-3"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/login")}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/register")}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
