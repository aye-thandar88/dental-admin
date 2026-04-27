import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Card, Col, Row, Space, Typography } from "antd";
import React from "react";

const { Text, Title } = Typography;

const data: AppointmentStatusItem[] = [
  {
    title: "Scheduled",
    count: 5,
    subtitle: "Yet to arrive",
    icon: <ClockCircleOutlined />,
    color: "#faad14",
  },
  {
    title: "Checked-in",
    count: 1,
    subtitle: "1 patient waiting ~15 min",
    icon: <UserOutlined />,
    color: "#1890ff",
  },
  {
    title: "In Treatment",
    count: 1,
    subtitle: "Treatment started",
    icon: <MedicineBoxOutlined />,
    color: "#ff7a45",
  },
  {
    title: "Completed",
    count: 1,
    subtitle: "Treatment Done",
    icon: <CheckCircleOutlined />,
    color: "#52c41a",
  },
];

const StatusSummary = () => {
  return (
    <Card
      style={{
        borderRadius: 12,
      }}
    >
      <Text strong style={{ fontSize: 14 }}>
        For appointments scheduled today
      </Text>

      <Row gutter={16} style={{ marginTop: 12 }}>
        {data.map((item, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              hoverable
              style={{
                borderRadius: 10,
              }}
              bodyStyle={{ padding: 14 }}
            >
              <Space align="start" style={{ width: "100%" }}>
                <div
                  style={{
                    fontSize: 22,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <Title level={4} style={{ margin: 0 }}>
                    {item.count}
                  </Title>

                  <Text strong>{item.title}</Text>

                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.subtitle}
                    </Text>
                  </div>
                </div>

                <Badge color={item.color} />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default StatusSummary;
