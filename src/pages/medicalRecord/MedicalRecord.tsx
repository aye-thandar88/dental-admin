import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  message,
  Space,
  Layout,
  Typography,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { colors } from "../../app/constant";

import { medicalRecordService } from "../../services/medicalRecordService";
import CreateMedicalRecord from "./CreateMedicalRecord"; 

const { Header } = Layout;
const { Title, Text } = Typography;

const MedicalRecordPage = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await medicalRecordService.getAll({});
      setRecords(data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load medical records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredRecords = records.filter(
    (r) =>
      r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      r.doctorName?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (record?: any) => {
    setEditingRecord(record || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingRecord(null);
    setModalOpen(false);
    loadRecords(); 
  };

  const columns = [
    { title: "Patient", dataIndex: "patientName", key: "patient" },
    { title: "Doctor", dataIndex: "doctorName", key: "doctor" },
    { title: "Diagnosis", dataIndex: "diagnosis", key: "diagnosis" },
    { title: "Treatment", dataIndex: "treatment", key: "treatment" },
    { title: "Tooth", dataIndex: "toothNumber", key: "toothNumber" },
    {
      title: "Next Visit",
      dataIndex: "nextVisitDate",
      key: "nextVisitDate",
      render: (date: string) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined style={{ color: "#fff" }} />}
            onClick={() => openModal(record)}
            style={{ borderStyle: "none", background: colors.primary }}
          />
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
            Medical Records
          </Title>
          <Text type="secondary">Manage medical records</Text>
        </div>

        <Space>
          <Input
            placeholder="Search by patient or doctor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Space>
      </Header>

      <Table
        rowKey="id"
        dataSource={filteredRecords}
        columns={columns}
        loading={loading}
      />

      {modalOpen && (
        <CreateMedicalRecord
          open={modalOpen}
          editingRecord={editingRecord}
          onClose={closeModal}
          onSuccess={closeModal}
        />
      )}
    </Layout>
  );
};

export default MedicalRecordPage;