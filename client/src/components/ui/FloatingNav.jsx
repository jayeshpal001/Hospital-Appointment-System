import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUserMd, FaCalendarCheck, FaUser, FaSignOutAlt, FaThLarge 
} from "react-icons/fa";
import { showToast } from "./Form"; // Verify this path matches your project structure
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ConfirmationModal from "./ConfirmationModal"; // Import the component we created

const FloatingNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const { setIsAuth } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const hiddenRoutes = ["/", "/auth"];
  const isHidden = hiddenRoutes.includes(location.pathname);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, [location]);


  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        // If Modal is open, do not hide the navbar
        if (showLogoutModal) return; 

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          // Scrolling DOWN -> Hide Navbar
          setIsVisible(false);
        } else {
          // Scrolling UP -> Show Navbar
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY, showLogoutModal]); 


  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setIsAuth(false);
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      showToast("success", "Logged out successfully");
      navigate("/");
    } catch (error) {
      showToast("error", "Logout failed");
    } finally {
        setShowLogoutModal(false); 
    }
  };

  if (isHidden) return null;

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
    <>
      <AnimatePresence>
        <motion.div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40" 
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
              y: isVisible ? 0 : 100,
              opacity: isVisible ? 1 : 0 
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="flex items-center gap-2 px-3 py-3 bg-[#161b22]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
            
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} className="relative group">
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
                    <span className={`absolute -bottom-1 w-1 h-1 rounded-full bg-cyan-400 transition-all duration-300 
                      ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-75"}`} 
                    ></span>
                  </div>
                </Link>
              );
            })}

            <div className="w-px h-8 bg-white/10 mx-2"></div>

            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="p-3 rounded-full text-red-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-all duration-300 group relative"
              title="Sign Out"
            >
              <FaSignOutAlt className="text-lg" />
            </button>

          </div>
        </motion.div>
      </AnimatePresence>
      <ConfirmationModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout} // Passes the actual logout function here
        title="Signing Out?"
        message="You are about to end your session. Are you sure you want to leave?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        variant="danger"
        icon={FaSignOutAlt}
      />
    </>
  );
};

export default FloatingNav;