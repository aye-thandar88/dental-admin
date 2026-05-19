import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  message,
  Space,
  Layout,
  Typography,
  Popconfirm,
  Tag,
} from "antd";
import BillingFormModal from "./BillingFormModal";
import { billingService } from "../../services/billingService";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { colors } from "../../app/constant";
import PaymentModal from "./PaymentModal";

const { Header } = Layout;
const { Title, Text } = Typography;

const Billing = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  const [search, setSearch] = useState("");

  const fetchBillings = async () => {
    try {
      setLoading(true);

      const data = await billingService.getAll();

      setBillings(data || []);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillings();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await billingService.deleteBilling(id);

      message.success("Billing deleted");

      fetchBillings();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Patient",
      render: (_: any, record: Billing) => record.appointments?.patient?.name,
    },
    {
      title: "Phone",
      render: (_: any, record: Billing) => record.appointments?.patient?.phone,
    },
    {
      title: "Doctor",
      render: (_: any, record: Billing) => record.appointments?.doctor?.name,
    },
    {
      title: "Appointment Date",
      render: (_: any, record: Billing) =>
        record.appointments?.appointment_date,
    },
    {
      title: "OPD Fee",
      dataIndex: "opd_fee",
    },
    {
      title: "Treatment Fee",
      dataIndex: "treatment_fee",
    },
    {
      title: "Medication Fee",
      dataIndex: "medication_fee",
    },
    {
      title: "Total",
      dataIndex: "total",
    },
    {
      title: "Status",
      render: (_: any, record: Billing) => (
        <Tag color={record.payment_status === "paid" ? "green" : "blue"}>
          {record.payment_status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (_: any, record: Billing) => (
        <Space>
          <Button
            icon={<EditOutlined style={{ color: "#fff" }} />}
            onClick={() => {
              setSelectedBilling(record);
              setOpenForm(true);
            }}
            style={{ borderStyle: "none", background: colors.primary }}
          />

          {record.payment_status === "unpaid" && (
            <Button
              type="primary"
              onClick={() => {
                setSelectedBilling(record);
                setOpenPayment(true);
              }}
            >
              Pay Now
            </Button>
          )}
          <Popconfirm
            title="Delete Billing?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              icon={<DeleteOutlined style={{ color: "#fff" }} />}
              style={{ borderStyle: "none", background: colors.primary }}
            />
          </Popconfirm>
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
            Billing Records
          </Title>
          <Text type="secondary">Manage billing records</Text>
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
        dataSource={billings}
        columns={columns}
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      {openForm && (
        <BillingFormModal
          open={openForm}
          createRecord={
            selectedBilling?.appointments?.id
              ? { appointmentId: selectedBilling?.appointments?.id }
              : undefined
          }
          editingRecord={selectedBilling}
          onClose={() => setOpenForm(false)}
          onSuccess={() => {
            setOpenForm(false);
            fetchBillings();
          }}
        />
      )}

      {openPayment && (
        <PaymentModal
          open={openPayment}
          onClose={() => {
            setOpenPayment(false);
            setSelectedBilling(null);
          }}
          billingId={selectedBilling?.id || ""}
          onSuccess={fetchBillings}
        />
      )}
    </Layout>
  );
};

export default Billing;
