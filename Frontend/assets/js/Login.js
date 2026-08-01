// Intercept browser back button
window.history.pushState(null, null, window.location.href);
window.addEventListener('popstate', function(event) {
    window.location.href = 'Intro.html';
});

// Auto Redirect
if(localStorage.getItem('token')) {
    window.location.href = 'Home.html';
}

// Show/Hide Password
const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');
togglePassword.addEventListener('click', function () {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if(document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// API Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        
        if(res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'Home.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch(err) {
        alert('Server error');
    }
});

// Forgot Password Logic
function openForgotPasswordModal(e) {
    if(e) e.preventDefault();
    document.getElementById('resetEmail').value = '';
    document.getElementById('resetPhone').value = '';
    document.getElementById('resetNewPassword').value = '';
    document.getElementById('forgotPasswordModal').classList.add('active');
}

function closeForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').classList.remove('active');
}

async function submitForgotPassword() {
    const email = document.getElementById('resetEmail').value.trim();
    const phone = document.getElementById('resetPhone').value.trim();
    const newPassword = document.getElementById('resetNewPassword').value;

    if (!email || !phone || !newPassword) {
        return alert("Please fill all fields");
    }

    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, phone, newPassword })
        });
        const data = await res.json();
        
        if (res.ok) {
            alert("Password reset successfully. You can now login with your new password.");
            closeForgotPasswordModal();
        } else {
            alert(data.message || "Failed to reset password.");
        }
    } catch (e) {
        alert("Server error");
    }
}
