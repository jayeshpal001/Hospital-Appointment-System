import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import DoctorDetail from "./DoctorDetail";
import PatientDetail from "./PatientDetail"; // Import New Component
import { CustomToaster } from "../../components/ui/Form";


const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Two separate states, or you can use one 'mode' state (e.g., 'auth', 'doctor', 'patient')
  const [isDoctorMode, setIsDoctorMode] = useState(false);
  const [isPatientMode, setIsPatientMode] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleAuth = (status) => {
    setIsSignUp(status);
    setIsDoctorMode(false);
    setIsPatientMode(false); // Reset patient mode
  };

  const handleDoctorSuccess = () => setIsDoctorMode(true);
  const handlePatientSuccess = () => setIsPatientMode(true); // Trigger Patient Mode

  // Helper to check if ANY detail mode is active
  const isDetailMode = isDoctorMode || isPatientMode;

  // Animation Configs (Same as before)
  const smoothTransition = { type: "tween", ease: "easeInOut", duration: 0.6 };
  const overlayVariants = { signUp: { x: "-100%" }, signIn: { x: "0%" } };
  const innerOverlayVariants = { signUp: { x: "50%" }, signIn: { x: "0%" } };
  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.3, duration: 0.4 } }
  };
  const mobileVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden font-sans text-slate-200 p-2 md:p-4">
     
      
      {/* Background (Same as before) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {!isMobile && (
            <>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[100px] animate-aurora will-change-transform"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-cyan-900/40 rounded-full mix-blend-screen filter blur-[100px] animate-aurora animation-delay-2000 will-change-transform"></div>
            </>
        )}
        {isMobile && <div className="absolute inset-0 bg-linear-to-b from-purple-900/20 to-black"></div>}
      </div>

      {/* ================= MOBILE VIEW ================= */}
      {isMobile ? (
        <div className="relative w-full max-w-md min-h-150 flex items-center">
           <div className="w-full bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative min-h-137.5">
              <AnimatePresence mode="wait">
                {!isSignUp && (
                    <motion.div key="login" variants={mobileVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 p-6 flex flex-col justify-center">
                        <Login onToggle={() => toggleAuth(true)} />
                    </motion.div>
                )}

                {isSignUp && !isDetailMode && (
                    <motion.div key="register" variants={mobileVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 p-6 flex flex-col justify-center">
                        <Register 
                            onToggle={() => toggleAuth(false)} 
                            onDoctorSuccess={handleDoctorSuccess} 
                            onPatientSuccess={handlePatientSuccess} // Pass handler
                        />
                    </motion.div>
                )}

                {/* Doctor View */}
                {isSignUp && isDoctorMode && (
                    <motion.div key="doctor" variants={mobileVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 p-6 flex flex-col justify-center">
                        <DoctorDetail onBack={() => setIsDoctorMode(false)} />
                    </motion.div>
                )}

                {/* Patient View */}
                {isSignUp && isPatientMode && (
                    <motion.div key="patient" variants={mobileVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 p-6 flex flex-col justify-center">
                        <PatientDetail onBack={() => setIsPatientMode(false)} />
                    </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      ) : (

      /* ================= DESKTOP VIEW ================= */
      <motion.div 
        layout
        transition={smoothTransition} 
        className={`relative z-10 bg-[#111]/80 backdrop-blur-xl rounded-[30px] border border-white/10 shadow-2xl overflow-hidden hidden lg:block will-change-transform
          ${isDetailMode ? "w-300 h-187.5" : "w-250 h-162.5"} 
        `}
      >
        
        {/* Left Side Container (Register / Doctor / Patient) */}
        <motion.div 
          className="absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center z-10"
          animate={{ x: isSignUp ? "100%" : "0%", opacity: isSignUp ? 1 : 0, pointerEvents: isSignUp ? "auto" : "none" }} 
          transition={smoothTransition}
        >
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              {/* Show Register if NO detail mode is active */}
              {!isDetailMode ? (
                <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex items-center justify-center">
                  <Register 
                    onToggle={() => toggleAuth(false)} 
                    onDoctorSuccess={handleDoctorSuccess} 
                    onPatientSuccess={handlePatientSuccess}
                   />
                </motion.div>
              ) : null}

              {/* Show Doctor Detail */}
              {isDoctorMode && (
                <motion.div key="doctor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex items-center justify-center">
                  <DoctorDetail onBack={() => setIsDoctorMode(false)} />
                </motion.div>
              )}

              {/* Show Patient Detail */}
              {isPatientMode && (
                <motion.div key="patient" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex items-center justify-center">
                  <PatientDetail onBack={() => setIsPatientMode(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Side Container (Login) */}
        <motion.div 
          className="absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center z-20"
          animate={{ x: isSignUp ? "100%" : "0%", opacity: isSignUp ? 0 : 1, pointerEvents: isSignUp ? "none" : "auto" }}
          transition={smoothTransition}
        >
          <Login onToggle={() => toggleAuth(true)} />
        </motion.div>

        {/* Sliding Overlay */}
        <motion.div 
          className="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-50 rounded-[30px]"
          variants={overlayVariants}
          animate={isSignUp ? "signUp" : "signIn"} 
          transition={smoothTransition}
        >
          <motion.div 
            className="bg-linear-to-br from-[#1a1a2e] to-[#16213e] relative -left-full h-full w-[200%] flex items-center justify-center border-l border-white/10"
            variants={innerOverlayVariants}
            animate={isSignUp ? "signUp" : "signIn"}
            transition={smoothTransition}
          >
            {/* Left Overlay Text (Dynamic based on mode) */}
            <motion.div className="w-1/2 h-full flex flex-col items-center justify-center px-12 text-center" animate={isSignUp ? "visible" : "hidden"} variants={contentVariants}>
               
               {/* Show generic text or specific text based on state */}
               {!isDetailMode && (
                   <div>
                        <h1 className="text-4xl font-bold text-white mb-4">Welcome Back!</h1>
                        <p className="text-gray-400 mb-8">To keep connected please login.</p>
                        <button className="px-10 py-3 rounded-full border border-white/30 text-white font-bold hover:bg-white hover:text-black transition-all" onClick={() => toggleAuth(false)}>SIGN IN</button>
                   </div>
               )}

               {isDoctorMode && (
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-4">Doctor Setup</h1>
                        <p className="text-gray-400">Let's build your professional profile.</p>
                    </div>
               )}

               {isPatientMode && (
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-4">Patient Setup</h1>
                        <p className="text-gray-400">Help us understand your health better.</p>
                    </div>
               )}

            </motion.div>

            {/* Right Overlay Text */}
            <motion.div className="w-1/2 h-full flex flex-col items-center justify-center px-12 text-center" animate={!isSignUp ? "visible" : "hidden"} variants={contentVariants}>
              <h1 className="text-4xl font-bold text-white mb-4">Hello, Friend!</h1>
              <p className="text-gray-400 mb-8">Enter your details to start journey.</p>
              <button className="px-10 py-3 rounded-full border border-white/30 text-white font-bold hover:bg-white hover:text-black transition-all" onClick={() => toggleAuth(true)}>SIGN UP</button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      )}
    </div>
  );
};

export default AuthPage;