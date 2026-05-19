import { Card, Col, Row, Statistic } from "antd";

interface StatusSummaryProps {
  appointments?: { status: string }[];
}

const StatusSummary = ({ appointments = [] }: StatusSummaryProps) => {
  const count = (status: string) =>
    appointments.filter((a) => a.status === status).length;

  const data = [
    { title: "Pending", count: count("pending"), color: "#1890ff" }, // blue
    { title: "Approved", count: count("approved"), color: "#52c41a" }, // green
    { title: "Cancel", count: count("cancel"), color: "#f5222d" }, // red
  ];

  return (
    <Row gutter={16}>
      {data.map((item) => (
        <Col xs={24} sm={12} md={8} key={item.title}>
          <Card
            bordered={false}
            style={{
              borderLeft: `6px solid ${item.color}`,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Statistic
              title={item.title}
              value={item.count}
              valueStyle={{ color: item.color, fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatusSummary;