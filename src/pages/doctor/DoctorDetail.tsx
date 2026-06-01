import { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Row,
  Table,
  Tabs,
  Tag,
  Typography,
  Spin,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";

import { profileService } from "../../services/profileService";
import { appointmentService } from "../../services/appointmentService";
import { medicalRecordService } from "../../services/medicalRecordService";

const { Title } = Typography;
const { TabPane } = Tabs;

const DoctorDetail = () => {
  const { id } = useParams();

  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("patients id:", patients);

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (doctorId: string) => {
    try {
      setLoading(true);

      const [doctorData, appts, medicalRecords] = await Promise.all([
        profileService.getByDoctor(doctorId),
        appointmentService.getByDoctor(doctorId),
        medicalRecordService.getDoctorHistory(doctorId),
      ]);

      setDoctor(doctorData?.[0] || null);
      setAppointments(appts || []);
      setPatients(transformPatientData(medicalRecords || []));
    } catch (err: any) {
      message.error("Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  };

  const scheduleColumns = [
    {
      title: "Date",
      dataIndex: "appointment_date",
      render: (d: string) => new Date(d).toLocaleDateString(),
    },
    {
      title: "Patient",
      dataIndex: ["patient", "name"],
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "completed" ? "green" : "blue"}>{status}</Tag>
      ),
    },
  ];

  const patientColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    { title: "Treatment", dataIndex: "treatment" },
    { title: "Last Visit", dataIndex: "lastVisit" },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!doctor) return <div>No doctor found</div>;

  return (
    <div>
      {/* Profile */}
      <Card>
        <Row align="middle">
          <Col>
            <Avatar size={64} icon={<UserOutlined />} />
          </Col>
          <Col style={{ marginLeft: 16 }}>
            <Title level={4}>{doctor.name}</Title>
            <p>{doctor.phone}</p>
          </Col>
        </Row>
      </Card>

      <Tabs defaultActiveKey="1" style={{ marginTop: 20 }}>
        <TabPane tab="Overview" key="1">
          <Card>
            <Descriptions column={2}>
              <Descriptions.Item label="Name">{doctor.name}</Descriptions.Item>
              <Descriptions.Item label="Gender">
                {doctor.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {doctor.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="green">Available</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>

        <TabPane tab="Schedule" key="2">
          <Table
            rowKey="id"
            dataSource={appointments}
            columns={scheduleColumns}
            pagination={false}
          />
        </TabPane>

        <TabPane tab="Patients" key="3">
          <Table
            rowKey="id"
            dataSource={patients}
            columns={patientColumns}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DoctorDetail;

const transformPatientData = (data: any[]) => {
  return data.map((item) => ({
    id: item.id,
    name: item.patient?.name || "-",
    phone: item.patient?.phone || "-",
    treatment: item.treatment || "-",
    lastVisit:
      item.appointment?.appointment_date ||
      item.created_at?.split("T")[0] ||
      "-",
    diagnosis: item.diagnosis,
    nextVisit: item.next_visit_date,
    doctorName: item.doctor?.name,
    appointmentTime: item.appointment?.appointment_time,
  }));
};
