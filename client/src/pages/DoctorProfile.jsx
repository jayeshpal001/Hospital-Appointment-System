import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaEnvelope,
  FaBriefcase,
  FaMoneyBillWave,
  FaClock,
  FaCalendarCheck,
  FaPhoneAlt,
  FaEdit,
  FaSignOutAlt,
  FaGraduationCap,
  FaGlobe,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
} from "react-icons/fa";

import { showToast } from "../components/ui/Form";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const DoctorProfile = () => {
    const { setIsAuth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/doctorProfile");

        if (res.data.success) {
          setProfile(res.data.doctor);
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

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-cyan-500 rounded-full blur-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // Destructure All Data (Old + New)
  const {
    userId: user,
    degree,
    specialization,
    experience,
    age,
    gender, // Added gender here
    nationality,
    phone,
    address,
    availableDays,
    availableSlots,
    consultationFee,
  } = profile;

  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-slate-200 font-sans p-4 md:p-8 overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-aurora"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-aurora animation-delay-2000"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto"
      >
        {/* HEADER SECTION */}
        <motion.div
          variants={itemVariants}
          className="w-full bg-linear-to-r from-white/10 to-white/5 backdrop-blur-3xl border border-white/10 rounded-[30px] p-8 shadow-2xl mb-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500"></div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-cyan-400 to-blue-600 p-0.75 shadow-[0_0_30px_rgba(0,242,254,0.4)]">
                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center overflow-hidden">
                  <FaUserMd className="text-6xl text-gray-400 group-hover:text-cyan-400 transition-colors duration-500" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-[#111] rounded-full"></div>
            </div>

            {/* Name & Chips */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Dr. {user.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                {/* Degree Chip */}
                <span className="px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-bold flex items-center gap-2">
                  <FaGraduationCap /> {degree}
                </span>
                {/* Specialization Chip */}
                <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-bold uppercase tracking-wider">
                  {specialization}
                </span>
                {/* Experience Chip */}
                <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-bold flex items-center gap-2">
                  <FaBriefcase /> {experience}+ Years
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row md:flex-col gap-3">
              <button
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all text-white group"
                title="Edit Profile"
              >
                <FaEdit className="text-xl group-hover:text-cyan-400" />
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
          {/* 1. LEFT COLUMN: Personal Info & Fee */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 space-y-6"
          >
            {/* Fee Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 rounded-lg bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
                  <FaMoneyBillWave size={24} />
                </div>
                <h3 className="text-gray-400 font-medium">Consultation Fee</h3>
              </div>
              <p className="text-3xl font-bold text-white ml-2">
                ₹ {consultationFee.toLocaleString()}
                <span className="text-sm text-gray-500 font-normal ml-2">
                  / visit
                </span>
              </p>
            </div>

            {/* Personal Details Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <FaPhoneAlt size={20} />
                </div>
                <h3 className="text-gray-400 font-medium">Personal Details</h3>
              </div>

              <div className="space-y-4">
                {/* Age & Gender Row */}
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs flex items-center gap-1 mb-1">
                      <FaBirthdayCake /> Age
                    </span>
                    <span className="text-white font-medium">{age} Years</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-gray-500 text-xs flex items-center gap-1 justify-end mb-1">
                      <FaVenusMars /> Gender
                    </span>
                    <span className="text-white font-medium capitalize">
                      {gender}
                    </span>
                  </div>
                </div>

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

                {/* Email */}
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                  <span className="text-gray-500">Email</span>
                  <span
                    className="text-white truncate max-w-37.5"
                    title={user.email}
                  >
                    {user.email}
                  </span>
                </div>

                {/* Address */}
                <div className="pt-1">
                  <span className="text-gray-500 text-xs flex items-center gap-1 mb-2">
                    <FaMapMarkerAlt /> Clinic Address
                  </span>
                  <p className="text-white text-sm leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                    {address}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. RIGHT COLUMN: Schedule & Availability */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full blur-2xl"></div>

              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <FaCalendarCheck className="text-cyan-400" /> Availability
                Schedule
              </h2>

              {/* Days Visualizer */}
              <div className="mb-10">
                <label className="text-sm text-gray-400 mb-4 block font-medium">
                  Working Days
                </label>
                <div className="flex flex-wrap gap-3">
                  {allDays.map((day) => {
                    const isActive = availableDays.includes(day);
                    return (
                      <div
                        key={day}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300
                                            ${
                                              isActive
                                                ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,242,254,0.4)] scale-110 border border-transparent"
                                                : "bg-[#111] text-gray-600 border border-white/5"
                                            }`}
                      >
                        {day.slice(0, 3)}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div>
                <label className="text-sm text-gray-400 mb-4 block font-medium">
                  Daily Slots
                </label>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availableSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-black/30 border border-white/10 p-4 rounded-xl hover:border-cyan-500/30 transition-colors group"
                      >
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                          <FaClock />
                        </div>
                        <div>
                          <p className="text-white font-bold tracking-wide text-lg">
                            {slot.startTime}{" "}
                            <span className="text-gray-500 text-sm font-normal">
                              to
                            </span>{" "}
                            {slot.endTime}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-xs text-green-400 uppercase tracking-wider font-bold">
                              Active Slot
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-500">No time slots configured.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorProfile;
