import { Layout, Menu, Image } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../app/store";
import Logo from "../../assets/images/logo.jpg";
import ToothLogo from "../../assets/images/toothLogo.jpg";

const { Sider } = Layout;

export default function Sidebar() {
  const navigate = useNavigate();
  const { collapsed } = useAppStore();

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
      <div
        style={{ flex: "column", textAlign: "center", padding: "0 0 16px 0" }}
      >
        {collapsed ? (
          <Image
            src={ToothLogo}
            alt="Tooth Logo"
            width={"100%"}
            height={70}
            preview={false}
          />
        ) : (
          <Image
            src={Logo}
            alt="Logo"
            width={"100%"}
            height={100}
            preview={false}
          />
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        onClick={(e) => navigate(e.key)}
        items={[
          { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
          {
            key: "/appointment",
            icon: <CalendarOutlined />,
            label: "Appointment",
          },
          {
            key: "/medical-record",
            icon: <MedicineBoxOutlined />,
            label: "Medical Record",
          },
          { key: "/billing", icon: <SettingOutlined />, label: "Billing" },
          { key: "/doctor", icon: <MedicineBoxOutlined />, label: "Doctor" },
          { key: "/patient", icon: <UsergroupAddOutlined />, label: "Patient" },
        ]}
      />
    </Sider>
  );
}
