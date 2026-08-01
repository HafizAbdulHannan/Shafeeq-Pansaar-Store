let products = [];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let addresses = [];

// Check Auth
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
if(!user || !token) {
    window.location.href = 'Login.html';
} else {
    if(user.addresses && user.addresses.length > 0) {
        addresses = user.addresses;
    }
    const pBtn = document.getElementById('profileBtn');
    pBtn.innerHTML = `<i class="fas fa-user-circle"></i> <span>${user.name}</span>`;
    pBtn.style.width = 'auto';
    pBtn.style.padding = '0 15px';
    pBtn.style.borderRadius = '20px';
    pBtn.style.gap = '8px';
    pBtn.style.fontSize = '1rem';
    
    document.getElementById('profileNameInput').value = user.name;
    document.getElementById('profileEmailInput').value = user.email;
    if(user.phone) document.getElementById('profilePhoneInput').value = user.phone;
    if(user.dob) document.getElementById('profileDobInput').value = user.dob;
    if(user.age) document.getElementById('profileAgeInput').value = user.age;
    if(user.defaultAddress) document.getElementById('profileDefaultAddressInput').value = user.defaultAddress;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    window.location.href = 'Login.html';
}


// DOM Elements
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');

// Cart
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartTotalAmount = document.getElementById('cartTotalAmount');
const cartBadge = document.getElementById('cartBadge');

// Profile
const profileBtn = document.getElementById('profileBtn');
const closeProfileBtn = document.getElementById('closeProfileBtn');
const profileSidebar = document.getElementById('profileSidebar');
const profileOverlay = document.getElementById('profileOverlay');

// Checkout
const checkoutBtn = document.getElementById('checkoutBtn');
const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
const checkoutTotalAmount = document.getElementById('checkoutTotalAmount');
const confirmOrderBtn = document.getElementById('confirmOrderBtn');

