// import React, { useState, useEffect, useRef } from "react";
// import toast, { Toaster } from 'react-hot-toast';
// import { motion, AnimatePresence } from "framer-motion"; // Make sure to npm install framer-motion
// import { FaCheck, FaChevronDown, FaExclamationCircle, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

// // --- 1. GLASS INPUT (With Spring Error Animation) ---
// export const GlassInput = React.forwardRef(({ label, icon: Icon, error, type = "text", ...props }, ref) => {
//   return (
//     <div className="w-full mb-5 group relative">
//       {/* Icon with Glow Effect */}
//       {Icon && (
//         <div className={`absolute top-4 left-4 z-10 transition-colors duration-300 ${error ? "text-red-400" : "text-gray-400 group-focus-within:text-cyan-400"}`}>
//           <Icon />
//         </div>
//       )}
      
//       <input
//         ref={ref}
//         type={type}
//         className={`w-full bg-white/5 border-t border-l border-b border-r rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-xl shadow-[inset_2px_2px_10px_rgba(0,0,0,0.2)] 
//           ${error 
//             ? "border-red-500/50 focus:ring-red-500/30" 
//             : "border-white/10 border-b-black/10 focus:ring-cyan-500/40 border-t-white/20"
//           }`}
//         {...props}
//       />
      
//       {/* Animated Error Icon & Message */}
//       <AnimatePresence mode="wait">
//         {error && (
//           <motion.div 
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: 10 }}
//             transition={{ type: "spring", stiffness: 300, damping: 20 }}
//             className="absolute right-4 top-4 flex items-center pointer-events-none"
//           >
//              <FaExclamationCircle className="text-red-400" />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {error && (
//           <motion.p 
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="text-red-400 text-xs mt-1.5 ml-2 font-medium tracking-wide overflow-hidden"
//           >
//             {error.message}
//           </motion.p>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// });

// // --- 2. GLASS SELECT (Framer Motion Dropdown) ---
// export const GlassSelect = ({ label, options, icon: Icon, value, onChange, error, placeholder = "Select option" }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSelect = (optionValue) => {
//     onChange(optionValue);
//     setIsOpen(false);
//   };

//   const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

//   return (
//     <div className="w-full mb-5 relative" ref={dropdownRef}>
//       <motion.div
//         whileTap={{ scale: 0.99 }}
//         onClick={() => setIsOpen(!isOpen)}
//         className={`w-full cursor-pointer bg-white/5 border-t border-l border-b border-r rounded-xl pl-12 pr-10 py-3.5 text-white focus:outline-none focus:ring-2 transition-colors duration-300 backdrop-blur-xl shadow-[inset_2px_2px_10px_rgba(0,0,0,0.2)] relative
//         ${error ? "border-red-500/50" : "border-white/10 border-b-black/10 hover:border-white/30 border-t-white/20"}`}
//       >
//         {Icon && (
//             <div className={`absolute top-4 left-4 z-10 text-gray-400 ${isOpen ? "text-cyan-400" : ""}`}>
//                 <Icon />
//             </div>
//         )}
//         <span className={value ? "text-white" : "text-gray-500"}>{selectedLabel}</span>
        
//         <motion.div 
//             animate={{ rotate: isOpen ? 180 : 0 }}
//             className="absolute right-4 top-4 text-gray-400"
//         >
//             <FaChevronDown className={isOpen ? "text-cyan-400" : ""} />
//         </motion.div>
//       </motion.div>

//       {/* Dropdown Menu with Spring Animation */}
//       <AnimatePresence>
//         {isOpen && (
//             <motion.div 
//                 initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scaleY: 1 }}
//                 exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 25 }}
//                 className="absolute z-50 w-full mt-2 bg-[#161b22]/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] origin-top"
//             >
//                 {options.map((opt) => (
//                 <div
//                     key={opt.value}
//                     onClick={() => handleSelect(opt.value)}
//                     className={`px-5 py-3 cursor-pointer transition-colors duration-200 flex items-center justify-between
//                     ${value === opt.value ? "bg-cyan-500/20 text-cyan-300" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
//                 >
//                     {opt.label}
//                     {value === opt.value && <FaCheck className="text-xs" />}
//                 </div>
//                 ))}
//             </motion.div>
//         )}
//       </AnimatePresence>
      
//        {error && (
//            <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-red-400 text-xs mt-1.5 ml-2 font-medium">
//                {error.message}
//            </motion.p>
//        )}
//     </div>
//   );
// };

