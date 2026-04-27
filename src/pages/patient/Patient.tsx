import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Layout,
  Modal,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { Header } from "antd/es/layout/layout";
import dayjs from "dayjs";
import { useState } from "react";
import { colors } from "../../app/constant";
import { initalPatients } from "../../app/mockData";
import { useNavigate } from "react-router";

const { Title, Text } = Typography;
const { Option } = Select;

const Patient = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<PatientInfo[]>(initalPatients);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientInfo | null>(
    null,
  );

  const [form] = Form.useForm();

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search),
  );

  const openModal = (patient?: PatientInfo) => {
    setIsModalOpen(true);

    if (patient) {
      setEditingPatient(patient);
      form.setFieldsValue({
        ...patient,
        lastVisit: dayjs(patient.lastVisit),
      });
    } else {
      setEditingPatient(null);
      form.resetFields();
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newPatient: PatientInfo = {
        id: editingPatient ? editingPatient.id : Date.now(),
        name: values.name,
        phone: values.phone,
        gender: values.gender,
        lastVisit: values.lastVisit.format("YYYY-MM-DD"),
      };

      if (editingPatient) {
        setPatients((prev) =>
          prev.map((p) => (p.id === editingPatient.id ? newPatient : p)),
        );
      } else {
        setPatients((prev) => [...prev, newPatient]);
      }

      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Last Visit",
      dataIndex: "lastVisit",
    },
    {
      title: "Action",
      render: (_: any, record: PatientInfo) => (
        <Space>
          <Button
            onClick={() => openModal(record)}
            style={{ borderStyle: "none", background: colors.secondary }}
          >
            <EditOutlined />
          </Button>
          <Button
            onClick={() => navigate(`/patient/${record.id}`)}
            style={{ borderStyle: "none", background: colors.secondary }}
          >
            <EyeOutlined />
          </Button>
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
            placeholder="Search by name or phone"
            style={{ marginBottom: 16, maxWidth: 300 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        dataSource={filteredPatients}
        columns={columns}
        bordered
      />

      <Modal
        title={editingPatient ? "Edit Patient" : "Add Patient"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Last Visit"
            name="lastVisit"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Patient;
