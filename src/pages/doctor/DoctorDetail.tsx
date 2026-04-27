import { UserOutlined } from "@ant-design/icons";
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
} from "antd";
import React from "react";
import {
  initalPatients,
  initialAppointments,
  initialDentists,
} from "../../app/mockData";

const { Title } = Typography;
const { TabPane } = Tabs;

const getDentistStatusTag = (status: Dentist["status"]) => {
  return status === "Available" ? (
    <Tag color="green">Available</Tag>
  ) : (
    <Tag color="blue">In Treatment</Tag>
  );
};

const DoctorDetail = () => {
  const dentist: Dentist = initialDentists[0];
  const patients: PatientInfo[] = initalPatients;
  const schedule: AppointmentBooking[] = initialAppointments;

  return (
    <div>
      {/* Profile */}
      <Card>
        <Row align="middle">
          <Col>
            <Avatar size={64} icon={<UserOutlined />} />
          </Col>
          <Col style={{ marginLeft: 16 }}>
            <Title level={4}>{dentist.name}</Title>
            <p>{dentist.specialty}</p>
          </Col>
        </Row>
      </Card>

      {/* Tabs */}
      <Tabs defaultActiveKey="1" style={{ marginTop: 20 }}>
        {/* Overview */}
        <TabPane tab="Overview" key="1">
          <Card hoverable>
            <Descriptions column={2}>
              <Descriptions.Item label="Name">{dentist.name}</Descriptions.Item>
              <Descriptions.Item label="Specialty">
                {dentist.specialty}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {dentist.phone}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>

        {/* Schedule */}
        <TabPane tab="Schedule" key="2">
          <Table
            rowKey="id"
            dataSource={schedule}
            columns={[
              { title: "Date", dataIndex: "date" },
              { title: "Time", dataIndex: "time" },
              {
                title: "Status",
                dataIndex: "status",
                render: (status: DentistStatus) => (
                  <Tag>{getDentistStatusTag(status)}</Tag>
                ),
              },
            ]}
            pagination={false}
          />
        </TabPane>

        {/* Patients */}
        <TabPane tab="Patients" key="3">
          <Table
            rowKey="id"
            dataSource={patients}
            columns={[
              { title: "Name", dataIndex: "name" },
              { title: "Phone", dataIndex: "phone" },
              { title: "Treatment", dataIndex: "Teeth Cleaning" },
              { title: "Last Visit", dataIndex: "lastVisit" },
            ]}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DoctorDetail;
