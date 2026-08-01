const fs = require('fs');

try {
    // ---- HOME.HTML ----
    const file = 'c:/Users/Hafiz Abdul Hannan/Desktop/MERN/Shafeeq Pansaar Store/Frontend/Home.html';
    let content = fs.readFileSync(file, 'utf8');

    const arrayRegex = /\/\/ Dummy Product Data\s*const products = \[[\s\S]*?\];/;
    content = content.replace(arrayRegex, "let products = [];");

    content = content.replace("addToCart(${p.id})", "addToCart('${p._id}')");
    content = content.replace("function addToCart(id) {", "function addToCart(id) {");
    content = content.replace("products.find(p => p.id === id)", "products.find(p => p._id === id)");
    content = content.replace("cart.find(item => item.id === id)", "cart.find(item => item._id === id)");
    content = content.replace("removeFromCart(${item.id})", "removeFromCart('${item._id}')");
    content = content.replace("cart = cart.filter(item => item.id !== id);", "cart = cart.filter(item => item._id !== id);");

    const fetchCode = `
        async function fetchProducts() {
            try {
                const res = await fetch('http://localhost:5000/api/products');
                products = await res.json();
                renderProducts();
            } catch(e) {
                console.error("Error fetching products", e);
            }
        }
`;
    content = content.replace("// Initialize App", fetchCode + "\n        // Initialize App");
    content = content.replace("renderProducts();", "fetchProducts();");

    const authCode = `
        // Check Auth
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if(!user || !token) {
            window.location.href = 'Login.html';
        } else {
            if(user.addresses && user.addresses.length > 0) {
                addresses = user.addresses;
            }
            document.getElementById('profileBtn').innerHTML = \`<i class="fas fa-user-circle"></i> \${user.name}\`;
        }
`;
    content = content.replace("let addresses = [\"Main Bazar Galla Mandi, Sheikhupura\"];", "let addresses = [];\n" + authCode);

    const confirmOrderOld = `        confirmOrderBtn.addEventListener('click', () => {
            const method = document.querySelector('input[name="paymentMethod"]:checked').value;
            alert("Order Placed Successfully via " + method + "!");
            cart = [];
            updateCartUI();
            toggleCheckout();
        });`;

    const confirmOrderNew = `        confirmOrderBtn.addEventListener('click', async () => {
            const method = document.querySelector('input[name="paymentMethod"]:checked').value;
            const address = document.getElementById('checkoutAddress').value;
            
            const orderData = {
                user: user.id,
                items: cart.map(c => ({ product: c._id, name: c.name, price: c.price, qty: c.qty })),
                totalAmount: parseInt(document.getElementById('checkoutTotalAmount').textContent),
                shippingAddress: address,
                paymentMethod: method
            };

            try {
                const res = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                
                if(res.ok) {
                    alert("Order Placed Successfully via " + method + "!");
                    cart = [];
                    updateCartUI();
                    toggleCheckout();
                } else {
                    alert("Failed to place order.");
                }
            } catch(e) {
                alert("Error placing order.");
            }
        });`;

    content = content.replace(confirmOrderOld, confirmOrderNew);
    fs.writeFileSync(file, content);

    // ---- LOGIN.HTML ----
    let loginContent = fs.readFileSync('c:/Users/Hafiz Abdul Hannan/Desktop/MERN/Shafeeq Pansaar Store/Frontend/Login.html', 'utf8');

    const loginFormOld = `            <form class="auth-form" action="Home.html">
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="Enter your password" required>
                </div>
                <button type="submit" class="btn auth-btn w-100">Login to Account</button>
            </form>`;

    const loginFormNew = `            <form class="auth-form" id="loginForm">
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="email" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" placeholder="Enter your password" required>
                </div>
                <button type="submit" class="btn auth-btn w-100">Login to Account</button>
            </form>`;

    loginContent = loginContent.replace(loginFormOld, loginFormNew);

    const loginJS = `
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                
                if(res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'Home.html';
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch(e) {
                alert('Server error');
            }
        });
`;

    loginContent = loginContent.replace("</script>", loginJS + "\n    </script>");
    fs.writeFileSync('c:/Users/Hafiz Abdul Hannan/Desktop/MERN/Shafeeq Pansaar Store/Frontend/Login.html', loginContent);

    // ---- SIGNUP.HTML ----
    let signupContent = fs.readFileSync('c:/Users/Hafiz Abdul Hannan/Desktop/MERN/Shafeeq Pansaar Store/Frontend/Signup.html', 'utf8');

    const signupFormOld = `            <form class="auth-form" action="Login.html">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter your full name" required>
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="Create a password" required>
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Confirm your password" required>
                </div>
                <button type="submit" class="btn auth-btn w-100">Create Account</button>
            </form>`;

    const signupFormNew = `            <form class="auth-form" id="signupForm">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="name" placeholder="Enter your full name" required>
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="email" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" placeholder="Create a password" required>
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" id="confirmPassword" placeholder="Confirm your password" required>
                </div>
                <button type="submit" class="btn auth-btn w-100">Create Account</button>
            </form>`;

    signupContent = signupContent.replace(signupFormOld, signupFormNew);

    const signupJS = `
        document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
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
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                
                if(res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'Login.html';
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch(e) {
                alert('Server error');
            }
        });
`;

    signupContent = signupContent.replace("</script>", signupJS + "\n    </script>");
    fs.writeFileSync('c:/Users/Hafiz Abdul Hannan/Desktop/MERN/Shafeeq Pansaar Store/Frontend/Signup.html', signupContent);
    console.log("All files updated successfully");
} catch(err) {
    console.error(err);
}
