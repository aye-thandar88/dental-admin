import { Button, Form, Input, Modal, Select, TimePicker, message } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { appointmentService } from "../../services/appointmentService";
import { profileService } from "../../services/profileService";

const { Option } = Select;

const CreateAppointment = ({
  open,
  onClose,
  onSuccess,
  editingAppointment,
}: any) => {
  const [form] = Form.useForm();
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const [p, d] = await Promise.all([
      profileService.getPatients(),
      profileService.getDoctors(),
    ]);

    setPatients(p || []);
    setDoctors(d || []);
  };

  const loadEditUsers = async (editingAppointment: any) => {
    const [p, d] = await Promise.all([
      profileService.getByPatient(editingAppointment.patient_id),
      profileService.getByDoctor(editingAppointment.doctor_id),
    ]);

    setPatients(p || []);
    setDoctors(d || []);
  };

  if (editingAppointment) {
    loadEditUsers(editingAppointment);
    form.setFieldsValue({
      patient_id: patients?.[0]?.id || null,
      doctor_id: doctors?.[0]?.id || null,
      date: editingAppointment.appointment_date,
      time: dayjs(editingAppointment.appointment_time, "HH:mm"),
    });
  } else {
    form.resetFields();
  }

  const handleSubmit = async (values: any) => {
    if (editingAppointment) {
      try {
        await appointmentService.update(editingAppointment.id, {
          patient_id: values.patient_id,
          doctor_id: values.doctor_id,
          appointment_date: values.date,
          appointment_time: values.time.format("HH:mm"),
          status: "pending",
        });

        message.success("Appointment updated");
        form.resetFields();
      } catch (err: any) {
        message.error("Failed to update appointment");
        return;
      }
    }

    try {
      await appointmentService.create({
        patient_id: values.patient_id,
        doctor_id: values.doctor_id,
        appointment_date: values.date,
        appointment_time: values.time.format("HH:mm"),
        status: "pending",
      });

      message.success("Appointment created");
      form.resetFields();

      onClose();
      onSuccess?.();
    } catch (err: any) {
      message.error("Failed to create appointment");
    }
  };

  return (
    <Modal
      title={editingAppointment ? "Edit Appointment" : "Create Appointment"}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="patient_id"
          label="Patient"
          rules={[{ required: true }]}
        >
          <Select>
            {patients.map((p) => (
              <Option key={p.id} value={p.id}>
                {p.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="doctor_id" label="Doctor" rules={[{ required: true }]}>
          <Select>
            {doctors.map((d) => (
              <Option key={d.id} value={d.id}>
                {d.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <Input type="date" />
        </Form.Item>

        <Form.Item name="time" label="Time" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          {editingAppointment ? "Update Appointment" : "Create Appointment"}
        </Button>
      </Form>
    </Modal>
  );
};

export default CreateAppointment;
