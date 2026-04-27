import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import React from "react";
import {
  appointmentsList,
  initalPatients,
  treatments,
} from "../../app/mockData";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface Treatment {
  id: number;
  name: string;
  date: string;
  dentist: string;
}

const PatientDetail = () => {
  const patient = initalPatients[0];
  const appointments = appointmentsList.filter(
    (a) => a.patient === patient.name,
  );

  const appointmentColumns = [
    { title: "Date", dataIndex: "date" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "Completed" ? "green" : "blue"}>{status}</Tag>
      ),
    },
  ];

  const treatmentColumns = [
    { title: "Treatment", dataIndex: "name" },
    { title: "Date", dataIndex: "date" },
    { title: "Dentist", dataIndex: "dentist" },
  ];

  return (
    <div>
      {/* Profile Card */}
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

      {/* Tabs Section */}
      <Tabs defaultActiveKey="1" style={{ marginTop: 20 }}>
        {/* Overview */}
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
                {patient.lastVisit}
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
