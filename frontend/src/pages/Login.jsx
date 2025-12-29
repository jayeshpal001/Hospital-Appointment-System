import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await axios.post("/users/login", formData, {
        withCredentials: true,
      });

<<<<<<< HEAD
      console.log(" Login success", res.data);
      

      //  Save user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));

      if(res.data.user.role!=="doctor") navigate("/appointments");
      else navigate("/doctor/appointments")
      
      //  Refresh the app to re-render Navbar
      window.location.reload();

      //  Redirect after login
     
=======
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));

      if (res.data.user.role !== "doctor") navigate("/appointments");
      else navigate("/doctor/appointments");

      window.location.reload();
>>>>>>> 1447434633a0b35c79863834a7e5329f354f67bc
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-200">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-3">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Login to continue to your dashboard</p>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded-md text-center mb-3 border border-red-200">
            {error}
          </p>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-gray-600 text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
          >
            Login
          </button>

          {/* Register Redirect */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}