import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Modal,
  Space,
  Switch,
  Typography,
  type MenuProps,
} from "antd";
import { useAppStore } from "../../app/store";
import {
  ExclamationCircleOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { fontSizes } from "../../app/constant";
import AppBreadcrumb from "../common/AppBreadcrumb";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const { Text } = Typography;

export default function HeaderBar() {
  const { toggleTheme, theme, collapsed, toggleSidebar } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes, Logout",
      cancelText: "Cancel",
      okType: "danger",

      async onOk() {
        try {
          await authService.logout();

          navigate("/login");
        } catch (error: any) {
          // message.error(error.message);
        }
      },
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "2",
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Switch
            checked={theme === "dark"}
            onChange={toggleTheme}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "1",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "3",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Flex
      style={{
        background: "transparent",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 16px",
      }}
    >
      <Flex align="center" gap={16}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => toggleSidebar()}
          style={{
            fontSize: "16px",
          }}
        />
        <AppBreadcrumb />
      </Flex>

      <Flex align="center">
        <Dropdown menu={{ items }} placement="bottomRight">
          <Space align="center" style={{ cursor: "pointer" }}>
            <Text style={{ fontSize: fontSizes.medium, cursor: "pointer" }}>
              <Avatar size={32} icon={<UserOutlined />} />
              Admin
            </Text>
          </Space>
        </Dropdown>
      </Flex>
    </Flex>
  );
}
