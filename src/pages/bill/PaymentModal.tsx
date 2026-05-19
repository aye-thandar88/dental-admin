import { Button, Form, Modal, Select, message } from "antd";
import { billingService } from "../../services/billingService";

interface Props {
  open: boolean;
  onClose: () => void;
  billingId: string;
  onSuccess: () => void;
}

const PaymentModal = ({ open, onClose, billingId, onSuccess }: Props) => {
  const [form] = Form.useForm();

  const handlePay = async () => {
    try {
      const values = await form.validateFields();

      await billingService.markAsPaid(billingId, values.payment_method);

      message.success("Payment successful");

      onSuccess();
      onClose();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <Modal title="Payment" open={open} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Payment Method"
          name="payment_method"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Cash", value: "Cash" },
              { label: "KBZ Pay", value: "KBZ Pay" },
              { label: "Wave Pay", value: "Wave Pay" },
              { label: "Card", value: "Card" },
            ]}
          />
        </Form.Item>

        <Button type="primary" block onClick={handlePay}>
          Confirm Payment
        </Button>
      </Form>
    </Modal>
  );
};

export default PaymentModal;
