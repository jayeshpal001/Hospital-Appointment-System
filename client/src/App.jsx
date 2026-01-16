
import { Route, Routes } from 'react-router-dom'
import DoctorDetail from './pages/Forms/DoctorDetail'
import AuthPage from './pages/Forms/Auth'
import DoctorProfile from './pages/DoctorProfile'
import PatientProfile from './pages/PatientProfile'
import FindDoctors from './pages/FindDoctors'
import BookingPage from './pages/BookingPage'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import FloatingNav from './components/ui/FloatingNav'

const App = () => {
  return (
    <div>
       <FloatingNav />
      <Routes>
       
         <Route path='/doctorProfile' element={<DoctorProfile/>} />
         <Route path='/patientProfile' element={<PatientProfile/>} />
        <Route path='/doctor-detail' element={<DoctorDetail/>} />
        <Route path='/findDoctors' element={<FindDoctors/>} />
        <Route path="/book/:id" element={<BookingPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path='/auth' element={<AuthPage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
    </div>
  )
}

export default App