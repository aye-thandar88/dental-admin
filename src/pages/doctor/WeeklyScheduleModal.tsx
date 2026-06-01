import { useEffect, useState } from "react";
import {
  Modal,
  Switch,
  List,
  Typography,
  Space,
  Divider,
  message,
} from "antd";
import { doctorAvailabilityService } from "../../services/doctorAvailabilityService";

const { Title, Text } = Typography;

interface Props {
  open: boolean;
  doctorId: string;
  onClose: () => void;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type WeekState = Record<string, boolean>;

const WeeklyScheduleModal = ({ open, doctorId, onClose }: Props) => {
  const [loading, setLoading] = useState(false);

  const [week, setWeek] = useState<WeekState>({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });

  useEffect(() => {
    if (open) {
      loadWeek();
    }
  }, [open]);

  const loadWeek = async () => {
    const data = await doctorAvailabilityService.getByDoctor(doctorId);

    const weekState: Record<string, boolean> = {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    };

    data.forEach((item: any) => {
      weekState[item.day] = item.is_active;
    });

    setWeek(weekState);
  };

  const toggleDay = (day: string) => {
    setWeek((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await doctorAvailabilityService.saveWeeklySchedule(doctorId, week);

      message.success("Weekly schedule updated");
      onClose();
    } catch (error: any) {
      console.error(error);
      message.error(error.message || "Failed to update schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Doctor Weekly Schedule"
      onOk={handleSave}
      confirmLoading={loading}
      okText="Save"
    >
      <Title level={5}>Working Days</Title>
      <Text type="secondary">
        Enable or disable doctor availability per day
      </Text>

      <Divider />

      <List
        dataSource={daysOfWeek}
        renderItem={(day) => (
          <List.Item>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Text strong>{day}</Text>

              <Switch checked={week[day]} onChange={() => toggleDay(day)} />
            </Space>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default WeeklyScheduleModal;
