# Hướng Dẫn Phát Triển

## Cấu Trúc Dự Án

```
du_an_truong/
├── backend/                           # Flask Backend
│   ├── app.py                        # Main application
│   ├── config.py                     # Configuration management
│   ├── models.py                     # SQLAlchemy models
│   ├── routes.py                     # API routes
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment template
│   └── venv/                         # Virtual environment
├── frontend/                          # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Users.js
│   │   │   ├── Devices.js
│   │   │   ├── Tasks.js
│   │   │   ├── Departments.js
│   │   │   ├── Storage.js
│   │   │   ├── Permissions.js
│   │   │   ├── Notifications.js
│   │   │   ├── Logs.js
│   │   │   ├── Reports.js
│   │   │   └── Employees.js
│   │   ├── components/              # Reusable components
│   │   │   └── Layout.js
│   │   ├── context/                 # React Context
│   │   │   └── AuthContext.js
│   │   ├── api.js                   # Axios API client
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # Entry point
│   ├── package.json
│   ├── .env.example
│   └── node_modules/
├── database/
│   └── schema.sql                   # PostgreSQL schema
├── README.md                        # Main documentation
├── QUICKSTART.md                    # Quick start guide
├── DEVELOPMENT.md                   # This file
├── .gitignore
└── package.json                     # Root package.json
```

## Backend Architecture

### Models (models.py)
- **User**: Người dùng hệ thống
- **Device**: Thiết bị doanh nghiệp
- **Task**: Công việc cần thực hiện
- **Department**: Bộ phận
- **Employee**: Nhân viên
- **Role**: Vai trò người dùng
- **Permission**: Quyền hạn
- **Storage**: Kho lưu trữ
- **StorageItem**: Vật phẩm trong kho
- **Notification**: Thông báo
- **AuditLog**: Nhật ký hoạt động
- **Report**: Báo cáo
- **Statistic**: Thống kê

### Routes (routes.py)

10 blueprint chính:
1. `auth_bp` - Authentication
2. `users_bp` - User management
3. `devices_bp` - Device management
4. `tasks_bp` - Task management
5. `departments_bp` - Department management
6. `storage_bp` - Storage management
7. `roles_bp` - Role management
8. `notifications_bp` - Notifications
9. `logs_bp` - Audit logs
10. `reports_bp` - Reports

## Frontend Architecture

### Components
- **Layout** - Main layout wrapper with sidebar navigation
- **Login** - Authentication page
- **Dashboard** - Overview statistics

### Pages (10 modules)
1. **Dashboard** - Bảng điều khiển
2. **Users** - Quản lý tài khoản
3. **Devices** - Quản lý thiết bị
4. **Tasks** - Quản lý công việc
5. **Departments** - Quản lý bộ phận
6. **Storage** - Quản lý kho lưu trữ
7. **Permissions** - Phân quyền
8. **Notifications** - Thông báo
9. **Logs** - Nhật ký
10. **Reports** - Báo cáo & thống kê

### Context
- **AuthContext** - Quản lý trạng thái đăng nhập

### API Client (api.js)
Centralized axios configuration với các method:
- Authentication
- User CRUD
- Device CRUD
- Task CRUD
- Department CRUD
- Và hơn thế nữa

## Phát Triển Tính Năng Mới

### Thêm Endpoint Backend

1. **Thêm model** vào `models.py`:
```python
class NewEntity(db.Model):
    __tablename__ = 'new_entity'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    # ... more fields
```

2. **Thêm routes** vào `routes.py`:
```python
new_entity_bp = Blueprint('new_entity', __name__)

@new_entity_bp.route('', methods=['GET'])
def get_entities():
    entities = NewEntity.query.all()
    return jsonify([...])
```

3. **Register blueprint** trong `app.py`:
```python
app.register_blueprint(new_entity_bp, url_prefix='/api/new_entity')
```

### Thêm Page Frontend

1. **Tạo component** trong `src/pages/`:
```javascript
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'antd';

const NewPage = () => {
  // Component logic
};

export default NewPage;
```

2. **Thêm route** trong `App.js`:
```javascript
<Route
  path="/new-page"
  element={
    <PrivateRoute>
      <MainLayout>
        <NewPage />
      </MainLayout>
    </PrivateRoute>
  }
/>
```

3. **Thêm navigation** trong `Layout.js`:
```javascript
{
  key: '/new-page',
  icon: <SomeIcon />,
  label: <Link to="/new-page">New Page</Link>,
}
```

4. **Thêm API call** trong `src/api.js`:
```javascript
export const getNewEntities = () => api.get('/new_entity');
export const createNewEntity = (data) => api.post('/new_entity', data);
```

## Testing

### Backend Testing
```bash
cd backend
python -m pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Linting & Formatting

### Backend (Python)
```bash
cd backend
pip install flake8 black
flake8 .
black .
```

### Frontend (JavaScript)
```bash
cd frontend
npm install --save-dev eslint prettier
npm run lint
npm run format
```

## Deployment

### Docker (Optional)

#### Backend Dockerfile
```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Variables

**Backend (.env)**
```
FLASK_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/enterprise_management
JWT_SECRET_KEY=your-secure-key
```

**Frontend (.env.production)**
```
REACT_APP_API_URL=https://api.yourdomain.com
```

## Troubleshooting

### Database Issues
- Kiểm tra PostgreSQL connection
- Verify schema imported correctly
- Check database user permissions

### API Errors
- Check backend logs
- Verify API URL configuration
- Check CORS settings

### Frontend Issues
- Clear node_modules and reinstall
- Check React version compatibility
- Verify API responses in browser console

## Performance Optimization

### Backend
- Add database indexes
- Implement caching (Redis)
- Optimize queries with eager loading
- Use pagination for large datasets

### Frontend
- Code splitting with React.lazy()
- Optimize images
- Minimize bundle size
- Use React.memo for expensive components

## Security Best Practices

1. Change default JWT secret key
2. Use HTTPS in production
3. Implement rate limiting
4. Validate all user input
5. Use environment variables for secrets
6. Keep dependencies updated
7. Implement CORS properly
8. Add authentication to all endpoints

## Resources

- Flask Documentation: https://flask.palletsprojects.com/
- React Documentation: https://react.dev/
- Ant Design: https://ant.design/
- SQLAlchemy: https://www.sqlalchemy.org/
- PostgreSQL: https://www.postgresql.org/

---

Chúc vui khi phát triển! 🚀
