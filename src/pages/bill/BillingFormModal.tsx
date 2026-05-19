import { Button, Form, InputNumber, Modal, message } from "antd";
import { useEffect } from "react";
import { billingService } from "../../services/billingService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  createRecord?: any;
  editingRecord?: any;
}

const BillingFormModal = ({
  open,
  onClose,
  onSuccess,
  createRecord,
  editingRecord,
}: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue(editingRecord);
    } else {
      form.resetFields();
    }
  }, [editingRecord, form, open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        await billingService.update(editingRecord.id, values);

        message.success("Billing updated successfully");
      } else {
        await billingService.create({
          ...values,
          appointment_id: createRecord?.appointmentId,
        });

        message.success("Billing created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={editingRecord ? "Update Billing" : "Create Billing"}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="OPD Fee" name="opd_fee" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Treatment Fee"
          name="treatment_fee"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Medication Fee"
          name="medication_fee"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Button type="primary" block onClick={handleSubmit}>
          {editingRecord ? "Update Billing" : "Create Billing"}
        </Button>
      </Form>
    </Modal>
  );
};

export default BillingFormModal;
