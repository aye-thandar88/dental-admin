import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Row,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { profileService } from "../../services/profileService";
import { appointmentService } from "../../services/appointmentService";
import { medicalRecordService } from "../../services/medicalRecordService";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PatientDetail = () => {
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 1. Get logged-in patient profile
        const profile = await profileService.getMyProfile();
        setPatient(profile);

        // 2. Get appointments if patient exists
        if (profile?.id) {
          const [apptData, treatmentData] = await Promise.all([
            appointmentService.getByPatient(profile.id),
            medicalRecordService.getPatientHistory(profile.id),
          ]);

          setAppointments(apptData || []);
          setTreatments(treatmentData || []);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const appointmentColumns = [
    {
      title: "Date",
      dataIndex: "appointment_date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Doctor",
      dataIndex: ["doctor", "name"],
      key: "doctor",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Completed" ? "green" : "blue"}>{status}</Tag>
      ),
    },
  ];

  const lastVisit =
    appointments?.length > 0
      ? appointments[appointments.length - 1]?.date
      : "-";

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!patient) {
    return <div>No patient profile found</div>;
  }

  const treatmentColumns = [
    {
      title: "Treatment",
      dataIndex: "treatment_name",
      key: "treatment",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Doctor",
      dataIndex: ["doctor", "name"],
      key: "doctor",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
    },
  ];

  return (
    <div>
      <Card>
        <Row align="middle" justify="space-between">
          <Col>
            <Space>
              <Avatar size={64} icon={<UserOutlined />} />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {patient.name}
                </Title>
                <Text type="secondary">{patient.phone}</Text>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      <Tabs defaultActiveKey="1" style={{ marginTop: 20 }}>
        <TabPane tab="Overview" key="1">
          <Card hoverable>
            <Descriptions column={2}>
              <Descriptions.Item label="Name">{patient.name}</Descriptions.Item>
              <Descriptions.Item label="Gender">
                {patient.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {patient.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {patient.address}
              </Descriptions.Item>
              <Descriptions.Item label="Last Visit">
                {lastVisit}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={patient.status === "approved" ? "green" : "orange"}>
                  {patient.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>

        {/* Appointments */}
        <TabPane tab="Appointments" key="2">
          <Card hoverable>
            <Table
              rowKey="id"
              dataSource={appointments}
              columns={appointmentColumns}
              pagination={false}
            />
          </Card>
        </TabPane>

        {/* Treatments */}
        <TabPane tab="Treatments" key="3">
          <Card hoverable>
            <Table
              rowKey="id"
              dataSource={treatments}
              columns={treatmentColumns}
              pagination={false}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
