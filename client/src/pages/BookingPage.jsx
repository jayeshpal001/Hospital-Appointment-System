import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  FaUserMd, FaCalendarAlt, FaClock, FaMapMarkerAlt, 
  FaMoneyBillWave, FaArrowLeft, FaNotesMedical, FaCalendarCheck 
} from "react-icons/fa";
import { CustomToaster, showToast, GradientButton } from "../components/ui/Form";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // --- FETCH DOCTOR DETAILS ---
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/public/doctor/${id}`, { withCredentials: true });
        if (res.data.success) {
          setDoctor(res.data.doctor);
        }
      } catch (error) {
        showToast("error", "Doctor not found");
        navigate("/find-doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, navigate]);

  // --- VALIDATION HELPER ---
  const isDateValid = (dateString) => {
    if (!doctor) return false;
    const date = new Date(dateString);
    // Get day name (e.g., "Mon", "Tue")
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return doctor.availableDays.includes(dayName);
  };

  // --- HANDLE BOOKING ---
  const handleBook = async () => {
    if (!selectedDate) {
      showToast("error", "Please select a Date");
      return;
    }

    // 🛑 NEW: Check if doctor works on this day
    if (!isDateValid(selectedDate)) {
        const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
        showToast("error", `Doctor is not available on ${dayName}s.`);
        return;
    }

    if (!selectedSlot) {
      showToast("error", "Please select a Time Slot");
      return;
    }

    setIsBooking(true);
    try {
      await new Promise(r => setTimeout(r, 1500));

      const payload = {
        doctorId: id,
        appointmentDate: selectedDate,
        slot: selectedSlot,
        reason: reason || "General Consultation"
      };

      const res = await axios.post("http://localhost:5000/api/appointment/book", payload, { withCredentials: true });

      if (res.data.success) {
        showToast("success", "Appointment Booked Successfully!");
        setTimeout(() => navigate("/dashboard"), 2000); 
      }

    } catch (error) {
      const msg = error.response?.data?.message || "Booking failed";
      showToast("error", msg);
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-cyan-400">Loading...</div>;
  if (!doctor) return null;

  // Destructure added availableDays
  const { userId: user, specialization, consultationFee, address, availableSlots, degree, availableDays } = doctor;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 p-4 md:p-8 font-sans relative overflow-hidden">
     

      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <FaArrowLeft /> Back to Doctors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Doctor Info Card */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[30px] p-8 sticky top-8">
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-cyan-400 to-blue-600 p-0.5 mb-4 shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                        <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center">
                             <FaUserMd className="text-4xl text-gray-300" />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-1">Dr. {user.name}</h2>
                    <p className="text-cyan-400 font-medium mb-4">{specialization} ({degree})</p>

                    <div className="w-full h-px bg-white/10 my-4"></div>

                    <div className="w-full space-y-4 text-left">
                        <div className="flex items-center gap-3 text-gray-400">
                            <FaMapMarkerAlt className="text-cyan-500" /> 
                            <span className="text-sm">{address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                            <FaMoneyBillWave className="text-green-500" /> 
                            <span className="text-white font-bold text-lg">₹ {consultationFee}</span>
                        </div>
                    </div>

                    {/* ✨ NEW SECTION: AVAILABLE DAYS ✨ */}
                    <div className="w-full mt-6 text-left">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <FaCalendarCheck /> Working Days
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                                const isWorking = availableDays.includes(day);
                                return (
                                    <span key={day} 
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all
                                        ${isWorking 
                                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                                            : "bg-white/5 text-gray-600 border border-white/5 opacity-50"
                                        }`}
                                    >
                                        {day}
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Booking Form */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[30px] p-8">
                <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-400" /> Select Appointment Time
                </h1>

                {/* Date Picker */}
                <div className="mb-8">
                    <label className="block text-gray-400 text-sm mb-2 ml-1">Pick a Date</label>
                    <input 
                        type="date" 
                        min={new Date().toISOString().split("T")[0]}
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            // Visual feedback if date is wrong
                            if (!isDateValid(e.target.value)) {
                                showToast("error", "Doctor is not available on this day!");
                            }
                        }}
                        className={`w-full bg-black/30 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors cursor-pointer
                            ${selectedDate && !isDateValid(selectedDate) 
                                ? "border-red-500/50 focus:border-red-500" 
                                : "border-white/10 focus:border-cyan-500"
                            }`}
                        style={{ colorScheme: "dark" }} 
                    />
                    {selectedDate && !isDateValid(selectedDate) && (
                        <p className="text-red-400 text-xs mt-2 ml-1">
                            * Doctor is only available on {availableDays.join(", ")}
                        </p>
                    )}
                </div>

                {/* Slot Selection */}
                <div className="mb-8">
                    <label className="block text-gray-400 text-sm mb-2 ml-1">Available Slots</label>
                    
                    {availableSlots.length > 0 ? (
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {availableSlots.map((slot, idx) => {
                                const isSelected = selectedSlot === slot;
                                return (
                                    <div 
                                        key={idx}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center justify-center transition-all duration-300
                                            ${isSelected 
                                                ? "bg-linear-to-r from-cyan-500 to-blue-600 border-transparent text-white shadow-[0_0_15px_rgba(0,242,254,0.4)] scale-105" 
                                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        <FaClock className={`mb-1 ${isSelected ? "text-white" : "text-cyan-500/70"}`} />
                                        <span className="font-bold text-sm">{slot.startTime}</span>
                                        <span className="text-[10px] opacity-70">to {slot.endTime}</span>
                                    </div>
                                )
                            })}
                         </div>
                    ) : (
                        <div className="p-4 border border-dashed border-white/10 rounded-xl text-center text-gray-500">
                            No slots defined by doctor.
                        </div>
                    )}
                </div>

                {/* Reason Input */}
                <div className="mb-8">
                    <label className="block text-gray-400 text-sm mb-2 ml-1">Reason for Visit (Optional)</label>
                    <div className="relative">
                        <FaNotesMedical className="absolute top-4 left-4 text-gray-500" />
                        <textarea 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Fever, Consultation, Follow-up..."
                            className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors h-24 resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Submit Button */}
                <GradientButton 
                    onClick={handleBook} 
                    loading={isBooking} 
                    variant="cyan"
                >
                    Confirm Booking
                </GradientButton>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;