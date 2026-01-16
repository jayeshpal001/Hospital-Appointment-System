import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaHome, FaUserMd, FaCalendarCheck, FaUser, FaSignOutAlt, FaThLarge 
} from "react-icons/fa";
import axios from "axios";
import { showToast } from "./Form";


const FloatingNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  // Hide Navbar on specific pages (Auth & Landing)
  const hiddenRoutes = ["/", "/auth"];
  const isHidden = hiddenRoutes.includes(location.pathname);

  useEffect(() => {
    // Check role from local storage to decide links
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, [location]); // Re-run when location changes (in case of login/logout)

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      localStorage.removeItem("role");
      showToast("success", "Logged out successfully");
      navigate("/");
    } catch (error) {
      showToast("error", "Logout failed");
    }
  };

  if (isHidden) return null;

  // --- DEFINE LINKS BASED ON ROLE ---
  const patientLinks = [
    { path: "/findDoctors", icon: FaUserMd, label: "Find Doc" },
    { path: "/dashboard", icon: FaCalendarCheck, label: "Appointments" },
    { path: "/patientProfile", icon: FaUser, label: "Profile" },
  ];

  const doctorLinks = [
    { path: "/dashboard", icon: FaThLarge, label: "Dashboard" },
    { path: "/doctorProfile", icon: FaUserMd, label: "Profile" },
  ];

  const links = role === "doctor" ? doctorLinks : patientLinks;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center gap-2 px-3 py-3 bg-[#161b22]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
      >
        
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link key={link.path} to={link.path} className="relative group">
              {/* Active Background Pill Animation */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-linear-to-r from-cyan-500/20 to-blue-600/20 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className={`relative px-5 py-3 rounded-full flex flex-col items-center justify-center transition-all duration-300
                ${isActive ? "text-cyan-400" : "text-gray-400 hover:text-white hover:bg-white/5"}
              `}>
                <link.icon className="text-xl mb-0.5" />
                {/* Optional: Label shows only on active or hover if you want, usually icons are enough for sleek look */}
                {/* <span className="text-[10px] font-medium">{link.label}</span> */}
                
                {/* Hover Glow Dot */}
                <span className={`absolute -bottom-1 w-1 h-1 rounded-full bg-cyan-400 transition-all duration-300 
                    ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-75"}`} 
                ></span>
              </div>
            </Link>
          );
        })}

        {/* Divider */}
        <div className="w-px h-8 bg-white/10 mx-2"></div>

        {/* Logout Button */}
        <button 
            onClick={handleLogout}
            className="p-3 rounded-full text-red-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-all duration-300 group relative"
            title="Logout"
        >
            <FaSignOutAlt className="text-lg" />
        </button>

      </motion.div>
    </div>
  );
};

export default FloatingNav;