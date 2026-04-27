import {
  Row,
  Col,
  Card,
  Typography,
  Statistic,
  List,
  Tag,
  Button,
  Space,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  WarningOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { colors } from "../../app/constant";

const { Title, Text } = Typography;

export default function Dashboard() {
  const alerts = [
    {
      type: "warning",
      message: "5 appointments pending confirmation",
    },
    {
      type: "error",
      message: "2 patients missed their appointments today",
    },
    {
      type: "info",
      message: "Next appointment in 30 minutes",
    },
  ];

  const todayAppointments = [
    { time: "10:00 AM", patient: "John Doe", status: "Confirmed" },
    { time: "11:00 AM", patient: "Jane Smith", status: "Pending" },
    { time: "01:00 PM", patient: "Michael Tan", status: "Completed" },
  ];

  const todayStats = {
    totalAppointments: 12,
    pending: 3,
    completed: 5,
  };

  return (
    <div>
      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic title="Doctors" value={2} prefix={<UserOutlined />} />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic
              title="Patients"
              value={1925}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic
              title="Appointments"
              value={153}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
        hoverable
      >
        <Row gutter={[16, 16]} align="middle">
          {/* Left Content */}
          <Col xs={24} md={16}>
            <Title level={3} style={{ marginBottom: 8 }}>
              Welcome back 👋
            </Title>

            <Text type="secondary">
              You have <b>{todayStats.totalAppointments}</b> appointments today.
            </Text>

            <div style={{ marginTop: 12 }}>
              <Space>
                <Tag color="orange">Pending: {todayStats.pending}</Tag>
                <Tag color="green">Completed: {todayStats.completed}</Tag>
              </Space>
            </div>
          </Col>

          {/* Right Actions */}
          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Space wrap>
              <Button type="primary" icon={<CalendarOutlined />}>
                View Schedule
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Quick Actions" hoverable>
            <Space wrap>
              <Button type="primary">+ New Appointment</Button>
              <Button type="primary">+ New Patient</Button>
              <Button type="primary">+ New Doctor</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
