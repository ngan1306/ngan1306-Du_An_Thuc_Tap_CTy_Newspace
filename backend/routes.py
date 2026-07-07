from flask import Blueprint, jsonify, request
from models import (
    db,
    User,
    Employee,
    Device,
    Task,
    Department,
    Role,
    Permission,
    Notification,
    AuditLog,
    Report
)
from datetime import datetime

auth_bp = Blueprint('auth', __name__)
users_bp = Blueprint('users', __name__)
devices_bp = Blueprint('devices', __name__)
tasks_bp = Blueprint('tasks', __name__)
departments_bp = Blueprint('departments', __name__)
storage_bp = Blueprint('storage', __name__)
roles_bp = Blueprint('roles', __name__)
notifications_bp = Blueprint('notifications', __name__)
logs_bp = Blueprint('logs', __name__)
reports_bp = Blueprint('reports', __name__)
employees_bp = Blueprint('employees', __name__)

# AUTH Routes
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    
    if not user or not user.check_password(data.get('password')):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'role_id': user.role_id,
        'department_id': user.department_id
    }), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        username = data.get('username')
        email = data.get('email')
        full_name = data.get('full_name')
        password = data.get('password')
        phone = data.get('phone')

        if not username or not email or not full_name or not password:
            return jsonify({
                'error': 'Vui lòng nhập đầy đủ thông tin.'
            }), 400

        if User.query.filter_by(username=username).first():
            return jsonify({
                'error': 'Tên đăng nhập đã tồn tại.'
            }), 400

        if User.query.filter_by(email=email).first():
            return jsonify({
                'error': 'Email đã tồn tại.'
            }), 400

        role = Role.query.filter_by(role_name='User').first()

        if role:
            role_id = role.id
        else:
            role_id = 3

        user = User(
            username=username,
            email=email,
            full_name=full_name,
            phone=phone,
            role_id=role_id,
            department_id=data.get("department_id")
        )

        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        return jsonify({
            "message": "Đăng ký thành công",
            "user_id": user.id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500

# USERS Routes
@users_bp.route('', methods=['GET'])
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    users = User.query.paginate(page=page, per_page=per_page)
    
    return jsonify({
        'users': [{
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'full_name': u.full_name,
            'department_id': u.department_id,
            'role_id': u.role_id,
            'is_active': u.is_active
        } for u in users.items],
        'total': users.total,
        'pages': users.pages,
        'current_page': page
    }), 200

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'phone': user.phone,
        'department_id': user.department_id,
        'role_id': user.role_id,
        'is_active': user.is_active
    }), 200

@users_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    user.email = data.get('email', user.email)
    user.full_name = data.get('full_name', user.full_name)
    user.phone = data.get('phone', user.phone)
    user.department_id = data.get('department_id', user.department_id)
    
    db.session.commit()
    return jsonify({'message': 'User updated'}), 200

@users_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200

# ===========================
# EMPLOYEES
# ===========================

@employees_bp.route('', methods=['GET'])
def get_employees():
    employees = Employee.query.all()

    result = []

    for emp in employees:

        user = User.query.get(emp.user_id)

        result.append({
            "id": emp.id,
            "user_id": emp.user_id,
            "employee_code": emp.employee_code,
            "full_name": user.full_name if user else "",
            "email": user.email if user else "",
            "phone": user.phone if user else "",
            "position": emp.position,
            "salary": emp.salary,
            "hire_date": emp.hire_date.strftime("%Y-%m-%d") if emp.hire_date else "",
            "contract_type": emp.contract_type,
            "status": emp.status
        })

    return jsonify({
        "employees": result
    }), 200


