import React from "react";
import toast, { Toaster } from 'react-hot-toast';
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

// --- 1. THE TOASTER COMPONENT (Import in App.jsx) ---
export const CustomToaster = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: { background: 'transparent', boxShadow: 'none' },
      }}
    />
  );
};

// --- 2. THE TRIGGER FUNCTION (Import where needed) ---
export const showToast = (type, message) => {
  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: t.visible ? 1 : 0, y: t.visible ? 0 : -20, scale: t.visible ? 1 : 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="max-w-md w-full bg-[#161b22]/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden"
    >
      {/* Side Color Bar */}
      <div className={`w-2 ${
        type === 'success' ? 'bg-linear-to-b from-cyan-400 to-blue-600' : 
        type === 'error' ? 'bg-linear-to-b from-red-500 to-pink-600' : 
        'bg-linear-to-b from-purple-500 to-indigo-600'
      }`}></div>

      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="shrink-0 pt-0.5">
            {type === 'success' && <FaCheckCircle className="h-6 w-6 text-cyan-400" />}
            {type === 'error' && <FaTimesCircle className="h-6 w-6 text-red-500" />}
            {type === 'info' && <FaInfoCircle className="h-6 w-6 text-purple-400" />}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-bold text-white">
              {type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification'}
            </p>
            <p className="mt-1 text-sm text-gray-400">{message}</p>
          </div>
        </div>
      </div>
      
      {/* Close Button Logic ✅ */}
      <div className="flex border-l border-white/10">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  ));
};