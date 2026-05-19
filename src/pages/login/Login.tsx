import { Form, Input, Button, Typography, Card, Image, Grid, message, Alert } from "antd";
import { LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { useState } from "react";
import ToothLogo from "../../assets/images/toothLogo.jpg";
import Tooths from "../../assets/images/dentist2.jpg";
import { fontSizes } from "../../app/constant";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const Login = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forceShowForm, setForceShowForm] = useState(false);

  const onFinish = async (values: { phone: string; password: string }) => {
    try {
      setSubmitting(true);
      setErrorMessage(null);

      const { phone, password } = values;
      const { data, error } = await authService.login(phone, password);

      if (error || !data.session || !data.user) {
        const msg =
          error?.message || "Login failed. Please check your credentials.";
        setErrorMessage(msg);
        message.error(msg);
        return; // setSubmitting reset in finally
      }

      // Supabase login succeeded. onAuthStateChange will now fire SIGNED_IN,
      // which loads the profile into the store. We wait for it (up to 2s)
      // so the app page has profile data immediately on first render.
      await waitForProfile();

      navigate("/");
    } catch (err: any) {
      const msg = err?.message || "An unexpected error occurred";
      setErrorMessage(msg);
      message.error(msg);
      console.error("Login error:", err);
    } finally {
      // Always runs — clears the loading state whether we succeeded or failed
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      {screens.md && (
        <div style={styles.left}>
          <div>
            <Title style={{ color: "#fff" }}>Dental Admin Portal</Title>
            <Text style={{ fontSize: fontSizes.medium, color: "#fff" }}>
              Manage appointments, patients, and doctors with ease.
            </Text>
          </div>
        </div>
      )}

      {/* Right Side (Form) */}
      <div style={styles.right}>
        <Card style={styles.card} bordered={false} hoverable>
          <Title
            level={3}
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Image
              src={ToothLogo}
              alt="Tooth Logo"
              width={100}
              height={100}
              preview={false}
              style={{ borderRadius: "50%" }}
            />
            <Text strong style={{ fontSize: fontSizes.xlarge }}>
              Welcome Back
            </Text>
          </Title>

          <Form layout="vertical" onFinish={onFinish} form={form}>
            {forceShowForm && (
              <Alert
                message="Auth Check Timeout"
                description="Authentication check took too long. Showing login form. If this persists, check your Supabase configuration."
                type="warning"
                showIcon
                closable
                onClose={() => setForceShowForm(false)}
                style={{ marginBottom: "16px" }}
              />
            )}

            {errorMessage && (
              <Alert
                message="Login Failed"
                description={errorMessage}
                type="error"
                showIcon
                closable
                onClose={() => setErrorMessage(null)}
                style={{ marginBottom: "16px" }}
              />
            )}

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="09XXXXXXXXX"
                size="large"
                disabled={submitting}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter password"
                size="large"
                disabled={submitting}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={submitting}
                disabled={submitting}
              >
                {submitting ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;

function waitForProfile(): Promise<void> {
  return new Promise((resolve) => {
    // Already loaded (e.g. fast network)
    if (useAuthStore.getState().profile) {
      resolve();
      return;
    }

    const unsub = useAuthStore.subscribe(
      (state) => state.profile,
      (profile) => {
        if (profile) {
          unsub();
          resolve();
        }
      }
    );

    // Fallback: don't block forever if profile fetch fails
    setTimeout(() => {
      unsub();
      resolve();
    }, 2000);
  });
}


const styles: any = {
  container: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "row",
  },
  left: {
    flex: 1,
    backgroundImage: `url(${Tooths})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "",
    padding: "40px",
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "16px",
  },
  // button: {
  //   background: "linear-gradient(135deg, #4997e0, #2edbd5)",
  //   marginTop: "10px",
  //   borderRadius: "8px",
  //   height: "45px",
  // },
};
