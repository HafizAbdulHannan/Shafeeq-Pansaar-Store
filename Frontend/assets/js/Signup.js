// Auto Redirect
if(localStorage.getItem('token')) {
    window.location.href = 'Home.html';
}

// DOB to Age calculation
document.getElementById('dob').addEventListener('change', function() {
    const dob = new Date(this.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    document.getElementById('age').value = age;
});

// Wizard Logic
function nextStep(current) {
    // Validation
    if (current === 1) {
        if(!document.getElementById('name').value || !document.getElementById('dob').value || !document.getElementById('address').value) {
            return alert("Please fill all fields in step 1.");
        }
    } else if (current === 2) {
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        if(!phone || !email) return alert("Please fill all fields in step 2.");
        
        // Phone validation
        let isValidPhone = false;
        if (phone.startsWith('+92') && phone.length === 13) {
            isValidPhone = true;
        } else if (phone.startsWith('03') && phone.length === 11) {
            isValidPhone = true;
        }

        if (!isValidPhone) {
            return alert("Invalid Phone Number. Must start with +92 (13 chars) or 03 (11 chars).");
        }
    }

    document.getElementById(`step${current}`).classList.remove('active');
    document.getElementById(`step${current + 1}`).classList.add('active');
    document.getElementById(`dot${current + 1}`).classList.add('active');
}

function prevStep(current) {
    document.getElementById(`step${current}`).classList.remove('active');
    document.getElementById(`step${current - 1}`).classList.add('active');
    document.getElementById(`dot${current}`).classList.remove('active');
}

// Show/Hide Password
const toggle1 = document.getElementById('togglePassword1');
const pass1 = document.getElementById('password');
toggle1.addEventListener('click', function () {
    const type = pass1.getAttribute('type') === 'password' ? 'text' : 'password';
    pass1.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

const toggle2 = document.getElementById('togglePassword2');
const pass2 = document.getElementById('confirmPassword');
toggle2.addEventListener('click', function () {
    const type = pass2.getAttribute('type') === 'password' ? 'text' : 'password';
    pass2.setAttribute('type', type);
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

// API Signup
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const dob = document.getElementById('dob').value;
    const age = document.getElementById('age').value;
    const defaultAddress = document.getElementById('address').value;
    
    let phone = document.getElementById('phone').value.trim();
    if (phone.startsWith('03')) {
        phone = '+92' + phone.substring(1);
    }
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if(password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, dob, age, phone, defaultAddress })
        });
        const data = await res.json();
        
        if(res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'Home.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch(err) {
        alert('Server error');
    }
});
