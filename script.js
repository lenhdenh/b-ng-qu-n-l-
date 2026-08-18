// API BASE URL
const API_BASE = 'http://localhost:3000/api';

// LOGIN FUNCTIONALITY
const loginForm = document.getElementById('loginForm');
const signupBtn = document.getElementById('signupBtn');
const signupModal = document.getElementById('signupModal');
const signupForm = document.getElementById('signupForm');
const closeModal = document.querySelector('.close');

// Open signup modal
signupBtn.addEventListener('click', () => {
    signupModal.style.display = 'block';
});

// Close signup modal
closeModal.addEventListener('click', () => {
    signupModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === signupModal) {
        signupModal.style.display = 'none';
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            window.location.href = 'dashboard.html';
        } else {
            alert('Đăng nhập thất bại: ' + data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Lỗi kết nối tới server');
    }
});

// Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Mật khẩu không khớp');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullname, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            signupForm.reset();
            signupModal.style.display = 'none';
        } else {
            alert('Đăng ký thất bại: ' + data.message);
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Lỗi kết nối tới server');
    }
});

// DASHBOARD FUNCTIONALITY
async function loadUsers() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = 'index.html';
            return;
        }

        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Load users error:', error);
        alert('Lỗi khi tải danh sách người dùng');
    }
}

function displayUsers(users) {
    const tableBody = document.querySelector('table tbody');
    
    if (!tableBody) return;

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="empty-message">Không có người dùng nào</td></tr>';
        return;
    }

    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.fullname}</td>
            <td>${user.email}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editUser(${user.id})">Sửa</button>
                    <button class="btn-delete" onclick="deleteUser(${user.id})">Xóa</button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function addUser() {
    const fullname = document.getElementById('newFullname')?.value;
    const email = document.getElementById('newEmail')?.value;
    const password = document.getElementById('newPassword')?.value;
    const token = localStorage.getItem('token');

    if (!fullname || !email || !password) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ fullname, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Thêm người dùng thành công');
            document.getElementById('newFullname').value = '';
            document.getElementById('newEmail').value = '';
            document.getElementById('newPassword').value = '';
            loadUsers();
        } else {
            alert('Lỗi: ' + data.message);
        }
    } catch (error) {
        console.error('Add user error:', error);
        alert('Lỗi kết nối tới server');
    }
}

async function deleteUser(userId) {
    if (!confirm('Bạn chắc chắn muốn xóa người dùng này?')) {
        return;
    }

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Xóa thành công');
            loadUsers();
        } else {
            const data = await response.json();
            alert('Lỗi: ' + data.message);
        }
    } catch (error) {
        console.error('Delete user error:', error);
        alert('Lỗi kết nối tới server');
    }
}

function editUser(userId) {
    const newFullname = prompt('Nhập họ và tên mới:');
    if (!newFullname) return;

    const token = localStorage.getItem('token');

    fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullname: newFullname })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cập nhật thành công');
                loadUsers();
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Edit user error:', error);
            alert('Lỗi kết nối tới server');
        });
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

// Load users on dashboard page load
if (document.querySelector('table')) {
    loadUsers();
}
