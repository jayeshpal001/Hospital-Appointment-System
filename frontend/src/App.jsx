import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import DoctorAppointments from "./pages/DoctorAppointments";
import { Patients } from "./pages/Patients";
import { Doctors } from "./pages/Doctors";
const App = () => {
  return (
 <>
 <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<h2 className="text-center mt-10 text-xl">Welcome to Hospital Appointment App</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route  path="/profile" element={<Profile/>}/>
          <Route path="/appointment/book" element={<BookAppointment/>} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/patients" element={<Patients/>} />
          <Route path="/doctors" element={<Doctors/>} />

          
        </Routes>
        
      </div>
 </>
    
  );
};

export default App;