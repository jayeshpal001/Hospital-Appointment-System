import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Apna Live Backend URL dalo
  withCredentials: true, // Cookies ke liye (Backup)
});

// Request Interceptor: Har request ke sath Token jod dega
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; //  Header set ho raha hai
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
