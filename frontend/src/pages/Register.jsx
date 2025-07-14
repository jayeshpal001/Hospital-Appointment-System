import axiosInstance from "../api/axiosInstance";
import { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/users/register", form);
      setMessage(" Registered successfully!");
    } catch (error) {
  console.error("Registration Error:", error); // log complete error
  console.log("Error Response:", error.response); // important!
  setMessage(" Registration failed: " + error.response?.data?.message || error.message);
}
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {message && <p className="mb-4 text-center text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" className="w-full p-2 border rounded" required />
        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Register</button>
      </form>
    </div>
  );
};

export default Register;