import { Button, Form, Input, Modal, TimePicker } from "antd";
import React, { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CreateAppointment = (props: Props) => {
  const { open, onClose } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const handleAddAppointment = (values: any) => {
    const newAppointment: AppointmentBooking = {
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("HH:mm"),
      patientName: values.patientName,
      reason: values.reason,
    };

    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={`Add Appointment`}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleAddAppointment}>
        <Form.Item
          name="patientName"
          label="Patient Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="time" label="Time" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Appointment
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAppointment;
