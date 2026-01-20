import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserMd,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaStethoscope,
  FaTint,
  FaFileMedicalAlt,
  FaBan,
  FaSignOutAlt,
  FaMoneyBillWave,
  FaUsers,
  FaCalendarCheck
} from "react-icons/fa";

// 🔥 RTK QUERY IMPORTS
import { 
  useGetMyAppointmentsQuery, 
  useGetDoctorStatsQuery, 
  useUpdateAppointmentStatusMutation,
  useLogoutMutation
} from "../redux/api/apiSlice";

import { showToast } from "../components/ui/Form";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import GlassDropdown from "../components/ui/GlassDropdown"; 
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const ENDPOINT = SERVER_URL ? SERVER_URL.replace("/api", "") : "http://localhost:5000";

const Dashboard = () => {
  const { setIsAuth } = useAuth();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role"); // Get role directly
  const isDoctor = userRole === "doctor";

  // --- 🔥 RTK QUERY HOOKS (Auto Fetching) ---
  
  // 1. Get Appointments
  const { 
    data: appointmentsData, 
    isLoading: isApptLoading, 
    refetch: refetchAppointments 
  } = useGetMyAppointmentsQuery();

  // 2. Get Stats (Conditional Fetching: Only if Doctor)
  const { 
    data: statsData,
    refetch: refetchStats 
  } = useGetDoctorStatsQuery(undefined, { skip: !isDoctor });

  // 3. Mutations
  const [updateStatus] = useUpdateAppointmentStatusMutation();
  const [logoutApi] = useLogoutMutation();

  // --- STATE ---
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Derived Data (Safe Fallbacks)
  const appointments = appointmentsData?.data || [];
  const stats = statsData?.data || { totalAppointments: 0, totalEarnings: 0, totalPatients: 0 };

  // --- 🧠 FILTER LOGIC ---
  const filteredAppointments = appointments.filter((appt) => {
    if (filterStatus === "all") return true;
    return appt.status === filterStatus;
  });

  // --- NOTIFICATIONS ---
  const sendDeviceNotification = (title, body) => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/vite.svg", vibrate: [200, 100, 200] });
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // --- ⚡ SOCKET LOGIC ---
  useEffect(() => {
    const socket = io(ENDPOINT, {
      reconnection: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      const userId = localStorage.getItem("userId");
      if (userId) socket.emit("join-room", userId);
    });

    // Handle Real-time Updates
    socket.on("status-updated", (data) => {
        showToast("info", data.message);
        sendDeviceNotification("Vitalis Update", data.message);
        
        // 🔥 Force RTK Query to refresh data from server
        refetchAppointments();
        if(isDoctor) refetchStats();
    });

    return () => socket.disconnect();
  }, [isDoctor, refetchAppointments, refetchStats]);

  // --- HANDLERS ---
  const handleStatus = async (id, status) => {
    try {
      // 🔥 RTK Mutation (Auto-refetches lists via 'invalidatesTags')
      await updateStatus({ appointmentId: id, status }).unwrap();
      showToast("success", `Appointment ${status}`);
    } catch (error) {
      console.error(error);
      showToast("error", "Action Failed");
    }
  };

  const confirmLogout = async () => {
    try {
      await logoutApi().unwrap(); // Call Logout API
      setIsAuth(false);
      localStorage.clear(); // Clear all storage
      showToast("success", "Logged out successfully");
      navigate("/");
    } catch (error) {
      showToast("error", "Logout failed");
    } finally {
        setIsLogoutModalOpen(false);
    }
  };

  // --- UI HELPERS ---
  const getStatusStyle = (status) => {
    switch (status) {
      case "approved": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return <FaCheckCircle />;
      case "cancelled": return <FaTimesCircle />;
      default: return <FaHourglassHalf />;
    }
  };

  // --- RENDER LOADING ---
  if (isApptLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 p-4 md:p-8 font-sans relative overflow-hidden pb-32">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER & FILTER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {isDoctor ? "Doctor" : "Patient"}. You have{" "}
              <span className="text-cyan-400 font-bold">
                {filteredAppointments.length}
              </span>{" "}
              appointments.
            </p>
          </div>

          {/* Aesthetic Dropdown */}
          <GlassDropdown currentFilter={filterStatus} setFilter={setFilterStatus} />
        </div>

        {/* STATS CARDS (Only for Doctor) */}
        {isDoctor && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:border-green-500/30 transition-all">
                    <div className="p-4 rounded-xl bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]"><FaMoneyBillWave size={24} /></div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Earnings</p>
                        <h3 className="text-3xl font-bold text-white">₹ {stats.totalEarnings?.toLocaleString() || 0}</h3>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:border-blue-500/30 transition-all">
                    <div className="p-4 rounded-xl bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"><FaUsers size={24} /></div>
                    <div>
                        <p className="text-gray-400 text-sm">Unique Patients</p>
                        <h3 className="text-3xl font-bold text-white">{stats.totalPatients || 0}</h3>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:border-purple-500/30 transition-all">
                    <div className="p-4 rounded-xl bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]"><FaCalendarCheck size={24} /></div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Bookings</p>
                        <h3 className="text-3xl font-bold text-white">{stats.totalAppointments || 0}</h3>
                    </div>
                </motion.div>
            </div>
        )}

        {/* APPOINTMENTS GRID */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
            <p className="text-gray-500 text-lg">
                {filterStatus === "all" ? "No appointments found." : `No ${filterStatus} appointments found.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredAppointments.map((appt) => (
                <motion.div
                  key={appt._id}
                  layout 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all group relative overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      appt.status === "approved" ? "bg-green-500" : appt.status === "cancelled" ? "bg-red-500" : "bg-yellow-500"
                    }`}
                  ></div>

                  <div className="flex justify-between items-start mb-4 pl-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${!isDoctor ? "bg-linear-to-br from-cyan-500 to-blue-600" : "bg-linear-to-br from-green-500 to-teal-600"}`}>
                        {!isDoctor ? <FaUserMd className="text-white" /> : <FaUser className="text-white" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {!isDoctor
                            ? appt.doctorId?.userId?.name ? `Dr. ${appt.doctorId.userId.name}` : "Unknown Doctor"
                            : appt.patientId?.userId?.name || "Unknown Patient"}
                        </h3>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          {!isDoctor ? (
                            <> <FaStethoscope className="text-cyan-400" /> {appt.doctorId?.specialization || "General"} </>
                          ) : (
                            <> <FaTint className="text-red-400" /> Blood: {appt.patientId?.bloodGroup || "N/A"} </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 uppercase tracking-wide ${getStatusStyle(appt.status)}`}>
                      {getStatusIcon(appt.status)} {appt.status}
                    </div>
                  </div>

                  <div className="pl-4 grid grid-cols-2 gap-4 mb-4 bg-black/20 p-4 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaCalendarAlt /> Date</p>
                      <p className="text-white font-medium">{new Date(appt.appointmentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaClock /> Time</p>
                      <p className="text-white font-medium">{appt.slot.startTime} - {appt.slot.endTime}</p>
                    </div>
                    {isDoctor && (
                      <div className="col-span-2 border-t border-white/10 pt-2 mt-1">
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaFileMedicalAlt /> Medical History</p>
                        <p className="text-gray-300 text-sm italic">"{appt.patientId?.medicalHistory || "None provided"}"</p>
                      </div>
                    )}
                  </div>

                  <div className="pl-4 mt-4 pt-4 border-t border-white/5">
                    {isDoctor && appt.status === "pending" && (
                      <div className="flex gap-3">
                        <button onClick={() => handleStatus(appt._id, "approved")} className="flex-1 py-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 font-bold text-sm">Approve</button>
                        <button onClick={() => handleStatus(appt._id, "cancelled")} className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-sm">Reject</button>
                      </div>
                    )}
                    {!isDoctor && (appt.status === "pending" || appt.status === "approved") && (
                        <button onClick={() => handleStatus(appt._id, "cancelled")} className="w-full py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all font-bold text-sm flex items-center justify-center gap-2">
                          <FaBan /> Cancel Appointment
                        </button>
                    )}
                    {(appt.status === "cancelled" || appt.status === "completed") && (
                      <p className="text-center text-xs text-gray-500 italic">No actions available</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ConfirmationModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Logout from Dashboard?"
        message="Are you sure you want to log out?"
        confirmText="Yes, Logout"
        variant="danger"
        icon={FaSignOutAlt}
      />
    </div>
  );
};

export default Dashboard;