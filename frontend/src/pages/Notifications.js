import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message } from 'antd';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      // Simulate API call
      const mockData = [
        { id: 1, title: 'Thiết bị mới được thêm', message: 'Laptop mới được thêm vào hệ thống', type: 'info', is_read: false, created_at: '2024-01-15 10:30' },
        { id: 2, title: 'Công việc hoàn thành', message: 'Công việc "Setup" đã hoàn thành', type: 'success', is_read: false, created_at: '2024-01-15 09:15' },
        { id: 3, title: 'Thiết bị hỏng', message: 'Printer cần bảo trì', type: 'warning', is_read: true, created_at: '2024-01-14 14:20' },
        { id: 4, title: 'Deadline gần', message: 'Công việc sắp đến hạn', type: 'error', is_read: true, created_at: '2024-01-14 11:00' },
      ];
      setNotifications(mockData);
      setPagination({ current: page, pageSize: 10, total: mockData.length });
    } catch (error) {
      message.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    message.success('Đã đánh dấu là đã đọc');
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    message.success('Xóa thành công');
  };

  const getTypeColor = (type) => {
    const colors = { success: 'green', warning: 'orange', error: 'red', info: 'blue' };
    return colors[type] || 'blue';
  };

  const columns = [
    { 
      title: 'Tiêu Đề', 
      dataIndex: 'title', 
      key: 'title',
      render: (text, record) => (
        <span style={{ fontWeight: record.is_read ? 'normal' : 'bold' }}>
          {text}
        </span>
      )
    },
    { 
      title: 'Nội Dung', 
      dataIndex: 'message', 
      key: 'message',
      render: (text, record) => (
        <span style={{ color: record.is_read ? '#999' : '#000' }}>
          {text}
        </span>
      )
    },
    { 
      title: 'Loại', 
      dataIndex: 'type', 
      key: 'type',
      render: (type) => <Tag color={getTypeColor(type)}>{type}</Tag>
    },
    { title: 'Thời Gian', dataIndex: 'created_at', key: 'created_at' },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space>
          {!record.is_read && (
            <Button type="link" icon={<CheckOutlined />} onClick={() => handleMarkAsRead(record.id)} title="Đánh dấu đã đọc" />
          )}
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Thông Báo</h1>
      </div>

      <Table
        columns={columns}
        dataSource={notifications}
        loading={loading}
        pagination={pagination}
        onChange={(pag) => fetchNotifications(pag.current)}
        rowKey="id"
      />
    </div>
  );
};

export default Notifications;
