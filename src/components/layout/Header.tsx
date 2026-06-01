import {
  Avatar,
  Badge,
  Button,
  Descriptions,
  Dropdown,
  Flex,
  Form,
  Modal,
  Switch,
  Typography,
  type MenuProps,
} from "antd";
import { useAppStore } from "../../app/store";
import {
  BellOutlined,
  ExclamationCircleOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AppBreadcrumb from "../common/AppBreadcrumb";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";

const { Text } = Typography;

export default function HeaderBar() {
  const { toggleTheme, theme, collapsed, toggleSidebar } = useAppStore();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { profile } = useAuthStore();

  const [open, setOpen] = useState(false);

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

  const userMenuItems: MenuProps["items"] = [
    {
      key: "header",
      label: (
        <div
          style={{
            padding: "8px 4px 12px",
            borderBottom: "1px solid #f0f0f0",
            marginBottom: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar
              size={40}
              icon={<UserOutlined />}
              style={{
                background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>
                {profile?.name}
              </div>
              <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                {profile?.roles}
              </div>
            </div>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      key: "theme",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
            padding: "2px 0",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isDark ? <MoonOutlined /> : <SunOutlined />}
            {isDark ? "Dark Mode" : "Light Mode"}
          </span>
          <Switch size="small" checked={isDark} onChange={toggleTheme} />
        </div>
      ),
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "My Profile",
      onClick: () => setOpen(true),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: "#ff4d4f" }} />,
      label: <span style={{ color: "#ff4d4f" }}>Sign Out</span>,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .header-bar {
          font-family: 'Roboto', sans-serif;
          background: ${
            isDark ? "rgba(20, 20, 30, 0.85)" : "rgba(255,255,255,0.82)"
          };
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"};
          box-shadow: 0 1px 0 0 ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"},
                      0 4px 24px -8px ${isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)"};
          transition: background 0.3s ease, border-color 0.3s ease;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-icon-btn {
          width: 36px !important;
          height: 36px !important;
          border-radius: 10px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: 1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} !important;
          background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"} !important;
          color: ${isDark ? "rgba(255,255,255,0.75)" : "#595959"} !important;
          transition: all 0.18s ease !important;
        }
        .header-icon-btn:hover {
          background: ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"} !important;
          border-color: ${isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.14)"} !important;
          color: ${isDark ? "#fff" : "#1677ff"} !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 10px 5px 5px;
          border-radius: 40px;
          cursor: pointer;
          border: 1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
          background: ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"};
          transition: all 0.18s ease;
        }
        .user-pill:hover {
          background: ${isDark ? "rgba(255,255,255,0.09)" : "rgba(22,119,255,0.06)"};
          border-color: ${isDark ? "rgba(255,255,255,0.16)" : "rgba(22,119,255,0.25)"};
          box-shadow: 0 2px 12px rgba(22,119,255,0.1);
        }

        .user-pill-name {
          font-size: 13px;
          font-weight: 600;
          color: ${isDark ? "rgba(255,255,255,0.88)" : "#262626"};
          line-height: 1;
          letter-spacing: -0.01em;
        }
        .user-pill-role {
          font-size: 11px;
          color: ${isDark ? "rgba(255,255,255,0.4)" : "#8c8c8c"};
          line-height: 1;
          margin-top: 2px;
        }
      `}</style>

      <div className="header-bar">
        <Flex
          align="center"
          justify="space-between"
          style={{ padding: "10px 20px" }}
        >
          {/* Left: Toggle + Breadcrumb */}
          <Flex align="center" gap={12}>
            <Button
              className="header-icon-btn"
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ fontSize: 15 }} />
                ) : (
                  <MenuFoldOutlined style={{ fontSize: 15 }} />
                )
              }
              onClick={toggleSidebar}
            />
            <AppBreadcrumb />
          </Flex>

          {/* Right: Actions + User */}
          <Flex align="center" gap={8}>
            {/* Notification Bell */}
            <Badge count={3} size="small" offset={[-2, 2]}>
              <Button
                className="header-icon-btn"
                type="text"
                icon={<BellOutlined style={{ fontSize: 15 }} />}
              />
            </Badge>

            {/* Divider */}
            <div
              style={{
                width: 1,
                height: 24,
                background: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
                margin: "0 4px",
              }}
            />

            {/* User Dropdown */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
              styles={{ root: { minWidth: 220 } }}
            >
              <div className="user-pill">
                <Avatar
                  size={28}
                  icon={<UserOutlined />}
                  style={{
                    background:
                      "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div className="user-pill-name">{profile?.name ?? ""}</div>
                  <div className="user-pill-role">
                    {profile?.roles?.[0] ?? ""}
                  </div>
                </div>
              </div>
            </Dropdown>
          </Flex>
        </Flex>

        <Modal
          title="My Profile"
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
          width={500}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Avatar
              size={90}
              src={profile?.profile_photo}
              style={{ marginBottom: 12 }}
            >
              {profile?.name?.charAt(0)}
            </Avatar>

            <Typography.Title level={4} style={{ margin: 0 }}>
              {profile?.name || "No Name"}
            </Typography.Title>

            <Typography.Text type="secondary">
              {profile?.roles?.[0] || "User"}
            </Typography.Text>
          </div>

          <Descriptions
            bordered
            column={1}
            size="middle"
            labelStyle={{ width: 150, fontWeight: 600 }}
          >
            <Descriptions.Item label="Full Name">
              {profile?.name || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Phone">
              {profile?.phone || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Gender">
              {profile?.gender || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Date of Birth">
              {profile?.date_of_birth || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Address">
              {profile?.address || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Role">
              {profile?.roles?.[0] || "-"}
            </Descriptions.Item>
          </Descriptions>

          <Button
            type="primary"
            block
            style={{ marginTop: 20 }}
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </Modal>
      </div>
    </>
  );
}
