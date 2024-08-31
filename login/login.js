
function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Đảm bảo tên đăng nhập và mật khẩu không được để trống
    if (!username || !password) {
        alert('Vui lòng nhập đủ tên đăng nhập và mật khẩu.');
        return false; // Ngăn chặn form được submit
    }

    // Định nghĩa body của yêu cầu POST
    const body = {
        username: username,
        password: password
    };

    // Định nghĩa các options cho fetch
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(body)
    };


    fetch(`https://server-quizz.onrender.com/quiz/auth/token`, requestOptions)
        .then(response => {
            if (response.status === 401) {
                throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
            }
            if (!response.ok) {
                throw new Error('Đã xảy ra lỗi.');
            }
            return response.json(); // Chuyển đổi phản hồi thành JSON 
        })
        .then(data => {
            // Lưu trữ token vào local storage
            sessionStorage.setItem('token', data.result.token);

            // Giải mã token và kiểm tra quyền của người dùng
            const tokenData = parseJWT(data.result.token);
            if (tokenData.scope.includes('ADMIN')) {
                window.location.href = '/admin/html/TrangDashBoard.html'; // Chuyển hướng đến trang quản trị
            } else {
                window.location.href = '/user/html/home.html'; // Chuyển hướng đến trang người dùng thông thường
            }
        })
        .catch(error => {
            console.error('Đã xảy ra lỗi:', error);
        });

    return false; // Ngăn chặn form được submit

}

// Hàm để giải mã JWT Token và trả về các thông tin claims
function parseJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
