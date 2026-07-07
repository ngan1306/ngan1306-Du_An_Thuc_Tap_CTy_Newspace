import React, { useState } from "react";
import {
  Card,
  Avatar,
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";

import {
  UserOutlined,
  MailOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

import { updateUser } from "../api";

import "./Profile.css";

const Profile = () => {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const handleEdit = () => {
    form.setFieldsValue({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
    });

    setOpen(true);
  };

  const handleSave = async (values) => {
    try {
      await updateUser(user.id, values);

      const newUser = {
        ...user,
        ...values,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(newUser)
      );

      setUser(newUser);

      setOpen(false);

      message.success("Cập nhật thành công");
    } catch (error) {
      console.log(error);
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="profile-container">
      <Card
        className="profile-card"
        title="Hồ Sơ Cá Nhân"
      >
        <div className="profile-header">
          <Avatar
            size={110}
            icon={<UserOutlined />}
            className="profile-avatar"
          />

          <div className="profile-name">
            {user.full_name || "Administrator"}
          </div>

          <div className="profile-role">
            Quản trị hệ thống
          </div>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item
            label={
              <>
                <UserOutlined /> Họ tên
              </>
            }
          >
            {user.full_name || "Chưa có"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <>
                <UserOutlined /> Tên đăng nhập
              </>
            }
          >
            {user.username || "Chưa có"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <>
                <MailOutlined /> Email
              </>
            }
          >
            {user.email || "Chưa có"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <>
                <PhoneOutlined /> Số điện thoại
              </>
            }
          >
            {user.phone || "Chưa có"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <>
                <TeamOutlined /> Phòng ban
              </>
            }
          >
            {user.department_id || "Chưa có"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <>
                <SafetyCertificateOutlined /> Vai trò
              </>
            }
          >
            {user.role_id || "Chưa có"}
          </Descriptions.Item>
        </Descriptions>

        <div className="profile-footer">
          <Button
            type="primary"
            onClick={handleEdit}
          >
            Chỉnh sửa thông tin
          </Button>
        </div>
      </Card>

      <Modal
        title="Chỉnh sửa hồ sơ"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            label="Họ tên"
            name="full_name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ tên",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;