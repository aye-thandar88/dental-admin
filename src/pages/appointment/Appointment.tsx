import { Badge, Calendar, message } from "antd";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../../services/appointmentService";

const Appointment = () => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [appointments, setAppointments] = useState<AppointmentBooking[]>([]);

  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD");
    const listData = appointments.filter((a) => a.date === dateStr);

    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge
              status="success"
              text={`${item.time} - ${item.patientName}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  const loadData = async () => {
    try {
      const appts = await appointmentService.getAll({
        appointment_date: selectedDate?.format("YYYY-MM-DD"),
      });

      setAppointments(appts || []);
    } catch (err: any) {
      message.error("Failed to load schedule");
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  return (
    <div>
      <Calendar
        dateCellRender={dateCellRender}
        onSelect={(date) => {
          // setSelectedDate(date);
          navigate(`/appointment/${date.format("YYYY-MM-DD")}`);
        }}
        onChange={(date) => {
          setSelectedDate(date);
        }}
      />
    </div>
  );
};

export default Appointment;
