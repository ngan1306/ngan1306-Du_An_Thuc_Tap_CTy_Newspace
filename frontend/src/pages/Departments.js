import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from "../api";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [form] = Form.useForm();

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await getDepartments();
      setDepartments(response.data.departments);
    } catch (error) {
      message.error('Không thể tải danh sách bộ phận');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDept = () => {
    setEditingDept(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditDept = (dept) => {
    setEditingDept(dept);
    form.setFieldsValue(dept);
    setIsModalVisible(true);
  };

  const handleDeleteDept = (id) => {

    Modal.confirm({

        title: 'Xóa bộ phận',

        content: 'Bạn có chắc muốn xóa bộ phận này?',

        okText: 'Xóa',

        cancelText: 'Hủy',

        onOk: async () => {

            try {

                await deleteDepartment(id);

                message.success('Đã xóa');

                fetchDepartments();

            } catch {

                message.error('Không thể xóa');

            }

        }

    });

  };
  
  const handleSave = async (values) => {
    try {
      if (editingDept) {
        await updateDepartment(editingDept.id, values);
        message.success('Cập nhật thành công');
      } else {
        await createDepartment(values);
        message.success('Thêm bộ phận thành công');
      }
      setIsModalVisible(false);
      fetchDepartments();
    } catch (error) {
      message.error('Lỗi khi lưu bộ phận');
    }
  };

  const columns = [
    {
      title: 'Tên Bộ Phận',
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: 'Mã Bộ Phận',
      dataIndex: 'department_code',
      key: 'department_code',
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Ngân Sách',
      dataIndex: 'budget',
      key: 'budget',
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditDept(record)}
          >
            Sửa
          </Button>

          <Button
            danger
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteDept(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1>Quản Lý Bộ Phận</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDept}>
          Thêm Bộ Phận
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={departments}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingDept ? 'Chỉnh Sửa Bộ Phận' : 'Thêm Bộ Phận'}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="department_name" label="Tên Bộ Phận" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department_code" label="Mã Bộ Phận" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô Tả">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="budget" label="Ngân Sách">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Departments;
