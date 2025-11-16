import React from "react";
import { Link } from "react-router-dom";

export  function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 gap-10">
        <div className="flex flex-col gap-6 max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Smart & Easy <span className="text-blue-600">Hospital Appointment</span> Booking
          </h2>
          <p className="text-lg text-gray-600">
            Our Hospital Appointment System helps patients instantly book doctors, manage appointments, save medical records, and get real-time updates — all in one place.
          </p>
          <div className="flex gap-4 mt-4">
            <Link to="/login">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700">
              Book Appointment
             </button>
            </Link>
            <Link>
            
            </Link>
           
            <button className="px-6 py-3 bg-white border border-blue-600 text-blue-600 font-semibold rounded-xl shadow hover:bg-blue-50">
              Learn More
            </button>
          </div>
        </div>

        <img
          src="/assets/DoctorHero.png"
          alt="Doctor illustration"
          className="w-full md:w-[450px] drop-shadow-2xl"
        />
      </section>

      {/* FEATURES SECTION */}
      <section className="px-10 md:px-20 py-16 bg-white">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-10">Why Choose Our System?</h3>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-gray-100 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">Instant Booking</h4>
            <p className="text-gray-600">Book appointments with your preferred doctor in seconds with real-time availability.</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">Manage Records</h4>
            <p className="text-gray-600">Store and access medical history, prescriptions, and visits anytime.</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">Doctor Profiles</h4>
            <p className="text-gray-600">View doctor specializations, experience, timings, and book accordingly.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-10 md:px-20 py-16">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-10">How It Works?</h3>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-6 rounded-xl border border-blue-200 bg-blue-50">
            <h4 className="text-xl font-semibold mb-2">1. Register / Login</h4>
            <p className="text-gray-600">Secure login with JWT, encrypted data, and profile management.</p>
          </div>

          <div className="p-6 rounded-xl border border-blue-200 bg-blue-50">
            <h4 className="text-xl font-semibold mb-2">2. Choose Your Doctor</h4>
            <p className="text-gray-600">Browse doctors by specialization, availability, and ratings.</p>
          </div>

          <div className="p-6 rounded-xl border border-blue-200 bg-blue-50">
            <h4 className="text-xl font-semibold mb-2">3. Book Appointment</h4>
            <p className="text-gray-600">Select your date & time and get instant confirmation.</p>
          </div>
        </div>
      </section>

      {/* ABOUT THE APP */}
      <section className="px-10 md:px-20 py-16 bg-white">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-10">About Our Application</h3>
        <p className="max-w-3xl mx-auto text-lg text-gray-600 text-center leading-relaxed">
          This hospital appointment system is built using the MERN Stack (MongoDB, Express, React, Node.js). 
          The system ensures high performance, secure authentication using JWT, smooth UI with Tailwind CSS,
          and real-time doctor availability. Patients can book, cancel, and manage appointments easily.
          Doctors can manage schedules, view patient details, and update availability.
        </p>
      </section>

      {/* CTA SECTION */}
      <section className="px-10 md:px-20 py-16 text-center bg-blue-600 text-white">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">Start Your Health Journey Today</h3>
        <p className="text-lg max-w-2xl mx-auto mb-8 opacity-90">
          Join thousands of users booking appointments with ease. Fast, simple, and reliable healthcare service.
        </p>
        <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow hover:bg-gray-100">
          Get Started
        </button>
      </section>
    </div>
  );
}