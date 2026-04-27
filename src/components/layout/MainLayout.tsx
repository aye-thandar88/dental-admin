import { Layout } from "antd";
import { useAppStore } from "../../app/store";
import Sidebar from "./Sidebar";
import HeaderBar from "./Header";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const MainLayout = () => {
  const { collapsed } = useAppStore();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content
          style={{
            // margin: '24px 16px',
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