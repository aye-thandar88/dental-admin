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
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialDentists } from "../../app/mockData";
import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { colors } from "../../app/constant";
import { Header } from "antd/es/layout/layout";

const { Title, Text } = Typography;
const { Option } = Select;

const Doctor = () => {
  const [dentists, setDentists] = useState<Dentist[]>(initialDentists);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDentist, setEditingDentist] = useState<Dentist | null>(null);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const filtered = dentists.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()),
  );

  const openModal = (dentist?: Dentist) => {
    setIsModalOpen(true);
    if (dentist) {
      setEditingDentist(dentist);
      form.setFieldsValue(dentist);
    } else {
      setEditingDentist(null);
      form.resetFields();
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newDentist: Dentist = {
        id: editingDentist ? editingDentist.id : Date.now(),
        ...values,
      };

      if (editingDentist) {
        setDentists((prev) =>
          prev.map((d) => (d.id === editingDentist.id ? newDentist : d)),
        );
      } else {
        setDentists((prev) => [...prev, newDentist]);
      }

      setIsModalOpen(false);
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: Dentist) => (
        <a onClick={() => navigate(`/dentists/${record.id}`)}>{text}</a>
      ),
    },
    { title: "Specialty", dataIndex: "specialty" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Action",
      render: (_: any, record: Dentist) => (
        <Space>
          <Button
            onClick={() => openModal(record)}
            style={{ borderStyle: "none", background: colors.secondary }}
          >
            <EditOutlined />
          </Button>
          <Button
            onClick={() => navigate(`/doctor/${record.id}`)}
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
            Doctors
          </Title>
          <Text type="secondary">Add, edit & manage doctors</Text>
        </div>

        <Space>
          <Input
            placeholder="Search doctor by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 16, maxWidth: 300 }}
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

      <Table rowKey="id" dataSource={filtered} columns={columns} />

      <Modal
        title={editingDentist ? "Edit Dentist" : "Add Dentist"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="specialty"
            label="Specialty"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="General">General</Option>
              <Option value="Orthodontist">Orthodontist</Option>
              <Option value="Surgeon">Surgeon</Option>
            </Select>
          </Form.Item>

          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Doctor;
