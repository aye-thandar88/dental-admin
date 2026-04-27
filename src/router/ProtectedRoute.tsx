import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
//   const isAuthenticated = !!localStorage.getItem("token"); // or context

  return true ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;