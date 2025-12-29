import axios from "axios";

const axiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: "http://localhost:5000/api", // your backend base URL
  withCredentials: true, // send & receive cookies
=======
  baseURL: import.meta.env.VITE_BASE_URL+"/api", // your backend base URL
  withCredentials: true, //  send & receive cookies
  headers: {
    "Content-Type": "application/json",
  },
>>>>>>> 1447434633a0b35c79863834a7e5329f354f67bc
});

export default axiosInstance;