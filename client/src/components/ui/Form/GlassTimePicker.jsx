import React from "react";

export const GlassTimePicker = React.forwardRef(({ label, error, ...props }, ref) => {
    return (
        <div className="w-full mb-2">
             {label && <label className="block text-xs text-gray-400 mb-1 ml-1">{label}</label>}
             <input 
                type="time" 
                ref={ref}
                className={`w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors backdrop-blur-md shadow-inner custom-time-picker
                 ${error ? "border-red-500/50" : ""}`}
                {...props}
             />
             <style>{`
                input[type="time"] { color-scheme: dark; }
                input[type="time"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    cursor: pointer;
                    opacity: 0.6;
                    transition: 0.2s;
                }
                input[type="time"]::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }
             `}</style>
        </div>
    )
});