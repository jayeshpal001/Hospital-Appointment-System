import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaSignOutAlt, FaInfoCircle } from "react-icons/fa";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // 'danger' (Red) | 'primary' (Blue)
  icon: Icon // Optional custom icon
}) => {
  
  // Dynamic Styles based on Variant
  const isDanger = variant === "danger";
  
  const gradientClass = isDanger 
    ? "from-red-600 to-pink-600 shadow-red-600/30" 
    : "from-cyan-500 to-blue-600 shadow-cyan-500/30";

  const glowClass = isDanger
    ? "from-transparent via-red-500 to-transparent"
    : "from-transparent via-cyan-500 to-transparent";

  const iconBgClass = isDanger 
    ? "bg-red-500/10 border-red-500/20 text-red-400" 
    : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";

  // Default Icon logic
  const DisplayIcon = Icon || (isDanger ? FaSignOutAlt : FaInfoCircle);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9998 flex items-center justify-center"
          />

          {/* 2. Modal Card */}
          <div className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="pointer-events-auto w-[90%] max-w-sm bg-[#1a1a2e] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative Glow Strip */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-linear-to-r blur-xs ${glowClass}`}></div>

              <div className="flex flex-col items-center text-center">
                
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border shadow-[0_0_15px_rgba(0,0,0,0.2)] ${iconBgClass}`}>
                  <DisplayIcon className="text-2xl" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  {message}
                </p>

                <div className="flex gap-3 w-full">
                  {/* Cancel Button */}
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 transition-all duration-200"
                  >
                    {cancelText}
                  </button>

                  {/* Confirm Button */}
                  <button
                    onClick={onConfirm}
                    className={`flex-1 py-3 rounded-xl bg-linear-to-r text-white font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-white/10 ${gradientClass}`}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;