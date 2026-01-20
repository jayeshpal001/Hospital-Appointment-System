import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaEdit,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaBirthdayCake,
  FaVenusMars,
  FaTint,
  FaNotesMedical,
  FaAllergies,
} from "react-icons/fa";

// Import your reusable toast components
import { CustomToaster, showToast } from "../components/ui/Form";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const { setIsAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await new Promise((r) => setTimeout(r, 1000)); // Smooth delay

        // Make sure this route exists in your backend
        const res = await api.get("/user/patientProfile");

        if (res.data.success) {
          setProfile(res.data.patient);
        }
      } catch (error) {
        console.error(error);
        showToast("error", "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setIsAuth(false);
      localStorage.removeItem("role");
      showToast("success", "Logged out successfully");
      navigate("/");
    } catch (error) {
      showToast("error", "Logout failed");
    }
  };
  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 },
    },
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-green-500 rounded-full blur-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // Destructure Data
  const {
    userId: user,
    age,
    gender,
    bloodGroup,
    phone,
    address,
    nationality,
    medicalHistory,
  } = profile;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-slate-200 font-sans p-4 md:p-8 overflow-hidden">
      {/* Background Aurora (Green/Teal Theme for Patients) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-aurora"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-teal-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-aurora animation-delay-2000"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto"
      >
        {/* HEADER SECTION */}
        <motion.div
          variants={itemVariants}
          className="w-full bg-linear-to-r from-white/10 to-white/5 backdrop-blur-3xl border border-white/10 rounded-[30px] p-8 shadow-2xl mb-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-400 via-teal-500 to-blue-500"></div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-green-400 to-teal-600 p-0.75 shadow-[0_0_30px_rgba(52,211,153,0.4)]">
                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center overflow-hidden">
                  <FaUser className="text-6xl text-gray-400 group-hover:text-green-400 transition-colors duration-500" />
                </div>
              </div>
            </div>

            {/* Name & Chips */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                {user.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                {/* Gender Chip */}
                <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold flex items-center gap-2 capitalize">
                  <FaVenusMars /> {gender}
                </span>
                {/* Age Chip */}
                <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-bold flex items-center gap-2">
                  <FaBirthdayCake /> {age} Years Old
                </span>
              </div>
              <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                <FaEnvelope className="text-gray-500" /> {user.email}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-3">
              <button
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all text-white group"
                title="Edit Profile"
              >
                <FaEdit className="text-xl group-hover:text-green-400" />
              </button>
              <button
              onClick={handleLogout}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all text-red-400 group"
                title="Logout"
              >
                <FaSignOutAlt className="text-xl group-hover:text-red-500" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. LEFT COLUMN: Contact & Personal */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform">
                  <FaPhoneAlt size={20} />
                </div>
                <h3 className="text-gray-400 font-medium">Contact Info</h3>
              </div>

              <div className="space-y-4">
                {/* Nationality */}
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FaGlobe /> Nationality
                  </span>
                  <span className="text-white">{nationality}</span>
                </div>

                {/* Phone */}
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                  <span className="text-gray-500">Phone</span>
                  <span className="text-white font-mono">{phone}</span>
                </div>

                {/* Address */}
                <div className="pt-1">
                  <span className="text-gray-500 text-xs flex items-center gap-1 mb-2">
                    <FaMapMarkerAlt /> Home Address
                  </span>
                  <p className="text-white text-sm leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                    {address}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. RIGHT COLUMN: Medical Info */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            {/* Blood Group & Medical History Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Blood Group Card (Highlighted) */}
              <div className="md:col-span-1 bg-linear-to-br from-red-500/10 to-pink-600/10 border border-red-500/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:border-red-500/40 transition-all relative overflow-hidden group">
                <div className="absolute inset-0 bg-red-500/5 blur-xl group-hover:opacity-100 opacity-50 transition-opacity"></div>
                <div className="p-4 bg-red-500/20 rounded-full text-red-400 mb-3 group-hover:scale-110 transition-transform z-10">
                  <FaTint size={30} />
                </div>
                <h3 className="text-gray-400 text-sm font-medium z-10">
                  Blood Group
                </h3>
                <p className="text-4xl font-bold text-white mt-1 z-10 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  {bloodGroup}
                </p>
              </div>

              {/* Medical History Card */}
              <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full blur-2xl"></div>

                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <FaNotesMedical className="text-green-400" /> Medical History
                </h2>

                <div className="bg-black/20 rounded-2xl p-5 border border-white/5 min-h-30">
                  {medicalHistory ? (
                    <div className="flex items-start gap-3">
                      <FaAllergies className="text-orange-400 mt-1 shrink-0" />
                      <p className="text-gray-300 leading-relaxed">
                        {medicalHistory}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic flex items-center gap-2">
                      <FaNotesMedical /> No existing medical conditions
                      reported.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info / Future Features */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Upcoming Appointments
                </h3>
                <p className="text-gray-400 text-sm">
                  You have no scheduled appointments.
                </p>
              </div>
              <button
                onClick={() => navigate("/findDoctors")}
                className="px-6 py-2.5 rounded-xl bg-linear-to-r from-green-500 to-teal-600 text-white font-bold shadow-lg hover:scale-105 transition-transform text-sm"
              >
                Book Appointment
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientProfile;
