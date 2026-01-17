
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  
  return token ? <Outlet /> : <Navigate to="/auth" replace />;
};

export const PublicRoute = () => {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};