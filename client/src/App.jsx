import React from 'react'
import { Route, Routes } from 'react-router-dom'

import FloatingNav from './components/ui/FloatingNav'
import { ProtectedRoute, PublicRoute } from './components/AuthGuard'
// Pages
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/Forms/Auth'
import Dashboard from './pages/Dashboard'
import FindDoctors from './pages/FindDoctors'
import BookingPage from './pages/BookingPage'
import DoctorProfile from './pages/DoctorProfile'
import PatientProfile from './pages/PatientProfile'
import DoctorDetail from './pages/Forms/DoctorDetail'

const App = () => {
  return (
    <div>
  
       <FloatingNav />  
      <Routes>
        
        <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path='/auth' element={<AuthPage/>} />
        </Route>

        <Route element={<ProtectedRoute />}>
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path='/findDoctors' element={<FindDoctors/>} />
            <Route path="/book/:id" element={<BookingPage />} />
            
            <Route path='/doctorProfile' element={<DoctorProfile/>} />
            <Route path='/patientProfile' element={<PatientProfile/>} />
            
            <Route path='/doctor-detail' element={<DoctorDetail/>} />
        </Route>

      </Routes>
    </div>
  )
}

export default App