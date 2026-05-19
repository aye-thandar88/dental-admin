import {
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  Layout,
  Space,
  Tabs,
  Typography,
  Row,
  Col,
  Tag,
  message,
  Avatar,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { appointmentService } from "../../services/appointmentService";
import { profileService } from "../../services/profileService";
import CreateAppointment from "./CreateAppointment";
import StatusSummary from "./StatusSummary";
import { useLocation } from "react-router-dom";
import { colors } from "../../app/constant";
import CreateMedicalRecord from "../medicalRecord/CreateMedicalRecord";
import BillingFormModal from "../bill/BillingFormModal";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const getDentistStatusTag = (status: string) => {
  return status === "approved" ? (
    <Tag color="green">{status}</Tag>
  ) : (
    <Tag color="blue">{status}</Tag>
  );
};

const DentistCard = ({ dentist }: { dentist: Profile }) => {
  return (
    <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Avatar size={48} src={dentist.profile_photo} />
          <div>
            <Title level={5} style={{ margin: 0 }}>
              {dentist.name}
            </Title>
            <Text type="secondary">{dentist.phone}</Text>
          </div>
        </div>

        {getDentistStatusTag(dentist.status)}
      </div>
    </Card>
  );
};

const Schedule = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState("1");

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );

  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  const [modalOpen, setModalOpen] = useState(false);
  // const [selectedAppointmentId, setSelectedAppointmentId] = useState<
  //   number | null
  // >(null);
  const [creatingRecord, setCreatingRecord] = useState<any>(null);
  const [creatingBilling, setCreatingBilling] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appts, docs] = await Promise.all([
        appointmentService.getAll({ appointment_date: pathSnippets[1] }),
        profileService.getDoctors(),
      ]);

      setAppointments(appts || []);
      setDoctors(docs || []);
    } catch (err: any) {
      message.error("Failed to load schedule");
    }
  };

  const handleOpen = (date?: string) => {
    setSelectedDate(date || dayjs().format("YYYY-MM-DD"));
    setOpen(true);
  };

  const handleApprove = async (id: string) => {
    try {
      const updatedUser = await appointmentService.update(id, {
        status: "approved",
      });
      message.success(`${updatedUser.name} is now approved!`);

      loadData();
    } catch (error: any) {
      console.error(error);
      message.error("Failed to approve the user.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const updatedUser = await appointmentService.update(id, {
        status: "cancel",
      });
      message.success(`${updatedUser.name} is now canceled!`);

      loadData();
    } catch (error: any) {
      console.error(error);
      message.error("Failed to cancel the user.");
    }
  };

  const handleCreateMedicalRecord = (appointmentId: number) => {
    // setSelectedAppointmentId(appointmentId);
    setCreatingRecord({ appointmentId: appointmentId });
    setModalOpen(true);
  };

  const handleCreateBilling = (appointmentId: number) => {
    // setSelectedAppointmentId(appointmentId);
    setCreatingBilling({ appointmentId: appointmentId });
    setModalOpen(true);
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
          marginBottom: 20,
          background: "#fff",
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Appointments
          </Title>
          <Text type="secondary">Plan & manage clinic schedule</Text>
        </div>

        <Space>
          <Input placeholder="Search patient..." style={{ width: 220 }} />
          <Button icon={<CalendarOutlined />}>
            {dayjs(selectedDate).format("DD MMM YYYY")}
          </Button>

          <Button icon={<FilterOutlined />}>Filter</Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpen()}
          >
            New Appointment
          </Button>
        </Space>
      </Header>

      <Content>
        <Card>
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={[
              { key: "1", label: "Appointments" },
              { key: "2", label: "Dentists" },
            ]}
          />

          {activeKey === "1" && (
            <>
              <StatusSummary appointments={appointments} />

              <div style={{ marginTop: 16 }}>
                {appointments.map((item) => (
                  <Card key={item.id} style={{ marginBottom: 10 }}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <b>{item.appointment_date}</b>
                        <div>{item.patient?.name}</div>
                        <small>
                          {item.doctor?.name} • {item.id || "-"}
                        </small>
                      </Col>

                      <Col>
                        <Tag
                          color={
                            item.status === "approved"
                              ? "green"
                              : item.status === "cancel"
                                ? "red"
                                : "blue"
                          }
                        >
                          {item.status || "pending"}
                        </Tag>
                      </Col>

                      <Col style={{ display: "flex", gap: 8 }}>
                        {item.status === "approved" && (
                          <>
                            <Button
                              icon={<PlusOutlined style={{ color: "#fff" }} />}
                              onClick={() => handleCreateMedicalRecord(item.id)}
                              style={{
                                borderStyle: "none",
                                background: colors.primary,
                                color: "#fff",
                              }}
                            >
                              Create Medical Record
                            </Button>
                            <Button
                              icon={<PlusOutlined style={{ color: "#fff" }} />}
                              onClick={() => handleCreateBilling(item.id)}
                              style={{
                                borderStyle: "none",
                                background: colors.primary,
                                color: "#fff",
                              }}
                            >
                              Create Billing
                            </Button>
                          </>
                        )}
                        <Button
                          icon={<EditOutlined style={{ color: "#fff" }} />}
                          onClick={() => setEditingAppointment(item)}
                          style={{
                            borderStyle: "none",
                            background: colors.primary,
                          }}
                        />
                        {item.status !== "approved" &&
                          item.status !== "rejected" && (
                            <>
                              <Button
                                icon={
                                  <CheckOutlined style={{ color: "#fff" }} />
                                }
                                onClick={() => handleApprove(item.id)}
                                style={{
                                  borderStyle: "none",
                                  background: colors.primary,
                                }}
                              />
                              <Button
                                icon={
                                  <CloseOutlined style={{ color: "#fff" }} />
                                }
                                onClick={() => handleReject(item.id)}
                                style={{
                                  borderStyle: "none",
                                  background: colors.primary,
                                }}
                              />
                            </>
                          )}
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeKey === "2" && (
            <Row gutter={[16, 16]}>
              {doctors.map((doc) => (
                <Col xs={24} md={12} key={doc.id}>
                  <DentistCard dentist={doc} />
                </Col>
              ))}
            </Row>
          )}
        </Card>

        <CreateAppointment
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={loadData}
        />

        {editingAppointment && (
          <CreateAppointment
            open={!!editingAppointment}
            onClose={() => {
              setEditingAppointment(null);
              setOpen(false);
            }}
            onSuccess={loadData}
            editingAppointment={editingAppointment}
          />
        )}

        {creatingRecord && (
          <CreateMedicalRecord
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            createRecord={creatingRecord}
            onSuccess={() => {
              message.success("Medical record created!");
            }}
          />
        )}

        {creatingBilling && (
          <BillingFormModal
            open={!!creatingBilling}
            onClose={() => setCreatingBilling(null)}
            createRecord={creatingBilling}
            onSuccess={() => {
              message.success("Billing record created!");
            }}
          />
        )}
      </Content>
    </Layout>
  );
};

export default Schedule;
