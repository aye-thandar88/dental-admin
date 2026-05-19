import { Layout } from "antd";
import Sidebar from "./Sidebar";
import HeaderBar from "./Header";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const MainLayout = () => {

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content
          style={{
            padding: 24,
            minHeight: 280,
            borderRadius: 12,
          }}
        >
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;