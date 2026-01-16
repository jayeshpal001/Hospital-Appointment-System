import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaChevronDown } from "react-icons/fa";

export const GlassSelect = ({ label, options, icon: Icon, value, onChange, error, placeholder = "Select option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div className="w-full mb-5 relative" ref={dropdownRef}>
      <motion.div
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full cursor-pointer bg-white/5 border-t border-l border-b border-r rounded-xl pl-12 pr-10 py-3.5 text-white focus:outline-none focus:ring-2 transition-colors duration-300 backdrop-blur-xl shadow-[inset_2px_2px_10px_rgba(0,0,0,0.2)] relative
        ${error ? "border-red-500/50" : "border-white/10 border-b-black/10 hover:border-white/30 border-t-white/20"}`}
      >
        {Icon && (
            <div className={`absolute top-4 left-4 z-10 text-gray-400 ${isOpen ? "text-cyan-400" : ""}`}>
                <Icon />
            </div>
        )}
        <span className={value ? "text-white" : "text-gray-500"}>{selectedLabel}</span>
        
        <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="absolute right-4 top-4 text-gray-400"
        >
            <FaChevronDown className={isOpen ? "text-cyan-400" : ""} />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute z-50 w-full mt-2 bg-[#161b22]/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] origin-top"
            >
                {options.map((opt) => (
                <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-5 py-3 cursor-pointer transition-colors duration-200 flex items-center justify-between
                    ${value === opt.value ? "bg-cyan-500/20 text-cyan-300" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                >
                    {opt.label}
                    {value === opt.value && <FaCheck className="text-xs" />}
                </div>
                ))}
            </motion.div>
        )}
      </AnimatePresence>
      
       {error && (
           <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-red-400 text-xs mt-1.5 ml-2 font-medium">
               {error.message}
           </motion.p>
       )}
    </div>
  );
};