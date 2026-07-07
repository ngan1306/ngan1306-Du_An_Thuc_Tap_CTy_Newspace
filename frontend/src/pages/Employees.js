import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form] = Form.useForm();

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const res = await getEmployees();

      setEmployees(res.data.employees || []);
    } catch (err) {
      console.log(err);
      message.error("Không tải được danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setVisible(true);
  };

  const openEdit = (record) => {
    setEditing(record);

    form.setFieldsValue({
      ...record,
      hire_date: record.hire_date?.substring(0, 10),
    });

    setVisible(true);
  };

  const saveEmployee = async (values) => {
    try {
      if (editing) {
        await updateEmployee(editing.id, values);
        message.success("Cập nhật thành công");
      } else {
        await createEmployee(values);
        message.success("Thêm nhân viên thành công");
      }

      setVisible(false);
      form.resetFields();
      loadEmployees();
    } catch (err) {
      console.log(err);

      message.error(
        err.response?.data?.error || "Không thể lưu nhân viên"
      );
    }
  };

  const removeEmployee = async (id) => {
    try {
      await deleteEmployee(id);

      message.success("Đã xóa");

      loadEmployees();
    } catch (err) {
      console.log(err);

      message.error("Không thể xóa");
    }
  };

  const columns = [
    {
      title: "Mã NV",
      dataIndex: "employee_code",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
    },
    {
      title: "Lương",
      dataIndex: "salary",
      render: (value) =>
        value
          ? Number(value).toLocaleString() + " đ"
          : "",
    },
    {
      title: "Ngày tuyển",
      dataIndex: "hire_date",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (value) => {
        if (value === "active") return "Đang làm";
        if (value === "on_leave") return "Nghỉ phép";
        return "Nghỉ việc";
      },
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => openEdit(record)}
          />

          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => removeEmployee(record.id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2>Quản lý nhân sự</h2>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAdd}
        >
          Thêm nhân viên
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={employees}
      />

      <Modal
        open={visible}
        title={
          editing
            ? "Cập nhật nhân viên"
            : "Thêm nhân viên"
        }
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={saveEmployee}
        >
          <Form.Item
            name="user_id"
            label="User ID"
            rules={[
              {
                required: true,
                message: "Nhập User ID",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="employee_code"
            label="Mã nhân viên"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="position"
            label="Chức vụ"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="salary"
            label="Lương"
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="hire_date"
            label="Ngày tuyển"
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="contract_type"
            label="Loại hợp đồng"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="active"
          >
            <Select
              options={[
                {
                  value: "active",
                  label: "Đang làm",
                },
                {
                  value: "on_leave",
                  label: "Nghỉ phép",
                },
                {
                  value: "inactive",
                  label: "Nghỉ việc",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;