// // --- 3. GLASS CHECKBOX (Interactive) ---
// export const GlassCheckbox = React.forwardRef(({ label, ...props }, ref) => {
//   return (
//     <label className="flex items-center gap-3 cursor-pointer group mb-4 select-none">
//       <div className="relative">
//         <input type="checkbox" className="peer sr-only" ref={ref} {...props} />
//         <motion.div 
//             whileTap={{ scale: 0.9 }}
//             className="w-6 h-6 bg-black/40 border border-white/20 rounded-md peer-checked:bg-cyan-500 peer-checked:border-cyan-400 peer-checked:shadow-[0_0_10px_rgba(0,242,254,0.6)] transition-all duration-300"
//         ></motion.div>
//         <FaCheck className="absolute top-1 left-1 text-black text-xs opacity-0 peer-checked:opacity-100 transition-opacity duration-300" />
//       </div>
//       <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{label}</span>
//     </label>
//   );
// });

// // --- 4. GLASS TIME PICKER ---
// export const GlassTimePicker = React.forwardRef(({ label, error, ...props }, ref) => {
//     return (
//         <div className="w-full mb-2">
//              {label && <label className="block text-xs text-gray-400 mb-1 ml-1">{label}</label>}
//              <input 
//                 type="time" 
//                 ref={ref}
//                 className={`w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors backdrop-blur-md shadow-inner custom-time-picker
//                  ${error ? "border-red-500/50" : ""}`}
//                 {...props}
//              />
//              <style>{`
//                 input[type="time"] { color-scheme: dark; }
//                 input[type="time"]::-webkit-calendar-picker-indicator {
//                     filter: invert(1);
//                     cursor: pointer;
//                     opacity: 0.6;
//                     transition: 0.2s;
//                 }
//                 input[type="time"]::-webkit-calendar-picker-indicator:hover {
//                     opacity: 1;
//                 }
//              `}</style>
//         </div>
//     )
// });

// // --- 5. GRADIENT BUTTON (Motion Enhanced) ---
// export const GradientButton = ({ children, loading, type = "submit", onClick, variant = "cyan" }) => {
//     const colors = variant === "cyan" 
//         ? "from-cyan-500 to-blue-700 shadow-cyan-500/30" 
//         : "from-pink-500 to-orange-600 shadow-pink-500/30";

//     return (
//         <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             type={type}
//             onClick={onClick}
//             disabled={loading}
//             className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${colors} text-white font-bold shadow-lg transition-all duration-300 tracking-wider uppercase border-t border-white/20 relative overflow-hidden`}
//         >
//             {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                     Processing...
//                 </div>
//             ) : children}
//         </motion.button>
//     );
// };

// // --- 6. CUSTOM TOASTER CONFIGURATION ---
// export const CustomToaster = () => {
//   return (
//     <Toaster
//       position="top-center"
//       reverseOrder={false}
//       gutter={8}
//       toastOptions={{
//         duration: 4000,
//         style: {
//           background: 'transparent',
//           boxShadow: 'none',
//         },
//       }}
//     />
//   );
// };

// // --- 7. THE PREMIUM TOAST FUNCTION (Motion Driven) ---
// export const showToast = (type, message) => {
//   toast.custom((t) => (
//     <motion.div
//       initial={{ opacity: 0, y: -20, scale: 0.9 }}
//       animate={{ opacity: t.visible ? 1 : 0, y: t.visible ? 0 : -20, scale: t.visible ? 1 : 0.9 }}
//       transition={{ type: "spring", stiffness: 400, damping: 25 }}
//       className="max-w-md w-full bg-[#161b22]/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden"
//     >
//       {/* Colored Left Bar based on Type */}
//       <div className={`w-2 ${
//         type === 'success' ? 'bg-gradient-to-b from-cyan-400 to-blue-600 shadow-[0_0_10px_rgba(0,242,254,0.5)]' : 
//         type === 'error' ? 'bg-gradient-to-b from-red-500 to-pink-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
//         'bg-gradient-to-b from-purple-500 to-indigo-600'
//       }`}></div>

//       <div className="flex-1 w-0 p-4">
//         <div className="flex items-start">
//           <div className="shrink-0 pt-0.5">
//             {type === 'success' && <FaCheckCircle className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_5px_rgba(0,242,254,0.8)]" />}
//             {type === 'error' && <FaTimesCircle className="h-6 w-6 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />}
//             {type === 'info' && <FaInfoCircle className="h-6 w-6 text-purple-400" />}
//           </div>
//           <div className="ml-4 flex-1">
//             <p className="text-sm font-bold text-white tracking-wide">
//               {type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification'}
//             </p>
//             <p className="mt-1 text-sm text-gray-400 leading-relaxed">
//               {message}
//             </p>
//           </div>
//         </div>
//       </div>
      
//       {/* Close Button */}
//       <div className="flex border-l border-white/10">
//         <button
//           onClick={() => toast.dismiss(t.id)}
//           className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-white focus:outline-none"
//         >
//           Close
//         </button>
//       </div>
//     </motion.div>
//   ));
// };