// Render Products
function renderProducts(filter = "") {
    productGrid.innerHTML = "";
    const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) || p.category.toLowerCase().includes(filter.toLowerCase()));
    
    if(filtered.length === 0) {
        productGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 2rem;'>No products found matching your search.</p>";
        return;
    }

    filtered.forEach(p => {
        const soldOutClass = p.isSoldOut ? 'sold-out' : '';
        const disabledAttr = p.isSoldOut ? 'disabled' : '';
        const btnText = p.isSoldOut ? 'Sold Out' : '<i class="fas fa-plus"></i> Add to Cart';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image ${soldOutClass}" style="background-image: url('${p.image}'); cursor: pointer;" onclick="openProductDetails('${p._id}')"></div>
            <div class="product-info">
                <span class="category-tag">${p.category}</span>
                <h4 style="cursor: pointer;" onclick="openProductDetails('${p._id}')">${p.name}</h4>
                <p class="price">Rs. ${p.price}</p>
                <button class="btn btn-sm order-btn add-to-cart-btn" ${disabledAttr} onclick="addToCart('${p._id}')">
                    ${btnText}
                </button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Cart Logic
function addToCart(id) {
    const product = products.find(p => p._id === id);
    const existing = cart.find(item => item._id === id);
    
    if(existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    
    // Show toast notification
    showToast("Added to Cart!");
    
    // Small animation on cart button
    cartBtn.style.transform = "scale(1.2)";
    setTimeout(() => cartBtn.style.transform = "none", 200);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function removeFromCart(id) {
    cart = cart.filter(item => item._id !== id);
    updateCartUI();
}

function updateCartUI() {
    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <h5>${item.name}</h5>
                <p>Rs. ${item.price}</p>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="decreaseQuantity('${item._id}')"><i class="fas fa-minus" style="font-size:0.8rem;"></i></button>
                <span style="font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
                <button class="qty-btn" onclick="increaseQuantity('${item._id}')"><i class="fas fa-plus" style="font-size:0.8rem;"></i></button>
                <button class="remove-btn" onclick="removeFromCart('${item._id}')" style="margin-left: 8px;"><i class="fas fa-trash"></i></button>
            </div>
        `;
        cartItems.appendChild(div);
    });

    if(cart.length === 0) {
        cartItems.innerHTML = "<p class='empty-cart'>Your cart is empty.</p>";
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
    }

    cartTotalAmount.textContent = "Rs. " + total;
    const checkoutSpan = document.getElementById('checkoutTotalAmount');
    if(checkoutSpan) checkoutSpan.textContent = total;
    cartBadge.textContent = count;
    
    localStorage.setItem('cart', JSON.stringify(cart));
    handlePaymentStep1();
}

function handlePaymentStep1() {
    const userMethod = document.getElementById('userPaymentMethod');
    if (!userMethod) return; // Not on checkout page yet
    
    const userMethodVal = userMethod.value;
    const step2 = document.getElementById('paymentStep2');
    const confirmBtn = document.getElementById('confirmOrderBtn');
    
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (!userMethodVal) {
        step2.style.display = 'none';
        confirmBtn.innerHTML = `Confirm Order (Rs. <span id="checkoutTotalAmount">${cartTotal}</span>)`;
        return;
    }

    if (userMethodVal === 'Cash on Delivery') {
        step2.style.display = 'none';
        confirmBtn.innerHTML = `Place Order (Rs. <span id="checkoutTotalAmount">${cartTotal}</span>)`;
    } else {
        step2.style.display = 'block';
        confirmBtn.innerHTML = `Pay Rs. <span id="checkoutTotalAmount">${cartTotal}</span>`;
        
        // Find the selected method from settings
        if (storeSettings && storeSettings.paymentMethods) {
            const methodDetails = storeSettings.paymentMethods.find(m => (m.methodName || m.name) === userMethodVal);
            if (methodDetails) {
                document.getElementById('adminAcNo').innerText = `Account Number: ${methodDetails.accountNumber || methodDetails.details || 'N/A'}`;
            }
        }
    }
}

function increaseQuantity(id) {
    const item = cart.find(i => i._id === id);
    if(item) {
        item.qty += 1;
        updateCartUI();
    }
}

function decreaseQuantity(id) {
    const item = cart.find(i => i._id === id);
    if(item) {
        item.qty -= 1;
        if(item.qty <= 0) removeFromCart(id);
        else updateCartUI();
    }
}

// Toggle Views
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

function toggleProfile() {
    profileSidebar.classList.toggle('active');
    profileOverlay.classList.toggle('active');
}

// Address Type Selection Logic
const defaultAddressRadio = document.getElementById('defaultAddressRadio');
const customAddressRadio = document.getElementById('customAddressRadio');
const checkoutDetailedAddress = document.getElementById('checkoutDetailedAddress');

function updateAddressField() {
    if (defaultAddressRadio.checked) {
        checkoutDetailedAddress.value = user && user.defaultAddress ? user.defaultAddress : '';
        checkoutDetailedAddress.setAttribute('readonly', true);
    } else {
        checkoutDetailedAddress.value = '';
        checkoutDetailedAddress.removeAttribute('readonly');
        checkoutDetailedAddress.focus();
    }
}

defaultAddressRadio.addEventListener('change', updateAddressField);
customAddressRadio.addEventListener('change', updateAddressField);

function toggleCheckout() {
    if(cart.length === 0) return alert("Cart is empty!");
    
    // Set default address on open if user is available
    if (user && user.defaultAddress) {
        defaultAddressRadio.checked = true;
        updateAddressField();
    }
    
    checkoutModalOverlay.classList.toggle('active');
    
    const um = document.getElementById('userPaymentMethod');
    if (um && checkoutModalOverlay.classList.contains('active')) {
        um.value = 'Cash on Delivery';
        document.getElementById('userPaymentAccountName').value = '';
        document.getElementById('userPaymentTID').value = '';
        document.getElementById('userPaymentReceiptName').value = '';
        document.getElementById('userPaymentAmount').value = '';
        document.getElementById('userPaymentScreenshot').value = '';
        handlePaymentStep1();
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const checkoutTotalSpan = document.getElementById('checkoutTotalAmount');
    if(checkoutTotalSpan) checkoutTotalSpan.textContent = total;
    
    if(checkoutModalOverlay.classList.contains('active')) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }
}

// Event Listeners
searchInput.addEventListener('input', (e) => renderProducts(e.target.value));

cartBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

profileBtn.addEventListener('click', toggleProfile);
closeProfileBtn.addEventListener('click', toggleProfile);
profileOverlay.addEventListener('click', toggleProfile);

checkoutBtn.addEventListener('click', toggleCheckout);
closeCheckoutBtn.addEventListener('click', toggleCheckout);

confirmOrderBtn.addEventListener('click', async () => {
    const area = document.getElementById('checkoutAddress').value;
    const details = document.getElementById('checkoutDetailedAddress').value;
    const address = details.trim() !== "" ? `${area}, ${details}` : area;
    
    const userMethod = document.getElementById('userPaymentMethod').value;
    if (!userMethod) return alert('Please select a payment method.');
    
    let paymentDetailsObj = {};
    let screenshotFile = null;
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (userMethod !== 'Cash on Delivery') {
        const accountName = document.getElementById('userPaymentAccountName').value.trim();
        const tid = document.getElementById('userPaymentTID').value.trim();
        const receiptName = document.getElementById('userPaymentReceiptName').value.trim();
        const amount = document.getElementById('userPaymentAmount').value.trim();
        const screenshotInput = document.getElementById('userPaymentScreenshot');
        
        if (!accountName || !tid || !amount) {
            return alert('Please fill in Account Name, TID, and Amount.');
        }
        
        paymentDetailsObj = {
            accountName,
            transactionId: tid,
            receiptName,
            amount: Number(amount)
        };
        
        if (screenshotInput.files && screenshotInput.files[0]) {
            screenshotFile = screenshotInput.files[0];
        }
    }
    
    const formData = new FormData();
    formData.append('user', user.id);
    formData.append('items', JSON.stringify(cart.map(c => ({ product: c._id, name: c.name, price: c.price, profit: c.profit || 0, qty: c.qty }))));
    formData.append('totalAmount', cartTotal);
    formData.append('shippingAddress', address);
    formData.append('paymentMethod', userMethod);
    formData.append('paymentDetails', JSON.stringify(paymentDetailsObj));
    
    if (screenshotFile) {
        formData.append('screenshot', screenshotFile);
    }
    
    try {
        const res = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            body: formData
        });
        
        if(res.ok) {
            alert("Order Placed Successfully!");
            cart = [];
            localStorage.removeItem('cart');
            updateCartUI();
            checkoutModalOverlay.classList.remove('active');
        } else {
            alert("Failed to place order.");
        }
    } catch(e) {
        alert("Error placing order.");
    }
});

// Profile features
document.getElementById('profilePicUpload').addEventListener('change', function(e) {
    if(e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePicPreview').src = e.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    }
});

document.getElementById('addAddressBtn').addEventListener('click', () => {
    const input = document.getElementById('newAddressInput');
    if(input.value.trim() !== "") {
        addresses.push(input.value.trim());
        input.value = "";
        updateAddressList();
    }
});

function updateAddressList() {
    const list = document.getElementById('addressList');
    const datalist = document.getElementById('savedAddresses');
    list.innerHTML = "";
    if (datalist) datalist.innerHTML = "";
    
    addresses.forEach(addr => {
        const div = document.createElement('div');
        div.className = 'address-card';
        div.innerHTML = `<p>${addr}</p>`;
        list.appendChild(div);

        if (datalist) {
            const option = document.createElement('option');
            option.value = addr;
            datalist.appendChild(option);
        }
    });
}


async function fetchProducts() {
    try {
        const res = await fetch('http://localhost:5000/api/products');
        products = await res.json();
        renderProducts();
    } catch(e) {
        console.error("Error fetching products", e);
    }
}


function toggleTransactionIdInput(methodName) {
    const tContainer = document.getElementById('checkoutTransactionIdContainer');
    if (!methodName || methodName.toLowerCase().includes('cash on delivery') || methodName.toLowerCase().includes('cod')) {
        if(tContainer) tContainer.style.display = 'none';
        const tInput = document.getElementById('checkoutTransactionId');
        if(tInput) tInput.value = '';
    } else {
        if(tContainer) tContainer.style.display = 'block';
    }
}
function formatTime(timeStr) {
    if(!timeStr || !timeStr.includes(':')) return timeStr;
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${m} ${ampm}`;
}

let storeSettings = null;

async function fetchSettings() {
    try {
        const res = await fetch('http://localhost:5000/api/admin/settings');
        const settings = await res.json();
        storeSettings = settings;
        
        if (settings && !settings.isStoreOpen) {
            const mainContent = document.querySelector('.main-content');
            mainContent.innerHTML = `
                <div style="text-align: center; padding: 100px 20px;">
                    <i class="fas fa-store-slash" style="font-size: 4rem; color: #ef4444; margin-bottom: 20px;"></i>
                    <h1 style="font-size: 2.5rem; color: var(--primary-color);">Store is Closed</h1>
                    <p style="font-size: 1.2rem; margin-top: 10px; color: var(--text-main);">Store is closed right now. Open timing is <strong>${formatTime(settings.openTime)}</strong> to <strong>${formatTime(settings.closeTime)}</strong>.</p>
                </div>
            `;
        }
        
        // Populate Payment Methods
        if (settings && settings.paymentMethods) {
            const methodSelect = document.getElementById('userPaymentMethod');
            if (methodSelect) {
                // Find if Cash on Delivery exists or not, else add it
                let hasCod = false;
                let optionsHtml = '';
                settings.paymentMethods.forEach(m => {
                    const name = m.methodName || m.name;
                    optionsHtml += `<option value="${name}">${name}</option>`;
                    if (name.toLowerCase() === 'cash on delivery' || name.toLowerCase() === 'cod') {
                        hasCod = true;
                    }
                });
                
                if (!hasCod) {
                    optionsHtml = '<option value="Cash on Delivery">Cash on Delivery</option>' + optionsHtml;
                }
                methodSelect.innerHTML = optionsHtml;
            }
        }
        
    } catch(e) { console.error(e); }
}

function openFeedbackModal() {
    document.getElementById('feedbackModal').classList.add('active');
    // reset stars
    selectedRating = 5;
    updateStars(selectedRating);
}

function closeFeedbackModal() {
    document.getElementById('feedbackModal').classList.remove('active');
}

let selectedRating = 5;
const stars = document.querySelectorAll('#starRating .fa-star');
stars.forEach(star => {
    star.addEventListener('click', (e) => {
        selectedRating = parseInt(e.target.getAttribute('data-value'));
        updateStars(selectedRating);
    });
});

function updateStars(rating) {
    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= rating) {
            star.style.color = 'var(--primary-color)';
        } else {
            star.style.color = '#ccc';
        }
    });
}

async function submitFeedback() {
    const text = document.getElementById('feedbackText').value;
    if (!text) return alert('Please enter feedback');
    try {
        const response = await fetch('http://localhost:5000/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: user.name, email: user.email, rating: selectedRating, message: text })
        });
        if (response.ok) {
            alert('Feedback submitted!');
            document.getElementById('feedbackText').value = '';
            closeFeedbackModal();
        }
    } catch (error) {
        console.error(error);
    }
}

