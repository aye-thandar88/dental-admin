// import { Button, Form, Input, Modal, Select, TimePicker, message } from "antd";
// import { useEffect, useState } from "react";
// import dayjs from "dayjs";

// import { appointmentService } from "../../services/appointmentService";
// import { profileService } from "../../services/profileService";

// const { Option } = Select;

// const CreateAppointment = ({
//   open,
//   onClose,
//   onSuccess,
//   editingAppointment,
// }: any) => {
//   const [form] = Form.useForm();
//   const [patients, setPatients] = useState<any[]>([]);
//   const [doctors, setDoctors] = useState<any[]>([]);

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     const [p, d] = await Promise.all([
//       profileService.getPatients(),
//       profileService.getDoctors(),
//     ]);

//     setPatients(p || []);
//     setDoctors(d || []);
//   };

//   const loadEditUsers = async (editingAppointment: any) => {
//     const [p, d] = await Promise.all([
//       profileService.getByPatient(editingAppointment.patient_id),
//       profileService.getByDoctor(editingAppointment.doctor_id),
//     ]);

//     setPatients(p || []);
//     setDoctors(d || []);
//   };

//   if (editingAppointment) {
//     loadEditUsers(editingAppointment);
//     form.setFieldsValue({
//       patient_id: patients?.[0]?.id || null,
//       doctor_id: doctors?.[0]?.id || null,
//       date: editingAppointment.appointment_date,
//       time: dayjs(editingAppointment.appointment_time, "HH:mm"),
//     });
//   } else {
//     form.resetFields();
//   }

//   const handleSubmit = async (values: any) => {
//     if (editingAppointment) {
//       try {
//         await appointmentService.update(editingAppointment.id, {
//           patient_id: values.patient_id,
//           doctor_id: values.doctor_id,
//           appointment_date: values.date,
//           appointment_time: values.time.format("HH:mm"),
//           status: "pending",
//         });

//         message.success("Appointment updated");
//         form.resetFields();
//       } catch (err: any) {
//         message.error("Failed to update appointment");
//         return;
//       }
//     }

//     try {
//       await appointmentService.create({
//         patient_id: values.patient_id,
//         doctor_id: values.doctor_id,
//         appointment_date: values.date,
//         appointment_time: values.time.format("HH:mm"),
//         status: "pending",
//       });

//       message.success("Appointment created");
//       form.resetFields();

//       onClose();
//       onSuccess?.();
//     } catch (err: any) {
//       message.error("Failed to create appointment");
//     }
//   };

//   return (
//     <Modal
//       title={editingAppointment ? "Edit Appointment" : "Create Appointment"}
//       open={open}
//       onCancel={onClose}
//       footer={null}
//     >
//       <Form form={form} layout="vertical" onFinish={handleSubmit}>
//         <Form.Item
//           name="patient_id"
//           label="Patient"
//           rules={[{ required: true }]}
//         >
//           <Select>
//             {patients.map((p) => (
//               <Option key={p.id} value={p.id}>
//                 {p.name}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item name="doctor_id" label="Doctor" rules={[{ required: true }]}>
//           <Select>
//             {doctors.map((d) => (
//               <Option key={d.id} value={d.id}>
//                 {d.name}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item name="date" label="Date" rules={[{ required: true }]}>
//           <Input type="date" />
//         </Form.Item>

//         <Form.Item name="time" label="Time" rules={[{ required: true }]}>
//           <TimePicker format="HH:mm" />
//         </Form.Item>

//         <Button type="primary" htmlType="submit" block>
//           {editingAppointment ? "Update Appointment" : "Create Appointment"}
//         </Button>
//       </Form>
//     </Modal>
//   );
// };

// export default CreateAppointment;

import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  TimePicker,
  message,
  Spin,
  Empty,
} from "antd";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import { appointmentService } from "../../services/appointmentService";
import { profileService } from "../../services/profileService";
import { doctorAvailabilityService } from "../../services/doctorAvailabilityService";

const CreateAppointment = ({
  open,
  onClose,
  onSuccess,
  editingAppointment,
}: any) => {
  const [form] = Form.useForm();

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadingPatient, setLoadingPatient] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (editingAppointment && open) {
      loadEditData();
    } else {
      form.resetFields();
      setPatients([]);
    }
  }, [editingAppointment, open]);

  const loadDoctors = async () => {
    try {
      const data = await doctorAvailabilityService.getTodayAvailable();
      setDoctors(data || []);
    } catch (err) {
      message.error("Failed to load doctors");
    }
  };

  const loadEditData = async () => {
    try {
      const [patient, doctor] = await Promise.all([
        profileService.getByPatient(editingAppointment.patient_id),
        profileService.getByDoctor(editingAppointment.doctor_id),
      ]);

      setPatients(patient ? [patient] : []);

      form.setFieldsValue({
        patient_id: patient?.[0]?.name || null,
        doctor_id: doctor?.[0]?.name || null,
        date: editingAppointment.appointment_date,
        time: dayjs(editingAppointment.appointment_time, "HH:mm"),
      });
    } catch (err) {
      message.error("Failed to load appointment data");
    }
  };

  const handleSearchPatient = async (value: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (!value || value.length < 3) {
      setPatients([]);
      setLoadingPatient(false);
      return;
    }

    setLoadingPatient(true); // show spinner immediately on type

    searchTimer.current = setTimeout(async () => {
      try {
        const data = await profileService.getPatientByPhoneNo(value);
        setPatients(data || []);
      } catch (err) {
        message.error("Failed to search patient");
        setPatients([]);
      } finally {
        setLoadingPatient(false);
      }
    }, 500);
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        patient_id: values.patient_id,
        doctor_id: values.doctor_id,
        appointment_date: values.date,
        appointment_time: values.time.format("HH:mm"),
        status: "pending",
      };

      if (editingAppointment) {
        await appointmentService.update(editingAppointment.id, payload);

        message.success("Appointment updated");
      } else {
        await appointmentService.create(payload);

        message.success("Appointment created");
      }

      form.resetFields();
      setPatients([]);

      onClose();
      onSuccess?.();
    } catch (err) {
      message.error(
        editingAppointment
          ? "Failed to update appointment"
          : "Failed to create appointment",
      );
    }
  };

  return (
    <Modal
      title={editingAppointment ? "Edit Appointment" : "Create Appointment"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Search Patient by Phone */}
        {/* <Form.Item
          name="patient_id"
          label="Patient"
          rules={[{ required: true, message: "Please select patient" }]}
        >
          <Select
            showSearch
            placeholder="Search by mobile number"
            filterOption={false}
            onSearch={handleSearchPatient}
            notFoundContent={loadingPatient ? <Spin size="small" /> : null}
          >
            {patients.map((p) => (
              <Select.Option key={p.id} value={p.id}>
                {p.name} - {p.phone}
              </Select.Option>
            ))}
          </Select>
        </Form.Item> */}
        <Form.Item
          name="patient_id"
          label="Patient"
          rules={[{ required: true, message: "Please select patient" }]}
        >
          <Select
            showSearch
            placeholder="Search by mobile number (min. 3 characters)"
            filterOption={false}
            onSearch={handleSearchPatient}
            notFoundContent={
              loadingPatient ? (
                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <Spin size="small" />
                </div>
              ) : patients.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No patients found"
                  style={{ margin: "8px 0" }}
                />
              ) : null
            }
            allowClear
            onClear={() => setPatients([])}
          >
            {patients.map((p) => (
              <Select.Option key={p.id} value={p.id}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{p.name}</span>
                  <span style={{ color: "#8c8c8c", fontSize: 12 }}>
                    {p.phone}
                  </span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Doctor */}
        <Form.Item name="doctor_id" label="Doctor" rules={[{ required: true }]}>
          <Select placeholder="Select doctor">
            {doctors.map((d) => (
              <Select.Option key={d?.doctor?.id} value={d?.doctor?.id}>
                {d?.doctor?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Date */}
        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <Input type="date" />
        </Form.Item>

        {/* Time */}
        <Form.Item name="time" label="Time" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          {editingAppointment ? "Update Appointment" : "Create Appointment"}
        </Button>
      </Form>
    </Modal>
  );
};

export default CreateAppointment;
