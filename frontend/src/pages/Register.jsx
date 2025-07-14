import { useState } from "react";
import axios from "../api/axiosInstance"; // custom axios with baseURL
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient", // default role
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(""); // Clear old errors

      const response = await axios.post("/users/register", formData, {
        withCredentials: true, // include cookies
      });

      console.log(" Registered:", response.data);

      //  Save user to localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));

      //  Refresh the app to trigger navbar update
      window.location.reload();

      //  Redirect to appointments page
      navigate("/appointments");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Register
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
