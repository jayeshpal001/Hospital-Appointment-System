import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // your backend base URL
  withCredentials: true, // 🔐 send & receive cookies
});

export default axiosInstance;