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
} from "react-icons/fa";

import api from "../api/axios";
import { showToast } from "../components/ui/Form";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
// Safety Check: Remove /api if present
const ENDPOINT = SERVER_URL ? SERVER_URL.replace("/api", "") : "http://localhost:5000";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  //  1. NOTIFICATION HELPER FUNCTION ---
  const sendDeviceNotification = (title, body) => {
    // Check if browser supports notifications
    if (!("Notification" in window)) return;

    // Check permission
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/vite.svg", // Aap yahan apna Logo path daal sakte hain (e.g., /logo.png)
        vibrate: [200, 100, 200], // Mobile vibration pattern
      });
    }
  };

  //  2. REQUEST PERMISSION ON LOAD ---
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointment/my-appointments");

      if (res.data.success) {
        setAppointments(res.data.data);
        const storedRole = localStorage.getItem("role");
        setUserRole(storedRole);
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);
  

  useEffect(() => {
    // 1. Connection Options (Auto-reconnect on)
    const socket = io(ENDPOINT, {
      reconnection: true,
      reconnectionAttempts: 5,
      transports: ["websocket"], // Force WebSocket for better speed
    });

    socket.on("connect", () => {
      console.log("Frontend Socket Connected ID:", socket.id);

      // LocalStorage se User ID nikalo
      const userId = localStorage.getItem("userId");

      if (userId) {
        // Server ko batao: "Main ye user hoon, mujhe mere room me daalo"
        socket.emit("join-room", userId);
        console.log(" Sent join-room request for:", userId);
      } else {
        console.warn("User ID not found in LocalStorage! Cannot join room.");
      }
    });

    // 3. LISTEN FOR UPDATES
    //  SMART LISTENER (Handles Both New & Updates)
    socket.on("status-updated", (data) => {
        console.log(" Data Received:", data);
        
        // A. App Toast
        showToast("info", data.message);

        // B.DEVICE NOTIFICATION TRIGGER
        sendDeviceNotification("Vitalis Update", data.message);

        setAppointments((prev) => {
            // Step 1: Check karein ki kya ye appointment list me pehle se hai?
            const exists = prev.some(appt => appt._id === data.appointmentId || appt._id === data.appointment?._id);

            if (exists) {
                // CASE A: Purana Card hai -> Sirf Status Update karo
                console.log(" Updating Existing Status");
                return prev.map((appt) => {
                    // ID match hone par status badal do
                    if (appt._id === data.appointmentId || appt._id === data.appointment?._id) {
                        return { ...appt, status: data.status };
                    }
                    return appt;
                });
            } else {
                // CASE B: List me nahi hai + Full Data aaya hai -> Naya Card Add karo
                if (data.appointment) {
                    console.log(" Adding New Card");
                    return [data.appointment, ...prev];
                }
                
                // Agar data hi nahi hai to kuch mat karo
                return prev;
            }
        });
    });

    // 4. CLEANUP
    return () => {
      socket.disconnect(); // Component hatne par disconnect karo
      console.log("Socket Disconnected via Cleanup");
    };
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const res = await api.put("/appointment/status", {
        appointmentId: id,
        status,
      });
      if (res.data.success) {
        showToast("success", `Appointment ${status}`);
        fetchAppointments();
      }
    } catch (error) {
      showToast("error", "Action Failed");
    }
  };

  // --- HELPER FUNCTIONS ---
  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle />;
      case "cancelled":
        return <FaTimesCircle />;
      default:
        return <FaHourglassHalf />;
    }
  };

  // --- CHECK IF DOCTOR ---
  // If role is missing, we assume it's NOT a doctor (so it defaults to Patient view)
  const isDoctor = userRole === "doctor";

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 p-4 md:p-8 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {isDoctor ? "Doctor" : "Patient"}. You have{" "}
              <span className="text-cyan-400 font-bold">
                {appointments.length}
              </span>{" "}
              appointments.
            </p>
          </div>
        </div>

        {/* Appointments Grid */}
        {appointments.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
            <p className="text-gray-500 text-lg">No appointments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {appointments.map((appt) => (
                <motion.div
                  key={appt._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all group relative overflow-hidden"
                >
                  {/* Status Strip */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      appt.status === "approved"
                        ? "bg-green-500"
                        : appt.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }`}
                  ></div>

                  <div className="flex justify-between items-start mb-4 pl-4">
                    {/* Profile Info */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                                    ${!isDoctor ? "bg-linear-to-br from-cyan-500 to-blue-600" : "bg-linear-to-br from-green-500 to-teal-600"}
                                `}
                      >
                        {!isDoctor ? (
                          <FaUserMd className="text-white" />
                        ) : (
                          <FaUser className="text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {/* FIX: Default to Doctor Name if not a doctor role */}
                          {!isDoctor
                            ? appt.doctorId?.userId?.name
                              ? `Dr. ${appt.doctorId.userId.name}`
                              : "Unknown Doctor"
                            : appt.patientId?.userId?.name || "Unknown Patient"}
                        </h3>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          {!isDoctor ? (
                            <>
                              <FaStethoscope className="text-cyan-400" />{" "}
                              {appt.doctorId?.specialization || "General"}
                            </>
                          ) : (
                            <>
                              <FaTint className="text-red-400" /> Blood:{" "}
                              {appt.patientId?.bloodGroup || "N/A"}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 uppercase tracking-wide ${getStatusStyle(appt.status)}`}
                    >
                      {getStatusIcon(appt.status)} {appt.status}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="pl-4 grid grid-cols-2 gap-4 mb-4 bg-black/20 p-4 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <FaCalendarAlt /> Date
                      </p>
                      <p className="text-white font-medium">
                        {new Date(appt.appointmentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <FaClock /> Time
                      </p>
                      <p className="text-white font-medium">
                        {appt.slot.startTime} - {appt.slot.endTime}
                      </p>
                    </div>

                    {/* Doctor Only: Medical History */}
                    {isDoctor && (
                      <div className="col-span-2 border-t border-white/10 pt-2 mt-1">
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <FaFileMedicalAlt /> Medical History
                        </p>
                        <p className="text-gray-300 text-sm italic">
                          "{appt.patientId?.medicalHistory || "None provided"}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* --- ACTIONS --- */}
                  <div className="pl-4 mt-4 pt-4 border-t border-white/5">
                    {/* Doctor Actions */}
                    {isDoctor && appt.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleStatus(appt._id, "approved")}
                          className="flex-1 py-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 font-bold text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatus(appt._id, "cancelled")}
                          className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {/* PATIENT ACTIONS (Cancel Button Fix)  */}
                    {!isDoctor &&
                      (appt.status === "pending" ||
                        appt.status === "approved") && (
                        <button
                          onClick={() => handleStatus(appt._id, "cancelled")}
                          className="w-full py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all font-bold text-sm flex items-center justify-center gap-2"
                        >
                          <FaBan /> Cancel Appointment
                        </button>
                      )}

                    {(appt.status === "cancelled" ||
                      appt.status === "completed") && (
                      <p className="text-center text-xs text-gray-500 italic">
                        No actions available
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;