import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Statistic,
  Spin,
  message,
} from "antd";

import {
  UserOutlined,
  LaptopOutlined,
  CheckCircleOutlined,
  BankOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { getDashboard } from "../api";

import "./Dashboard.css";

const { Content } = Layout;

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getDashboard();
      setDashboard(res.data);
    } catch (err) {
      console.log(err);
      message.error("Không tải được Dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <Content className="dashboard-content">
      <h1 style={{ marginBottom: 30 }}>
        Dashboard
      </h1>

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Người dùng"
              value={dashboard.total_users || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Nhân viên"
              value={dashboard.total_employees || 0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Thiết bị"
              value={dashboard.total_devices || 0}
              prefix={<LaptopOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Công việc"
              value={dashboard.total_tasks || 0}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Bộ phận"
              value={dashboard.total_departments || 0}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Dashboard;