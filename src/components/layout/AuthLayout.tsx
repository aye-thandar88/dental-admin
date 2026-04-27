import { Layout } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Outlet />
    </Layout>
  );
};

export default AuthLayout;
