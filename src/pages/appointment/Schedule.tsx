import {
  CalendarOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Layout,
  Row,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  appointmentsList,
  initialDentists,
  statusColor,
} from "../../app/mockData";
import StatusSummary from "./StatusSummary";
import CreateAppointment from "./CreateAppointment";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const getDentistStatusTag = (status: Dentist["status"]) => {
  return status === "Available" ? (
    <Tag color="green">Available</Tag>
  ) : (
    <Tag color="blue">In Treatment</Tag>
  );
};

const DentistCard = ({ dentist }: { dentist: Dentist }) => {
  return (
    <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Avatar size={48} src={dentist.avatar} />
          <div>
            <Title level={5} style={{ margin: 0 }}>
              {dentist.name}
            </Title>
            <Text type="secondary">{dentist.specialty}</Text>
          </div>
        </div>

        {getDentistStatusTag(dentist.status)}
      </div>

      {/* Stats */}
      <Row style={{ marginTop: 16 }}>
        <Col span={12}>
          <Title level={4} style={{ margin: 0 }}>
            {dentist.pending}
          </Title>
          <Text type="secondary">Pending Appointments today</Text>
        </Col>
        <Col span={12}>
          <Title level={4} style={{ margin: 0 }}>
            {dentist.completed}
          </Title>
          <Text type="secondary">Completed</Text>
        </Col>
      </Row>
    </Card>
  );
};

const Schedule = () => {
  const { date } = useParams();
  const [scheduleDate, setScheduleDate] = useState(date ? date : dayjs());
  const [activeKey, setActiveKey] = useState("1");

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleOpen = (date: string) => {
    setSelectedDate(date);
    setOpen(true);
  };

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          borderRadius: "12px",
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Appointments
          </Title>
          <Text type="secondary">Plan, track & manage daily appointments</Text>
        </div>

        <Space>
          <Input placeholder="Search patient..." style={{ width: 220 }} />
          <Button icon={<CalendarOutlined />}>
            {dayjs(scheduleDate).format("DD MMM YYYY")}
          </Button>
          <Button icon={<FilterOutlined />}>Filters</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpen(dayjs(scheduleDate).format("YYYY-MM-DD"))}
          >
            New Appointment
          </Button>

          <CreateAppointment open={open} onClose={() => setOpen(false)} />
        </Space>
      </Header>

      <Content style={{ paddingBlock: 20 }}>
        <Card>
          <Tabs
            defaultActiveKey="1"
            items={[
              { key: "1", label: "Appointments" },
              { key: "2", label: "Dentist Allocation" },
            ]}
            onChange={(key) => setActiveKey(key)}
          />

          {activeKey === "1" ? (
            <>
              <StatusSummary />

              <Space
                direction="vertical"
                style={{ width: "100%", marginTop: "10px" }}
                size={12}
              >
                {appointmentsList.map(
                  (item: AppointmentDetails, idx: number) => (
                    <Card key={idx} hoverable>
                      <Row align="middle" justify="space-between">
                        {/* Left: Time */}
                        <Col>
                          <Title level={5} style={{ margin: 0 }}>
                            {item.time}
                          </Title>
                        </Col>

                        {/* Middle: Info */}
                        <Col flex="auto" style={{ paddingLeft: 20 }}>
                          <Space direction="vertical" size={0}>
                            <Text strong>{item.patient}</Text>
                            <Text type="secondary">{item.treatment}</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {item.doctor} • {item.chair}
                            </Text>
                          </Space>
                        </Col>

                        {/* Status */}
                        <Col>
                          <Tag color={statusColor[item.status]}>
                            {item.status}
                          </Tag>
                        </Col>

                        {/* Action */}
                        <Col>
                          <Button
                            icon={<EditOutlined />}
                            style={{ borderStyle: "hidden" }}
                          />
                        </Col>
                      </Row>
                    </Card>
                  ),
                )}
              </Space>
            </>
          ) : (
            <Row gutter={[16, 16]}>
              {initialDentists.map((dentist) => (
                <Col xs={24} md={12} key={dentist.id}>
                  <DentistCard dentist={dentist} />
                </Col>
              ))}
            </Row>
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default Schedule;
