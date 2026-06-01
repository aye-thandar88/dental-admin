import {
  Row,
  Col,
  Card,
  Typography,
  Statistic,
  Button,
  Space,
  message,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { appointmentService } from "../../services/appointmentService";
import { profileService } from "../../services/profileService";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Dashboard() {
  const navigate = useNavigate();
  const todayDate = dayjs(Date.now());

  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [appts, todayAppts, docs, pts] = await Promise.all([
        appointmentService.getAll(),
        appointmentService.getAll({
          appointment_date: dayjs().format("YYYY-MM-DD"),
        }),
        profileService.getDoctors(),
        profileService.getPatients(),
      ]);

      setAppointments(appts || []);
      setTodayAppointments(todayAppts || []);
      setDoctors(docs || []);
      setPatients(pts || []);
    } catch (err: any) {
      message.error("Failed to load schedule");
    }
  };

  const handleViewSchedule = () => {
    navigate(`/appointment/${todayDate.format("YYYY-MM-DD")}`);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic
              title="Doctors"
              value={doctors.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic
              title="Patients"
              value={patients.length}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic
              title="Appointments"
              value={appointments.length}
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
          <Col xs={24} md={16}>
            <Title level={3} style={{ marginBottom: 8 }}>
              Welcome back 👋
            </Title>

            <Text type="secondary">
              You have <b>{todayAppointments.length}</b> appointments today.
            </Text>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Space wrap>
              <Button
                type="primary"
                icon={<CalendarOutlined />}
                onClick={handleViewSchedule}
              >
                View Schedule
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
