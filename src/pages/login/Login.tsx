import { Form, Input, Button, Typography, Card, Image, Grid } from "antd";
import { LockOutlined, PhoneOutlined } from "@ant-design/icons";
import ToothLogo from "../../assets/images/toothLogo.jpg";
import Tooths from "../../assets/images/dentist2.jpg";
import { fontSizes } from "../../app/constant";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const Login = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const { phone, password } = values;
      const email = `${phone}@themoon.com`;

      const data = await authService.login(email, password);

      if (!data.user) {
        navigate("/login");
      }

      navigate("/");

      console.log(data);
    } catch (error: any) {
      console.log(error);
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

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
                // { type: "integer", message: "Invalid phone number" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="09XXXXXXXXX"
                size="large"
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
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={styles.button}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          {/* <Text type="secondary" style={{ textAlign: "center", display: "block" }}>
            © 2026 Dental Clinic System
          </Text> */}
        </Card>
      </div>
    </div>
  );
};

export default Login;

const styles: any = {
  container: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "row",
  },
  left: {
    flex: 1,
    // background: "linear-gradient(135deg, #1890ff, #36cfc9)",
    backgroundImage: `url(${Tooths})`, // or any image
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
