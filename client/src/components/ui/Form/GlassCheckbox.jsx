import React from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

export const GlassCheckbox = React.forwardRef(({ label, ...props }, ref) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group mb-4 select-none">
      <div className="relative">
        <input type="checkbox" className="peer sr-only" ref={ref} {...props} />
        <motion.div 
            whileTap={{ scale: 0.9 }}
            className="w-6 h-6 bg-black/40 border border-white/20 rounded-md peer-checked:bg-cyan-500 peer-checked:border-cyan-400 peer-checked:shadow-[0_0_10px_rgba(0,242,254,0.6)] transition-all duration-300"
        ></motion.div>
        <FaCheck className="absolute top-1 left-1 text-black text-xs opacity-0 peer-checked:opacity-100 transition-opacity duration-300" />
      </div>
      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{label}</span>
    </label>
  );
});