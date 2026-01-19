// import { Navigate, Outlet } from "react-router-dom";

// const isValidToken = (token) => {
//   return token && token !== "undefined" && token !== "null";
// };

// export const ProtectedRoute = () => {
//   const token = localStorage.getItem("token");

//   console.log("token:", token);
//   console.log("type:", typeof token);
//   console.log("boolean:", Boolean(token));
//   console.log("isValid:", isValidToken(token));

//   return isValidToken(token)
//     ? <Outlet />
//     : <Navigate to="/auth" replace />;
// };

// export const PublicRoute = () => {
//   const token = localStorage.getItem("token");

//   return isValidToken(token)
//     ? <Navigate to="/dashboard" replace />
//     : <Outlet />;
// };
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = () => {
  const { isAuth, loading } = useAuth();

  if (loading) return <div>Checking authentication...</div>;

  return isAuth
    ? <Outlet />
    : <Navigate to="/auth" replace />;
};

export const PublicRoute = () => {
  const { isAuth, loading } = useAuth();

  if (loading) return null;

  return isAuth
    ? <Navigate to="/dashboard" replace />
    : <Outlet />;
};
