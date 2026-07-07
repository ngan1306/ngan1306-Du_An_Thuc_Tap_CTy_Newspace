import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await login(values.username, values.password);
      message.success('Đăng nhập thành công!');
      navigate('/dashboard');
    } catch (error) {
      message.error(error.response?.data?.error || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Quản Lý Thiết Bị Doanh Nghiệp
          </h1>
          <p className="text-gray-500 mt-1">Hệ thống quản lý thiết bị nội bộ</p>
        </div>

        <Form
          name="login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Tên đăng nhập hoặc Email" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Mật khẩu" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>

        {/* Nút Đăng Ký mới thêm */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Chưa có tài khoản? 
            <Button 
              type="link" 
              onClick={() => navigate('/register')}
              className="text-blue-600 font-medium p-0 ml-1"
            >
              Đăng ký ngay
            </Button>
          </p>
        </div>

        <p className="demo-text text-center text-xs text-gray-500 mt-6">
          Demo: admin / admin123
        </p>
      </Card>
    </div>
  );
};

export default Login;