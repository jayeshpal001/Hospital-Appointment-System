import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserMd, FaStethoscope, FaMapMarkerAlt, FaStar, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CustomToaster } from "../components/ui/Form";

const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        await new Promise(r => setTimeout(r, 800)); // Smooth entry
        const res = await axios.get("http://localhost:5000/api/public/doctors", { withCredentials: true });
        if (res.data.success) {
          setDoctors(res.data.doctors);
        }
      } catch (error) {
        console.error("Error fetching doctors", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // --- Animations ---
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVars = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    show: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 relative overflow-hidden font-sans">
     
      
      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-10 text-center md:text-left"
        >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-500 mb-2">
                Find Your Specialist
            </h1>
            <p className="text-gray-400 text-lg">Book appointments with top-rated doctors.</p>
        </motion.div>

        {/* Loading Skeleton */}
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                    <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse border border-white/5"></div>
                ))}
            </div>
        ) : (
            
            /* Doctors Grid */
            <motion.div 
                variants={containerVars} 
                initial="hidden" 
                animate="show" 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {doctors.map((doc) => (
                    <motion.div 
                        key={doc._id}
                        variants={cardVars}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(0,242,254,0.15)] transition-all cursor-pointer relative overflow-hidden"
                        onClick={() => navigate(`/book/${doc._id}`)}
                    >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/0 via-transparent to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>

                        <div className="relative flex items-start justify-between mb-4">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-gray-800 to-black flex items-center justify-center border border-white/10 group-hover:border-cyan-400/50 transition-colors">
                                <FaUserMd className="text-3xl text-gray-400 group-hover:text-cyan-400" />
                            </div>
                            <div className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold flex items-center gap-1 border border-yellow-500/20">
                                <FaStar /> 4.8
                            </div>
                        </div>

                        {/* Info */}
                        <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">Dr. {doc.userId.name}</h2>
                        <p className="text-cyan-200 text-sm font-medium mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <FaStethoscope /> {doc.specialization}
                        </p>

                        <div className="space-y-2 mb-6">
                             <div className="flex items-center text-gray-400 text-sm gap-2">
                                <FaMapMarkerAlt className="text-gray-500" />
                                <span className="truncate">{doc.address}</span>
                             </div>
                             <div className="flex items-center text-gray-400 text-sm gap-2">
                                <span className="font-bold text-white">₹ {doc.consultationFee}</span>
                                <span className="text-xs">/ Consultation</span>
                             </div>
                        </div>

                        {/* Button */}
                        <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-2 group-hover:bg-cyan-500 group-hover:border-cyan-500 group-hover:text-black transition-all">
                            Book Now <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                        </button>

                    </motion.div>
                ))}
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default FindDoctors;