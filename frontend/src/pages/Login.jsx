import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/users/login", form); // 🔐 Cookie set automatically
      setMessage("Login successful!");
      console.log("User Data:", res.data); // optional
    } catch (error) {
      setMessage("Login failed: " + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {message && <p className="mb-4 text-center text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" className="w-full p-2 border rounded" required />
        <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Login</button>
      </form>
    </div>
  );
};

export default Login;