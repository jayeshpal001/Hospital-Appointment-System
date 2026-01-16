import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationCircle } from "react-icons/fa";

export const GlassInput = React.forwardRef(({ label, icon: Icon, error, type = "text", ...props }, ref) => {
  return (
    <div className="w-full mb-5 group relative">
      {/* Icon */}
      {Icon && (
        <div className={`absolute top-4 left-4 z-10 transition-colors duration-300 ${error ? "text-red-400" : "text-gray-400 group-focus-within:text-cyan-400"}`}>
          <Icon />
        </div>
      )}
      
      <input
        ref={ref}
        type={type}
        className={`w-full bg-white/5 border-t border-l border-b border-r rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-xl shadow-[inset_2px_2px_10px_rgba(0,0,0,0.2)] 
          ${error 
            ? "border-red-500/50 focus:ring-red-500/30" 
            : "border-white/10 border-b-black/10 focus:ring-cyan-500/40 border-t-white/20"
          }`}
        {...props}
      />
      
      {/* Animated Error Icon */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute right-4 top-4 flex items-center pointer-events-none"
          >
             <FaExclamationCircle className="text-red-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-red-400 text-xs mt-1.5 ml-2 font-medium tracking-wide overflow-hidden"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});