import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Input, Space, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form] = Form.useForm();

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);

    try {
      const response = await getUsers(page, pagination.pageSize);

      setUsers(response.data.users);

      setPagination((prev) => ({
        ...prev,
        current: page,
        total: response.data.total,
      }));
    } catch (error) {
      console.log(error);

      message.error(
        error.response?.data?.error ||
        "Không thể tải danh sách người dùng"
      );
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = (id) => {
    Modal.confirm({
      title: "Xóa Người Dùng",
      content: "Bạn có chắc chắn muốn xóa người dùng này?",

      onOk: async () => {
        try {
          await deleteUser(id);

          message.success("Xóa thành công");

          await fetchUsers();
        } catch (error) {
          console.log(error);

          message.error(
            error.response?.data?.error ||
            "Không thể xóa người dùng"
          );
        }
      },
    });
  };

  const handleSave = async (values) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values);

        message.success("Cập nhật thành công");
      } else {
        await createUser({
          ...values,
          password: values.password || "123456",
        });

        message.success("Thêm người dùng thành công");
      }

      form.resetFields();

      setIsModalVisible(false);

      await fetchUsers();
    } catch (error) {
      console.log(error);

      message.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Lỗi khi lưu người dùng"
      );
    }
  };

  const columns = [
    {
      title: "Tên Đăng Nhập",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Tên Đầy Đủ",
      dataIndex: "full_name",
    },
    {
      title: "Trạng Thái",
      dataIndex: "is_active",
      render: (value) => (value ? "Kích Hoạt" : "Vô Hiệu"),
    },
    {
      title: "Hành Động",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          />

          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h1>Quản Lý Tài Khoản</h1>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddUser}
        >
          Thêm Người Dùng
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={pagination}
        onChange={(page) => fetchUsers(page.current)}
      />

      <Modal
        title={
          editingUser
            ? "Chỉnh Sửa Người Dùng"
            : "Thêm Người Dùng"
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          {!editingUser && (
            <>
              <Form.Item
                name="username"
                label="Tên Đăng Nhập"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="full_name"
            label="Tên Đầy Đủ"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Điện Thoại"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;