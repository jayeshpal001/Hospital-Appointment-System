import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaFilter, FaCheck } from "react-icons/fa";

const options = [
  { label: "All Status", value: "all", color: "text-white", bg: "bg-white/10" },
  { label: "Pending", value: "pending", color: "text-yellow-400", bg: "bg-yellow-500/20" },
  { label: "Approved", value: "approved", color: "text-green-400", bg: "bg-green-500/20" },
  { label: "Cancelled", value: "cancelled", color: "text-red-400", bg: "bg-red-500/20" },
//   { label: "Completed", value: "completed", color: "text-blue-400", bg: "bg-blue-500/20" },
];

const GlassDropdown = ({ currentFilter, setFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === currentFilter);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* --- TRIGGER BUTTON --- */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
            relative flex items-center gap-3 px-5 py-3 rounded-2xl 
            bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/10 
            shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-cyan-500/30 hover:bg-white/5 
            transition-all duration-300 min-w-45 justify-between
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-full ${selectedOption.bg}`}>
            <FaFilter className={`text-xs ${selectedOption.color}`} />
          </div>
          <span className="text-gray-200 font-medium text-sm">
            {selectedOption.label}
          </span>
        </div>

        {/* Animated Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <FaChevronDown className="text-xs text-gray-500" />
        </motion.div>
      </motion.button>

      {/* --- DROPDOWN MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute right-0 w-56 p-2 rounded-2xl bg-[#0f0f1a]/95 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50"
          >
            <div className="flex flex-col gap-1">
              {options.map((opt) => {
                const isActive = currentFilter === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    onClick={() => {
                      setFilter(opt.value);
                      setIsOpen(false);
                    }}
                    className={`
                        relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {/* Color Dot */}
                      <span className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${opt.color.replace('text-', 'bg-').replace('400', '500')} shadow-current`}></span>
                      {opt.label}
                    </div>

                    {/* Checkmark for Active */}
                    {isActive && (
                      <motion.div
                        layoutId="active-check"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <FaCheck className="text-cyan-400 text-xs" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlassDropdown;