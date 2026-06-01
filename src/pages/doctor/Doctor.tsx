import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Layout,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  Tag,
  message,
} from "antd";
import {
  CalendarOutlined,
  CheckOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { profileService } from "../../services/profileService";
import { appColors, colors } from "../../app/constant";
import WeeklyScheduleModal from "./WeeklyScheduleModal";

const { Title, Text } = Typography;
const { Header } = Layout;
const { Option } = Select;

const Doctor = () => {
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);

  const [weekModalOpen, setWeekModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await profileService.getDoctors();
      setDoctors(data || []);
      setFiltered(data || []);
    } catch (err: any) {
      message.error(err.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (value: string) => {
    setSearch(value);

    const result = doctors.filter(
      (d) =>
        d.name?.toLowerCase().includes(value.toLowerCase()) ||
        d.specialty?.toLowerCase().includes(value.toLowerCase()),
    );

    setFiltered(result);
  };

  const openModal = (doctor?: any) => {
    setIsModalOpen(true);

    if (doctor) {
      setEditingDoctor(doctor);
      form.setFieldsValue(doctor);
    } else {
      setEditingDoctor(null);
      form.resetFields();
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingDoctor) {
        await profileService.updateProfile(editingDoctor.id, values);
        message.success("Doctor updated");
      } else {
        await profileService.createProfile({
          ...values,
          roles: ["doctor"],
        });
        message.success("Doctor created");
      }

      setIsModalOpen(false);
      loadDoctors();
    } catch (err: any) {
      message.error(err.message || "Failed to save doctor");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const updatedUser = await profileService.updateProfile(id, {
        status: "approved",
      });
      message.success(`${updatedUser.name} is now approved!`);

      loadDoctors();
    } catch (error: any) {
      console.error(error);
      message.error("Failed to approve the user.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_: any, record: any) => (
        <a onClick={() => navigate(`/doctor/${record.id}`)}>{record.name}</a>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "approved" ? "green" : "blue"}>
          {status || "pending"}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Space>
          {record.status !== "approved" ? (
            <Button
              icon={<CheckOutlined style={{ color: "#fff" }} />}
              onClick={() => handleApprove(record.id)}
              style={{
                background: appColors.checkAction,
                borderColor: appColors.checkAction,
              }}
            />
          ) : (
            <>
              <Button
                icon={<EditOutlined style={{ color: "#fff" }} />}
                onClick={() => openModal(record)}
                style={{
                  borderStyle: "none",
                  background: colors.primary,
                }}
              />
              <Button
                icon={<EyeOutlined style={{ color: "#fff" }} />}
                onClick={() =>
                  navigate(`/doctor/${record.id}`, { state: record })
                }
                style={{
                  borderStyle: "none",
                  background: colors.primary,
                }}
              />
              <Button
                shape="circle"
                icon={<CalendarOutlined style={{ color: "#fff" }} />}
                onClick={() => {
                  setSelectedDoctor(record);
                  setWeekModalOpen(true);
                }}
                style={{
                  borderStyle: "none",
                  background: colors.primary,
                }}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

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
            Doctors
          </Title>
          <Text type="secondary">Manage doctor list</Text>
        </div>

        <Space>
          <Input
            placeholder="Search name"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            New Doctor
          </Button>
        </Space>
      </Header>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={filtered}
        columns={columns}
      />

      <Modal
        title={editingDoctor ? "Edit Doctor" : "Add Doctor"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Gender" name="gender">
            <Select allowClear>
              <Option value="male">Male</Option>

              <Option value="female">Female</Option>

              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {weekModalOpen && (
        <WeeklyScheduleModal
          open={weekModalOpen}
          doctorId={selectedDoctor?.id}
          onClose={() => setWeekModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default Doctor;
