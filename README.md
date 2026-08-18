# 📊 Bảng Quản Lý Người Dùng

Ứng dụng web quản lý người dùng với chức năng đăng nhập, đăng ký và bảng điều khiển quản lý.

## ✨ Tính Năng

- 🔐 **Đăng nhập/Đăng ký** với mã hóa mật khẩu (bcryptjs)
- 📋 **Bảng quản lý người dùng** với các chức năng:
  - ➕ Thêm người dùng mới
  - ✏️ Sửa thông tin người dùng
  - 🗑️ Xóa người dùng
  - 👁️ Xem danh sách người dùng
- 🔒 **JWT Authentication** - Bảo mật API
- 💾 **SQLite Database** - Lưu trữ dữ liệu

## 🛠️ Công Nghệ Sử Dụng

**Frontend:**
- HTML5
- CSS3 (Responsive Design)
- Vanilla JavaScript (ES6+)

**Backend:**
- Node.js
- Express.js
- SQLite3
- JWT (JSON Web Tokens)
- bcryptjs (Password Hashing)

## 📁 Cấu Trúc Thư Mục

```
├── index.html              # Trang đăng nhập
├── dashboard.html          # Trang bảng điều khiển
├── styles.css              # Stylesheet
├── script.js               # Frontend JavaScript
├── server.js               # Express server
├── database.js             # SQLite configuration
├── package.json            # Dependencies
├── .env                    # Environment variables
├── middleware/
│   └── auth.js            # JWT authentication middleware
└── routes/
    └── api.js             # API routes
```

## 🚀 Cài Đặt và Chạy

### 1. Clone Repository
```bash
git clone https://github.com/lenhdenh/b-ng-qu-n-l-.git
cd b-ng-qu-n-l-
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Khởi Động Server
```bash
npm start
```

Hoặc với Nodemon (auto-reload):
```bash
npm run dev
```

### 4. Mở Trình Duyệt
Truy cập: `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /api/register` - Đăng ký người dùng mới
- `POST /api/login` - Đăng nhập

### User Management (Yêu cầu JWT Token)
- `GET /api/users` - Lấy danh sách tất cả người dùng
- `GET /api/users/:id` - Lấy thông tin người dùng theo ID
- `POST /api/users` - Tạo người dùng mới
- `PUT /api/users/:id` - Cập nhật thông tin người dùng
- `DELETE /api/users/:id` - Xóa người dùng

## 🔐 Bảo Mật

- ✅ Mật khẩu được mã hóa với bcryptjs
- ✅ JWT tokens cho xác thực API
- ✅ CORS enabled cho frontend communication
- ✅ Environment variables cho sensitive data

## 📋 Request/Response Examples

### Register
```bash
POST /api/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 1,
  "fullname": "John Doe"
}
```

### Get Users
```bash
GET /api/users
Authorization: Bearer <TOKEN>

Response:
[
  {
    "id": 1,
    "fullname": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15 10:30:00"
  }
]
```

## ⚙️ Environment Variables

Tạo file `.env` với nội dung:
```
PORT=3000
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=development
```

## 🐛 Troubleshooting

### Port 3000 đã được sử dụng?
Thay đổi PORT trong file `.env`:
```
PORT=3001
```

### Module not found?
```bash
npm install
```

### Database error?
Database sẽ tự động tạo khi server khởi động lần đầu tiên.

## 📱 Responsive Design

Ứng dụng tự động điều chỉnh cho:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 👤 Người Tạo

Tạo bởi: **lenhdenh**

## 📄 Giấy Phép

MIT License

## 🤝 Đóng Góp

Hãy fork repository này, tạo branch feature của bạn và gửi pull request!

---

**Chúc bạn sử dụng ứng dụng vui vẻ! 🎉**
