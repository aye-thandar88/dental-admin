import { Badge, Button, Calendar, Form, Input, TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialAppointments } from "../../app/mockData";

const Appointment = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] =
    useState<AppointmentBooking[]>(initialAppointments);

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

  return (
    <div>
      {/* <Title level={2}>Dental Clinic Appointment Calendar</Title> */}

      <Calendar
        dateCellRender={dateCellRender}
        // onSelect={(date) => openModal(date.format("YYYY-MM-DD"))}
        onSelect={(date) =>
          navigate(`/appointment/${date.format("YYYY-MM-DD")}`)
        }
      />
    </div>
  );
};

export default Appointment;
