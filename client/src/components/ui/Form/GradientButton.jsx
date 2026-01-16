import React from "react";
import { motion } from "framer-motion";

export const GradientButton = ({ children, loading, type = "submit", onClick, variant = "cyan" }) => {
    let colors;
    if (variant === "cyan") colors = "from-cyan-500 to-blue-700 shadow-cyan-500/30";
    else if (variant === "pink") colors = "from-pink-500 to-orange-600 shadow-pink-500/30";
    else if (variant === "green") colors = "from-green-500 to-teal-700 shadow-green-500/30"; 
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`w-full py-3.5 rounded-xl bg-linear-to-r ${colors} text-white font-bold shadow-lg transition-all duration-300 tracking-wider uppercase border-t border-white/20 relative overflow-hidden`}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                </div>
            ) : children}
        </motion.button>
    );
};