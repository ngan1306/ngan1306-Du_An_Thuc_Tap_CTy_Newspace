# Quick Start Guide

## Các Bước Chạy Ứng Dụng

### Bước 1: Chuẩn Bị Database

1. Cài đặt PostgreSQL (nếu chưa có)
2. Tạo database:
   ```bash
   psql -U postgres -c "CREATE DATABASE enterprise_management;"
   ```
3. Import schema:
   ```bash
   psql -U postgres -d enterprise_management -f database/schema.sql
   ```

### Bước 2: Chạy Backend

```bash
cd backend

# Tạo virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# hoặc
source venv/bin/activate  # macOS/Linux

# Cài đặt dependencies
pip install -r requirements.txt

# Cấu hình .env
# Sửa DATABASE_URL nếu cần (mặc định: postgresql://user:password@localhost:5432/enterprise_management)

# Chạy server
python app.py
```

**Backend URL**: http://localhost:5000

### Bước 3: Chạy Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

**Frontend URL**: http://localhost:3000

## Đăng Nhập

- **Username**: admin
- **Password**: admin123

## Các Module Có Sẵn

✅ Dashboard - Bảng điều khiển tổng quan
✅ Tài Khoản - Quản lý người dùng
✅ Thiết Bị - Quản lý thiết bị
✅ Công Việc - Quản lý công việc
✅ Bộ Phận - Quản lý bộ phận
⏳ Bộ Lưu Trữ, Phân Quyền, Thông Báo, Nhật Ký, Báo Cáo (sẽ phát triển thêm)

## Troubleshooting

### Database Connection Error
- Kiểm tra PostgreSQL đang chạy
- Sửa DATABASE_URL trong backend/.env

### CORS Error
- Kiểm tra cấu hình CORS trong app.py
- Đảm bảo frontend URL là http://localhost:3000

### Port Already in Use
```bash
# Backend port 5000
netstat -ano | findstr :5000  # Windows
# Kill the process and restart

# Frontend port 3000
# Ctrl+C để dừng, sau đó chạy lại `npm start`
```

## Cấu Hình Thêm

### Thay Đổi Port Backend

Sửa trong `backend/app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Port 5001 thay vì 5000
```

### Thay Đổi Port Frontend

```bash
PORT=3001 npm start  # macOS/Linux
set PORT=3001 && npm start  # Windows
```

---

Chúc bạn sử dụng ứng dụng vui vẻ! 🎉
