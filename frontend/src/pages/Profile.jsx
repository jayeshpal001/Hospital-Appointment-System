import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/users/profile"); // GET /api/users/profile
        setUser(res.data.user);
      } catch (error) {
        console.error(" Auth Error:", error.response?.data?.message);
        navigate("/login"); // Redirect to login if unauthenticated
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-6 mt-10 rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">
        User Profile
      </h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
};

export default Profile;