import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spin } from "antd";

const ProtectedRoute = () => {
  const { isAuthenticated, session, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" description="Loading..." />
      </div>
    );
  }

  return isAuthenticated && session ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
