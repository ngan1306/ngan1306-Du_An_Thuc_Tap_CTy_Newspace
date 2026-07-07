import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
 CartesianGrid,
} from "recharts";

import {
  getReports,
  createReport,
  updateReport,
  deleteReport,
} from "../api";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const res = await getReports();

      const data = res.data.reports || [];

      setReports(data);

      setStatistics([
        {
          name: "Tổng báo cáo",
          value: data.length,
        },
      ]);
    } catch (error) {
      console.log(error);
      message.error("Không tải được báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReport = () => {
    setEditingReport(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditReport = (record) => {
    setEditingReport(record);

    form.setFieldsValue({
      report_name: record.report_name,
      report_type: record.report_type,
      description: record.description,
      export_format: record.export_format,
    });

    setIsModalVisible(true);
  };

  const handleDeleteReport = (id) => {
    Modal.confirm({
      title: "Xóa báo cáo",
      content: "Bạn có chắc chắn muốn xóa báo cáo này?",
      okText: "Xóa",
      cancelText: "Hủy",

      onOk: async () => {
        try {
          await deleteReport(id);

          message.success("Đã xóa báo cáo");

          fetchReports();
        } catch (error) {
          console.log(error);
          message.error("Xóa thất bại");
        }
      },
    });
  };

  const handleSave = async (values) => {
    try {
      if (editingReport) {
        await updateReport(editingReport.id, values);
        message.success("Cập nhật thành công");
      } else {
        await createReport(values);
        message.success("Thêm báo cáo thành công");
      }

      form.resetFields();
      setIsModalVisible(false);
      fetchReports();
    } catch (error) {
      console.log(error);
      message.error("Lưu thất bại");
    }
  };

  const handleExport = (format) => {
    message.success(`Xuất file ${format.toUpperCase()} thành công`);
  };

  const chartData = [
    {
      month: "T1",
      devices: 40,
      tasks: 25,
      employees: 15,
    },
    {
      month: "T2",
      devices: 45,
      tasks: 30,
      employees: 16,
    },
    {
      month: "T3",
      devices: 50,
      tasks: 35,
      employees: 17,
    },
    {
      month: "T4",
      devices: 55,
      tasks: 40,
      employees: 18,
    },
  ];

  const columns = [
    {
      title: "Tên báo cáo",
      dataIndex: "report_name",
      key: "report_name",
    },
    {
      title: "Loại",
      dataIndex: "report_type",
      key: "report_type",
      render: (value) => {
        switch (value) {
          case "device":
            return "Thiết bị";
          case "employee":
            return "Nhân viên";
          case "task":
            return "Công việc";
          case "department":
            return "Bộ phận";
          default:
            return value;
        }
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "-",
    },
    {
      title: "Định dạng",
      dataIndex: "export_format",
      key: "export_format",
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<FilePdfOutlined />}
            onClick={() => handleExport(record.export_format)}
          >
            Xuất
          </Button>

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditReport(record)}
          >
            Sửa
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteReport(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

    return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 20 }}>Báo Cáo & Thống Kê</h1>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        {statistics.map((item) => (
          <Col span={6} key={item.name}>
            <Card>
              <Statistic title={item.name} value={item.value} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Thống kê thiết bị">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="devices" fill="#1677ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Thống kê công việc">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#52c41a"
                />
                <Line
                  type="monotone"
                  dataKey="employees"
                  stroke="#fa8c16"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card
        title="Danh sách báo cáo"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddReport}
          >
            Tạo báo cáo
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={reports}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </Card>

      <Modal
        title={editingReport ? "Chỉnh sửa báo cáo" : "Thêm báo cáo"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
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
            label="Tên báo cáo"
            name="report_name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên báo cáo",
              },
            ]}
          >
            <Input placeholder="Nhập tên báo cáo" />
          </Form.Item>

          <Form.Item
            label="Loại báo cáo"
            name="report_type"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại báo cáo",
              },
            ]}
          >
            <Select
              options={[
                {
                  label: "Thiết bị",
                  value: "device",
                },
                {
                  label: "Công việc",
                  value: "task",
                },
                {
                  label: "Nhân viên",
                  value: "employee",
                },
                {
                  label: "Bộ phận",
                  value: "department",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập mô tả"
            />
          </Form.Item>

          <Form.Item
            label="Định dạng xuất"
            name="export_format"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn định dạng",
              },
            ]}
          >
            <Select
              options={[
                {
                  label: "PDF",
                  value: "pdf",
                },
                {
                  label: "Excel",
                  value: "excel",
                },
                {
                  label: "CSV",
                  value: "csv",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reports;