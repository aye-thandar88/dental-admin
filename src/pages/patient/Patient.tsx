import {
  CheckOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { Header } from "antd/es/layout/layout";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../../app/constant";
import { profileService } from "../../services/profileService";

const { Title, Text } = Typography;
const { Option } = Select;

const Patient = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [patients, setPatients] = useState<Profile[]>([]);

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingPatient, setEditingPatient] = useState<Profile | null>(null);

  const loadPatients = async () => {
    try {
      setLoading(true);

      const data = await profileService.getPatients();

      setPatients(data || []);
    } catch (error: any) {
      console.error(error);

      message.error(error?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const keyword = search.toLowerCase();

      return (
        patient.name?.toLowerCase().includes(keyword) ||
        patient.phone?.includes(search)
      );
    });
  }, [patients, search]);

  const openModal = (patient?: Profile) => {
    setIsModalOpen(true);

    if (patient) {
      setEditingPatient(patient);

      form.setFieldsValue({
        ...patient,
        date_of_birth: patient.date_of_birth
          ? dayjs(patient.date_of_birth)
          : null,
      });

      return;
    }

    setEditingPatient(null);

    form.resetFields();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      setSubmitting(true);

      const payload = {
        name: values.name,
        phone: values.phone,
        gender: values.gender,
        address: values.address,
        date_of_birth: values.date_of_birth?.format("YYYY-MM-DD"),
      };

      if (editingPatient) {
        await profileService.updateProfile(editingPatient.id, payload);

        message.success("Patient updated successfully");
      } else {
        await profileService.createProfile({
          ...payload,
          roles: ["patient"],
        });

        message.success("Patient created successfully");
      }

      closeModal();

      loadPatients();
    } catch (error: any) {
      console.error(error);

      message.error(error?.message || "Failed to save patient");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const updatedUser = await profileService.updateProfile(id, {
        status: "approved",
      });
      message.success(`${updatedUser.name} is now approved!`);

      loadPatients();
    } catch (error: any) {
      console.error(error);
      message.error("Failed to approve the user.");
    }
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "name",
    },

    {
      title: "Phone",
      dataIndex: "phone",
    },

    {
      title: "Gender",
      dataIndex: "gender",
      render: (value: string) => value || "-",
    },

    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
      render: (value: string) =>
        value ? dayjs(value).format("DD MMM YYYY") : "-",
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

      render: (_: any, record: Profile) => (
        <Space>
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
            onClick={() => navigate(`/patient/${record.id}`)}
            style={{
              borderStyle: "none",
              background: colors.primary,
            }}
          />

          {record.status !== "approved" && (
            <Button
              icon={<CheckOutlined style={{ color: "#fff" }} />}
              onClick={() => handleApprove(record.id)}
              style={{
                borderStyle: "none",
                background: colors.primary,
              }}
            />
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
            Patients
          </Title>

          <Text type="secondary">Add, edit & manage patients</Text>
        </div>

        <Space>
          <Input
            placeholder="Search name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            New Patient
          </Button>
        </Space>
      </Header>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={filteredPatients}
        columns={columns}
      />

      <Modal
        title={editingPatient ? "Edit Patient" : "New Patient"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        confirmLoading={submitting}
        destroyOnHidden
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Patient Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter patient name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please enter phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Gender" name="gender">
            <Select allowClear>
              <Option value="male">Male</Option>

              <Option value="female">Female</Option>

              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date of Birth" name="date_of_birth">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Patient;
