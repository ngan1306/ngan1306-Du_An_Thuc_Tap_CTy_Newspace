import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const payload = {
        username: values.username,
        email: values.email,
        full_name: values.fullName,
        password: values.password,
        phone: values.phone
      };

      // ✅ Sửa URL API
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        payload
      );

      message.success(response.data.message || 'Đăng ký thành công!');
      navigate('/login');

    } catch (error) {
      console.error(error);

      message.error(
        error.response?.data?.error ||
        'Đăng ký thất bại. Vui lòng thử lại!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" style={{ maxWidth: 420 }}>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Tạo Tài Khoản Mới
          </h1>
          <p className="text-gray-500 mt-1">
            Tham gia quản lý thiết bị doanh nghiệp
          </p>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập họ tên!'
              }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nguyễn Văn A"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email!'
              },
              {
                type: 'email',
                message: 'Email không hợp lệ!'
              }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="example@gmail.com"
            />
          </Form.Item>

          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên đăng nhập!'
              }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!'
              },
              {
                min: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="0123456789"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Đăng Ký
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Đã có tài khoản?
            <Button
              type="link"
              onClick={() => navigate('/login')}
              className="p-0 ml-1"
            >
              Đăng nhập
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;