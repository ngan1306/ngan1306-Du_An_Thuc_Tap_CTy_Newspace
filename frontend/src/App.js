import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import Login from './pages/Login';
import Register from './pages/Register';     // ← Thêm dòng này
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Devices from './pages/Devices';
import Tasks from './pages/Tasks';
import Departments from './pages/Departments';
import Storage from './pages/Storage';
import Permissions from './pages/Permissions';
import Notifications from './pages/Notifications';
import Logs from './pages/Logs';
import Reports from './pages/Reports';
import Employees from './pages/Employees';
import MainLayout from './components/Layout';
import Profile from "./pages/Profile";
import { useAuth, AuthProvider } from './context/AuthContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />   {/* ← Thêm route này */}
      <Route path="/profile" element={<Profile />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      
      {/* Các route khác giữ nguyên */}
      <Route path="/users" element={<PrivateRoute><MainLayout><Users /></MainLayout></PrivateRoute>} />
      <Route path="/devices" element={<PrivateRoute><MainLayout><Devices /></MainLayout></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><MainLayout><Tasks /></MainLayout></PrivateRoute>} />
      <Route path="/departments" element={<PrivateRoute><MainLayout><Departments /></MainLayout></PrivateRoute>} />
      <Route path="/storage" element={<PrivateRoute><MainLayout><Storage /></MainLayout></PrivateRoute>} />
      <Route path="/permissions" element={<PrivateRoute><MainLayout><Permissions /></MainLayout></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><MainLayout><Notifications /></MainLayout></PrivateRoute>} />
      <Route path="/logs" element={<PrivateRoute><MainLayout><Logs /></MainLayout></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><MainLayout><Reports /></MainLayout></PrivateRoute>} />
      <Route path="/employees" element={<PrivateRoute><MainLayout><Employees /></MainLayout></PrivateRoute>} />

      <Route path="/" element={<Navigate to="/login" />} />   {/* Mặc định về login */}
    </Routes>
  );
}

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;