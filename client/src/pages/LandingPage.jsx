import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();
  // Stages: 'typing' -> ' wiping' -> 'thanks' -> redirect
  const [animationStage, setAnimationStage] = useState("typing");

  // --- Configuration ---
  const textLine1 = "Hi, I'm Jayesh.";
  const textLine2 = "Crafting digital experiences with passion.";
  const redirectDelay = 1500; 

  // --- Auth Check & Redirect Logic ---
  useEffect(() => {
    if (animationStage === "finished") {
      const timer = setTimeout(() => {
       
        const isAuthenticated = false; 
        
        if (!isAuthenticated) {
           
            navigate("/auth"); 
        } else {
           
            navigate("/dashboard");
        }
      }, redirectDelay);

      return () => clearTimeout(timer);
    }
  }, [animationStage, navigate]);


  // --- Animation Variants ---

  // 1. Typewriter Container (staggers children)
  const typewriterContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, 
        delayChildren: 0.5,
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
  };

  // 2. Individual Letter Animation
  const letterAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
  };

  // 3. The Wipe/Reveal Effect
  const wipeVariants = {
    initial: { scaleY: 1, originY: 1 },
    animate: { 
        scaleY: 0, 
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } // Custom bezier for smoothness
    }
  };

  // --- Helper to split text into motion characters ---
  const SplitText = ({ text, className }) => (
    <div className={className}>
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={letterAnim} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );


  return (
    <div className="h-screen w-full bg-[#0a0a0a] overflow-hidden relative font-sans flex items-center justify-center text-center px-4">
      
      {/* --- Stylish Background Aesthetics --- */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-slow delay-2000"></div>
         {/* Subtle Grid Overlay */}
         <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] z-0"></div>
      </div>


      <AnimatePresence mode="wait">
        
        {/* === STAGE 1: TYPEWRITER INTRO === */}
        {animationStage === "typing" && (
          <motion.div
            key="typewriter-phase"
            variants={typewriterContainer}
            initial="hidden"
            animate="show"
            exit="exit"
            onAnimationComplete={() => setTimeout(() => setAnimationStage("wiping"), 1000)} // Wait 1s after typing ends
            className="relative z-20"
          >
             <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                <SplitText text={textLine1} className="bg-clip-text text-transparent bg-linear-to-r from-white via-cyan-100 to-white" />
             </h1>
             <h2 className="text-xl md:text-3xl text-gray-400 font-light">
                 <SplitText text={textLine2} />
             </h2>
             {/* Blinking Cursor decoration */}
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}
                className="w-1 h-8 bg-cyan-400 inline-block ml-2 translate-y-1"
             ></motion.div>
          </motion.div>
        )}


        {/* === STAGE 2: THE CURTAIN WIPE === */}
        {animationStage === "wiping" && (
            <motion.div key="wipe-overlay" className="absolute inset-0 z-30 pointer-events-none flex flex-col">
                 {/* Top Curtain */}
                <motion.div 
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={{ scaleY: 1, transition: { duration: 0.6, ease: "easeInOut" }}}
                    exit={{ scaleY: 0, originY: 0, transition: { duration: 0.6, ease: "easeInOut", delay: 0.2 }}}
                    className="h-1/2 bg-linear-to-b from-cyan-500/20 to-[#0a0a0a]"
                />
                {/* Bottom Curtain */}
                <motion.div 
                    initial={{ scaleY: 0, originY: 1 }}
                    animate={{ scaleY: 1, transition: { duration: 0.6, ease: "easeInOut" }}}
                    exit={{ scaleY: 0, originY: 1, transition: { duration: 0.6, ease: "easeInOut", delay: 0.2 }}}
                    onAnimationComplete={() => setAnimationStage("thanks")}
                    className="h-1/2 bg-linear-to-t from-purple-500/20 to-[#0a0a0a]"
                />
            </motion.div>
        )}


        {/* === STAGE 3: THANKS & REDIRECT === */}
        {animationStage === "thanks" && (
          <motion.div
            key="thanks-phase"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            onAnimationComplete={() => setAnimationStage("finished")}
            className="relative z-20 flex flex-col items-center"
          >
            <motion.div
               initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }}
               className="p-4 mb-6 bg-linear-to-tr from-pink-500/20 to-red-500/20 rounded-full"
            >
                <FaHeart className="text-4xl text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Thanks for visiting.
            </h1>
            <p className="text-gray-400 text-lg">Starting the experience...</p>

            {/* Loading spinner for redirect */}
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                className="mt-8 relative"
            >
                 <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default LandingPage;