async function openMyOrdersModal() {
    document.getElementById('profileSidebar').classList.remove('active'); // Close profile
    document.getElementById('profileOverlay').classList.remove('active');
    document.getElementById('myOrdersModalOverlay').classList.add('active');
    const list = document.getElementById('myOrdersList');
    list.innerHTML = '<p>Loading your orders...</p>';
    
    try {
        const res = await fetch(`http://localhost:5000/api/orders/user/${user.id}`);
        const orders = await res.json();
        
        if(orders.length === 0) {
            list.innerHTML = '<p class="empty-cart">You have no orders yet.</p>';
            return;
        }
        
        list.innerHTML = '';
        orders.forEach(o => {
            const d = new Date(o.createdAt).toLocaleDateString();
            let itemsHtml = o.items.map(i => `<li>${i.name} (x${i.qty}) - Rs. ${i.price}</li>`).join('');
            
            const div = document.createElement('div');
            div.style.border = '1px solid var(--border-color)';
            div.style.borderRadius = '12px';
            div.style.padding = '1rem';
            div.style.marginBottom = '1rem';
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; align-items: center;">
                    <strong style="color:var(--text-main);">Order Date: ${d}</strong>
                    <span style="background: ${o.status === 'Pending' ? '#f59e0b' : '#10b981'}; color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight:bold;">${o.status}</span>
                </div>
                <ul style="margin-left: 1.5rem; margin-bottom: 0.8rem; font-size: 0.9rem; color: var(--text-muted);">
                    ${itemsHtml}
                </ul>
                <div style="display:flex; justify-content:space-between; font-size: 0.95rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem; align-items: center;">
                    <div>
                        <span style="color:var(--text-main);">Payment: <strong>${o.paymentMethod}</strong></span><br>
                        <span style="color:var(--text-main);">Total: <strong style="color:var(--primary-color);">Rs. ${o.totalAmount}</strong></span>
                    </div>
                    <button class="btn btn-secondary btn-sm" style="background:#ef4444; border:none; color:white; padding: 6px 12px;" onclick="deleteUserOrder('${o._id}')"><i class="fas fa-trash"></i></button>
                </div>
            `;
            list.appendChild(div);
        });
    } catch(e) {
        list.innerHTML = '<p style="color:red;">Failed to load orders.</p>';
    }
}

async function deleteUserOrder(id) {
    if(!confirm('Are you sure you want to delete this order?')) return;
    try {
        const res = await fetch(`http://localhost:5000/api/orders/${id}`, { method: 'DELETE' });
        if (res.ok) {
            openMyOrdersModal();
        } else {
            alert('Failed to delete order.');
        }
    } catch(e) {
        alert('Error deleting order.');
    }
}

function closeMyOrdersModal() {
    document.getElementById('myOrdersModalOverlay').classList.remove('active');
}

// Product Details Logic
function openProductDetails(id) {
    const product = products.find(p => p._id === id);
    if(!product) return;

    document.getElementById('pdName').textContent = product.name;
    document.getElementById('pdImage').src = product.image;
    document.getElementById('pdCategory').textContent = product.category;
    document.getElementById('pdPrice').textContent = `Rs. ${product.price}`;
    
    // Check if the product has a description field, otherwise use placeholder text
    document.getElementById('pdDescription').textContent = product.description || "Fresh and high-quality " + product.category.toLowerCase() + " delivered directly to your doorstep. Guaranteed premium quality with careful packaging.";

    const addToCartBtn = document.getElementById('pdAddToCartBtn');
    if (product.isSoldOut) {
        addToCartBtn.disabled = true;
        addToCartBtn.innerHTML = 'Sold Out';
    } else {
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML = '<i class="fas fa-plus"></i> Add to Cart';
        addToCartBtn.onclick = () => {
            addToCart(product._id);
            closeProductDetails();
        };
    }

    document.getElementById('productDetailsModalOverlay').classList.add('active');
}

function closeProductDetails() {
    document.getElementById('productDetailsModalOverlay').classList.remove('active');
}

// Initialize App
fetchSettings();
fetchProducts();
updateCartUI();
updateAddressList();

// Dark Mode Logic
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
