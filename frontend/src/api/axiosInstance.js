import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // your backend base URL
  withCredentials: true, //  send & receive cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;