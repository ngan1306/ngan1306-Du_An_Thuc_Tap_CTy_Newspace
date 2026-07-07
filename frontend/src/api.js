import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= AUTH =================

export const login = (username, password) =>
  api.post("/auth/login", { username, password });

export const register = (userData) =>
  api.post("/auth/register", userData);

// ================= USERS =================

export const getUsers = (page = 1, per_page = 10) =>
  api.get("/users", {
    params: { page, per_page },
  });

export const getUser = (id) =>
  api.get(`/users/${id}`);

export const createUser = (data) =>
  api.post("/auth/register", data);

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data);

export const deleteUser = (id) =>
  api.delete(`/users/${id}`);

// ================= EMPLOYEES =================

export const getEmployees = () =>
  api.get("/employees");

export const createEmployee = (data) =>
  api.post("/employees", data);

export const updateEmployee = (id, data) =>
  api.put(`/employees/${id}`, data);

export const deleteEmployee = (id) =>
  api.delete(`/employees/${id}`);

// ================= DEVICES =================

export const getDevices = () =>
  api.get("/devices");

export const createDevice = (data) =>
  api.post("/devices", data);

export const updateDevice = (id, data) =>
  api.put(`/devices/${id}`, data);

export const deleteDevice = (id) =>
  api.delete(`/devices/${id}`);

// ================= TASKS =================

export const getTasks = () =>
  api.get("/tasks");

export const createTask = (data) =>
  api.post("/tasks", data);

export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);

// ================= DEPARTMENTS =================

export const getDepartments = () =>
  api.get("/departments");

export const createDepartment = (data) =>
  api.post("/departments", data);

export const updateDepartment = (id, data) =>
  api.put(`/departments/${id}`, data);

export const deleteDepartment = (id) =>
  api.delete(`/departments/${id}`);

// ================= STORAGE =================

export const getStorage = () =>
  api.get("/storage");

export const createStorage = (data) =>
  api.post("/storage", data);

export const updateStorage = (id, data) =>
  api.put(`/storage/${id}`, data);

export const deleteStorage = (id) =>
  api.delete(`/storage/${id}`);

// ================= PERMISSIONS =================

export const getPermissions = () =>
  api.get("/roles");

export const createPermission = (data) =>
  api.post("/roles", data);

export const updatePermission = (id, data) =>
  api.put(`/roles/${id}`, data);

export const deletePermission = (id) =>
  api.delete(`/roles/${id}`);

// ================= NOTIFICATIONS =================

export const getNotifications = () =>
  api.get("/notifications");

export const createNotification = (data) =>
  api.post("/notifications", data);

export const updateNotification = (id, data) =>
  api.put(`/notifications/${id}`, data);

export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}`);

// ================= LOGS =================

export const getLogs = () =>
  api.get("/logs");

// ================= REPORTS =================

export const getReports = () =>
  api.get("/reports");

export const createReport = (data) =>
  api.post("/reports", data);

export const updateReport = (id, data) =>
  api.put(`/reports/${id}`, data);

export const deleteReport = (id) =>
  api.delete(`/reports/${id}`);

// ================= DASHBOARD =================

export const getDashboard = () =>
  api.get("/dashboard");

// ================= INTERCEPTOR =================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else {
      console.error("Network Error");
    }
    return Promise.reject(error);
  }
);

export default api;