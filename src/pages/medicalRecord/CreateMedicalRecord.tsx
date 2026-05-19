import { Button, DatePicker, Form, Input, Modal, Steps, message } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { medicalRecordService } from "../../services/medicalRecordService";
import { appointmentService } from "../../services/appointmentService";

const CreateMedicalRecord = ({
  open,
  onClose,
  onSuccess,
  editingRecord,
  createRecord,
}: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);

  useEffect(() => {
    if (!open) return;

    setCurrentStep(0);

    if (editingRecord) {
      form.setFieldsValue({
        patientId: editingRecord.patientName,
        doctorId: editingRecord.doctorName,
        diagnosis: editingRecord.diagnosis,
        treatment: editingRecord.treatment,
        toothNumber: editingRecord.toothNumber,
        prescription: editingRecord.prescription,
        nextVisitDate: editingRecord.nextVisitDate
          ? dayjs(editingRecord.nextVisitDate)
          : null,
        notes: editingRecord.notes,
      });
    } else if (createRecord) {
      loadAppointmentAndPopulate();
    } else {
      form.resetFields();
    }
  }, [open, editingRecord, createRecord]);

  const loadAppointmentAndPopulate = async () => {
    setLoading(true);
    try {
      const appointment = await appointmentService.getById(
        createRecord.appointmentId,
      );

      setAppointmentDetails(appointment);

      if (appointment) {
        form.setFieldsValue({
          patientId: appointment?.patient?.name ?? "",
          doctorId: appointment?.doctor?.name ?? "",
        });
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to load appointment details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const allFields = steps.flatMap((step) => step.fields);
      const values = await form.validateFields(allFields);

      const payload = {
        appointment_id:
          editingRecord?.appointment_id || createRecord?.appointmentId,
        patient_id: appointmentDetails?.patient?.id || editingRecord?.patient_id,
        doctor_id: appointmentDetails?.doctor?.id || editingRecord?.doctor_id,
        diagnosis: values.diagnosis,
        treatment: values.treatment,
        tooth_number: values.toothNumber,
        prescription: values.prescription,
        next_visit_date: values.nextVisitDate?.format("YYYY-MM-DD") || null,
        notes: values.notes,
      };

      setLoading(true);

      if (editingRecord) {
        await medicalRecordService.update(editingRecord.id, payload);
        message.success("Record updated successfully");
      } else {
        await medicalRecordService.create(payload);
        message.success("Record added successfully");
      }

      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      if (err?.errorFields) return;
      console.error(err);
      message.error("Failed to save record");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setCurrentStep(0);
    onClose?.();
  };

  const prev = () => setCurrentStep((s) => s - 1);

  const next = async () => {
    try {
      await form.validateFields(steps[currentStep].fields);
      setCurrentStep((s) => s + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const steps = [
    {
      title: "Info",
      content: (
        <>
          <Form.Item name="patientId" label="Patient">
            <Input disabled />
          </Form.Item>
          <Form.Item name="doctorId" label="Doctor">
            <Input disabled />
          </Form.Item>
        </>
      ),
      fields: ["patientId", "doctorId"],
    },
    {
      title: "Treatment",
      content: (
        <>
          <Form.Item
            name="diagnosis"
            label="Diagnosis"
            rules={[{ required: true, message: "Enter diagnosis" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="treatment"
            label="Treatment"
            rules={[{ required: true, message: "Enter treatment" }]}
          >
            <Input />
          </Form.Item>
        </>
      ),
      fields: ["diagnosis", "treatment"],
    },
    {
      title: "Additional",
      content: (
        <>
          <Form.Item name="toothNumber" label="Tooth Number">
            <Input />
          </Form.Item>
          <Form.Item name="prescription" label="Prescription">
            <Input />
          </Form.Item>
          <Form.Item name="nextVisitDate" label="Next Visit Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </>
      ),
      fields: ["toothNumber", "prescription", "nextVisitDate", "notes"],
    },
  ];

  return (
    <Modal
      title={editingRecord ? "Edit Record" : "Add Record"}
      open={open}
      onCancel={handleClose}
      footer={null}
      confirmLoading={loading}
    >
      <Steps
        current={currentStep}
        items={steps.map(({ title }) => ({ title }))}
        style={{ marginBottom: 24 }}
      />

      <Form layout="vertical" form={form}>
        {steps[currentStep].content}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          {currentStep > 0 && <Button onClick={prev}>Previous</Button>}
          <div style={{ marginLeft: "auto" }}>
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                {editingRecord ? "Update" : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateMedicalRecord;