@employees_bp.route('', methods=['POST'])
def create_employee():
    try:

        data = request.get_json()

        user = User.query.get(data.get("user_id"))

        if not user:
            return jsonify({
                "error": "User không tồn tại."
            }), 400

        if Employee.query.filter_by(
                employee_code=data.get("employee_code")
        ).first():

            return jsonify({
                "error": "Mã nhân viên đã tồn tại."
            }), 400

        hire_date = None

        if data.get("hire_date"):
            hire_date = datetime.strptime(
                data.get("hire_date"),
                "%Y-%m-%d"
            ).date()

        employee = Employee(
            user_id=data.get("user_id"),
            employee_code=data.get("employee_code"),
            position=data.get("position"),
            salary=data.get("salary"),
            hire_date=hire_date,
            contract_type=data.get("contract_type"),
            manager_id=data.get("manager_id"),
            status=data.get("status", "active")
        )

        db.session.add(employee)
        db.session.commit()

        return jsonify({
            "message": "Thêm nhân viên thành công",
            "id": employee.id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500


@employees_bp.route('/<int:id>', methods=['PUT'])
def update_employee(id):

    emp = Employee.query.get_or_404(id)

    try:

        data = request.get_json()

        if "user_id" in data:
            user = User.query.get(data["user_id"])

            if not user:
                return jsonify({
                    "error": "User không tồn tại."
                }), 400

            emp.user_id = data["user_id"]

        if "employee_code" in data:
            check = Employee.query.filter(
                Employee.employee_code == data["employee_code"],
                Employee.id != id
            ).first()

            if check:
                return jsonify({
                    "error": "Mã nhân viên đã tồn tại."
                }), 400

            emp.employee_code = data["employee_code"]

        emp.position = data.get("position", emp.position)
        emp.salary = data.get("salary", emp.salary)
        emp.contract_type = data.get(
            "contract_type",
            emp.contract_type
        )

        emp.status = data.get(
            "status",
            emp.status
        )

        if data.get("hire_date"):
            emp.hire_date = datetime.strptime(
                data["hire_date"],
                "%Y-%m-%d"
            ).date()

        db.session.commit()

        return jsonify({
            "message": "Cập nhật thành công"
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500


@employees_bp.route('/<int:id>', methods=['DELETE'])
def delete_employee(id):

    emp = Employee.query.get_or_404(id)

    try:

        db.session.delete(emp)

        db.session.commit()

        return jsonify({
            "message": "Đã xóa nhân viên"
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500

# DEVICES Routes
@devices_bp.route('', methods=['GET'])
def get_devices():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status')
    
    query = Device.query
    if status:
        query = query.filter_by(status=status)
    
    devices = query.paginate(page=page, per_page=per_page)
    
    return jsonify({
        'devices': [{
            'id': d.id,
            'device_code': d.device_code,
            'device_name': d.device_name,
            'device_type': d.device_type,
            'status': d.status,
            'assigned_to': d.assigned_to,
            'department_id': d.department_id,
            'location': d.location,
            'price': d.price
        } for d in devices.items],
        'total': devices.total,
        'pages': devices.pages
    }), 200

@devices_bp.route('', methods=['POST'])
def create_device():
    data = request.get_json()
    
    device = Device(
        device_code=data.get('device_code'),
        device_name=data.get('device_name'),
        device_type=data.get('device_type'),
        status=data.get('status', 'available'),
        department_id=data.get('department_id'),
        location=data.get('location'),
        price=data.get('price')
    )
    
    db.session.add(device)
    db.session.commit()
    
    return jsonify({'message': 'Device created', 'device_id': device.id}), 201

@devices_bp.route('/<int:device_id>', methods=['PUT'])
def update_device(device_id):
    device = Device.query.get_or_404(device_id)
    data = request.get_json()
    
    device.device_name = data.get('device_name', device.device_name)
    device.status = data.get('status', device.status)
    device.assigned_to = data.get('assigned_to', device.assigned_to)
    device.location = data.get('location', device.location)
    
    db.session.commit()
    return jsonify({'message': 'Device updated'}), 200

# ===========================
# TASKS
# ===========================

@tasks_bp.route('', methods=['GET'])
def get_tasks():

    tasks = Task.query.all()

    return jsonify({
        "tasks": [
            {
                "id": t.id,
                "task_name": t.task_name,
                "description": t.description,
                "assigned_to": t.assigned_to,
                "status": t.status,
                "priority": t.priority,
                "progress": t.progress,
                "deadline": t.deadline.strftime("%Y-%m-%d") if t.deadline else ""
            }
            for t in tasks
        ]
    })


@tasks_bp.route('', methods=['POST'])
def create_task():
    data = request.get_json()

    task = Task(
        task_name=data.get("task_name"),
        description=data.get("description"),
        assigned_to=data.get("assigned_to", 1),   # mặc định user id =1
        status=data.get("status", "pending"),
        priority=data.get("priority", "medium"),
        progress=data.get("progress", 0),
        deadline=None,
        created_by=1
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({
        "message": "Task created",
        "task_id": task.id
    }), 201

@tasks_bp.route('/<int:id>', methods=['DELETE'])
def delete_task(id):

    task = Task.query.get_or_404(id)

    db.session.delete(task)
    db.session.commit()

    return jsonify({
        "message": "Deleted"
    })

# ===========================
# DEPARTMENTS
# ===========================

@departments_bp.route('', methods=['GET'])
def get_departments():

    departments = Department.query.all()

    return jsonify({
        "departments": [
            {
                "id": d.id,
                "department_name": d.department_name,
                "department_code": d.department_code,
                "description": d.description,
                "manager_id": d.manager_id,
                "budget": d.budget
            }
            for d in departments
        ]
    })


@departments_bp.route('', methods=['POST'])
def create_department():

    data = request.get_json()

    dept = Department(
        department_name=data["department_name"],
        department_code=data["department_code"],
        description=data.get("description"),
        manager_id=data.get("manager_id"),
        budget=data.get("budget")
    )

    db.session.add(dept)
    db.session.commit()

    return jsonify({
        "message": "Department created"
    }), 201


# UPDATE DEPARTMENT
@departments_bp.route('/<int:id>', methods=['PUT'])
def update_department(id):

    dept = Department.query.get_or_404(id)

    data = request.get_json()

    dept.department_name = data.get(
        "department_name",
        dept.department_name
    )

    dept.department_code = data.get(
        "department_code",
        dept.department_code
    )

    dept.description = data.get(
        "description",
        dept.description
    )

    dept.manager_id = data.get(
        "manager_id",
        dept.manager_id
    )

    dept.budget = data.get(
        "budget",
        dept.budget
    )

    db.session.commit()

    return jsonify({
        "message": "Department updated"
    })


# DELETE DEPARTMENT
@departments_bp.route('/<int:id>', methods=['DELETE'])
def delete_department(id):

    dept = Department.query.get_or_404(id)

    db.session.delete(dept)

    db.session.commit()

    return jsonify({
        "message": "Department deleted"
    })

# ===========================
# STORAGE
# ===========================

@storage_bp.route('', methods=['GET'])
def get_storage():

    storages = Storage.query.all()

    return jsonify({
        "storage": [
            {
                "id": s.id,
                "storage_name": s.storage_name,
                "storage_type": s.storage_type,
                "location": s.location,
                "capacity": s.capacity,
                "current_usage": s.current_usage,
                "responsible_user": s.responsible_user
            }
            for s in storages
        ]
    })


@storage_bp.route('', methods=['POST'])
def create_storage():

    data = request.get_json()

    storage = Storage(
        storage_name=data["storage_name"],
        storage_type=data.get("storage_type"),
        location=data.get("location"),
        capacity=data.get("capacity"),
        current_usage=data.get("current_usage", 0),
        responsible_user=data.get("responsible_user")
    )

    db.session.add(storage)
    db.session.commit()

    return jsonify({
        "message": "Storage created"
    }), 201


@storage_bp.route('/<int:id>', methods=['PUT'])
def update_storage(id):

    storage = Storage.query.get_or_404(id)

    data = request.get_json()

    storage.storage_name = data.get(
        "storage_name",
        storage.storage_name
    )

    storage.storage_type = data.get(
        "storage_type",
        storage.storage_type
    )

    storage.location = data.get(
        "location",
        storage.location
    )

    storage.capacity = data.get(
        "capacity",
        storage.capacity
    )

    storage.current_usage = data.get(
        "current_usage",
        storage.current_usage
    )

    storage.responsible_user = data.get(
        "responsible_user",
        storage.responsible_user
    )

    db.session.commit()

    return jsonify({
        "message": "Storage updated"
    })


@storage_bp.route('/<int:id>', methods=['DELETE'])
def delete_storage(id):

    storage = Storage.query.get_or_404(id)

    db.session.delete(storage)
    db.session.commit()

    return jsonify({
        "message": "Storage deleted"
    })

# ===========================
# ROLES
# ===========================

@roles_bp.route('', methods=['GET'])
def get_roles():

    roles = Role.query.all()

    return jsonify({
        "roles":[
            {
                "id":r.id,
                "role_name":r.role_name,
                "description":r.description
            }
            for r in roles
        ]
    })


# ===========================
# PERMISSIONS
# ===========================

@roles_bp.route('/permissions', methods=['GET'])
def get_permissions():

    permissions = Permission.query.all()

    return jsonify({
        "permissions":[
            {
                "id":p.id,
                "permission_name":p.permission_name,
                "module":p.module,
                "description":p.description
            }
            for p in permissions
        ]
    })


@roles_bp.route('/permissions', methods=['POST'])
def create_permission():

    data = request.get_json()

    permission = Permission(
        permission_name=data["permission_name"],
        module=data.get("module"),
        description=data.get("description")
    )

    db.session.add(permission)
    db.session.commit()

    return jsonify({
        "message":"Permission created"
    }),201


@roles_bp.route('/permissions/<int:id>', methods=['PUT'])
def update_permission(id):

    permission = Permission.query.get_or_404(id)

    data = request.get_json()

    permission.permission_name = data.get(
        "permission_name",
        permission.permission_name
    )

    permission.module = data.get(
        "module",
        permission.module
    )

    permission.description = data.get(
        "description",
        permission.description
    )

    db.session.commit()

    return jsonify({
        "message":"Permission updated"
    })


@roles_bp.route('/permissions/<int:id>', methods=['DELETE'])
def delete_permission(id):

    permission = Permission.query.get_or_404(id)

    db.session.delete(permission)

    db.session.commit()

    return jsonify({
        "message":"Permission deleted"
    })

# NOTIFICATIONS Routes
@notifications_bp.route('', methods=['GET'])
def get_notifications():
    user_id = request.args.get('user_id', type=int)
    
    query = Notification.query
    if user_id:
        query = query.filter_by(user_id=user_id)
    
    notifications = query.order_by(Notification.created_at.desc()).limit(10).all()
    
    return jsonify({
        'notifications': [{
            'id': n.id,
            'title': n.title,
            'message': n.message,
            'is_read': n.is_read,
            'created_at': n.created_at.isoformat()
        } for n in notifications]
    }), 200

# LOGS Routes
@logs_bp.route('', methods=['GET'])
def get_logs():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    logs = AuditLog.query.order_by(AuditLog.created_at.desc()).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'logs': [{
            'id': l.id,
            'user_id': l.user_id,
            'action': l.action,
            'module': l.module,
            'entity_type': l.entity_type,
            'created_at': l.created_at.isoformat()
        } for l in logs.items],
        'total': logs.total,
        'pages': logs.pages
    }), 200

# ===========================
# REPORTS
# ===========================

@reports_bp.route('', methods=['GET'])
def get_reports():

    reports = Report.query.order_by(
        Report.created_at.desc()
    ).all()

    return jsonify({

        "reports":[

            {

                "id":r.id,

                "report_name":r.report_name,

                "report_type":r.report_type,

                "description":r.description,

                "export_format":r.export_format,

                "created_at":r.created_at.strftime("%Y-%m-%d")

            }

            for r in reports

        ]

    })


@reports_bp.route('', methods=['POST'])
def create_report():

    data=request.get_json()

    report=Report(

        report_name=data["report_name"],

        report_type=data["report_type"],

        description=data.get("description"),

        export_format=data["export_format"],

        created_by=1

    )

    db.session.add(report)

    db.session.commit()

    return jsonify({

        "message":"Created"

    })


@reports_bp.route('/<int:id>',methods=['PUT'])
def update_report(id):

    report=Report.query.get_or_404(id)

    data=request.get_json()

    report.report_name=data["report_name"]

    report.report_type=data["report_type"]

    report.description=data.get("description")

    report.export_format=data["export_format"]

    db.session.commit()

    return jsonify({

        "message":"Updated"

    })


@reports_bp.route('/<int:id>',methods=['DELETE'])
def delete_report(id):

    report=Report.query.get_or_404(id)

    db.session.delete(report)

    db.session.commit()

    return jsonify({

        "message":"Deleted"

    })