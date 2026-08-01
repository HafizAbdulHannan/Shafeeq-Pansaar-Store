const token = localStorage.getItem('adminToken');
const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
const headers = { 'Content-Type': 'application/json', 'x-auth-token': token };

if (!token) {
    window.location.href = 'Admin.html';
}

if (adminUser.isPermanent) {
    document.getElementById('adminCreateCard').style.display = 'block';
}

function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'Admin.html';
}

function switchTab(tabId, btnElement) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');

    if (tabId === 'dashboard') loadDashboard();
    else if (tabId === 'products') loadProducts();
    else if (tabId === 'orders') loadOrders();
    else if (tabId === 'feedback') loadFeedback();
    else if (tabId === 'questions') loadQuestions();
    else if (tabId === 'settings') loadSettings();
}

// --- DASHBOARD ---
async function loadDashboard() {
    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/dashboard-stats', { headers });
        const data = await res.json();
        document.getElementById('statEarnings').innerText = `Rs. ${data.totalEarnings || 0}`;
        document.getElementById('statProfit').innerText = `Rs. ${data.totalProfit || 0}`;
        document.getElementById('statTotalOrders').innerText = data.totalOrders || 0;
        document.getElementById('statPendingOrders').innerText = data.pendingOrders || 0;
    } catch (e) { console.error(e); }
}

// --- PRODUCTS ---
let allProducts = [];
async function loadProducts() {
    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/products');
        allProducts = await res.json();
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        allProducts.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>Rs. ${p.price}</td>
                <td>Rs. ${p.profit || 0}</td>
                <td>
                    <label class="switch">
                        <input type="checkbox" ${p.isSoldOut ? 'checked' : ''} onchange="toggleSoldOut('${p._id}', this.checked)">
                        <span class="slider"></span>
                    </label>
                </td>
                <td>
                    <button class="btn btn-secondary" style="margin-right: 5px;" onclick="editProduct('${p._id}')">Edit</button>
                    <button class="btn btn-secondary" style="background: #ef4444; border: none; color: white;" onclick="deleteProduct('${p._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

async function deleteProduct(id) {
    if(!confirm("Are you sure you want to delete this product?")) return;
    try {
        const res = await fetch(`https://shafeeq-pansaar-store-production.up.railway.app/api/admin/products/${id}`, {
            method: 'DELETE',
            headers
        });
        if(res.ok) {
            alert('Product deleted successfully');
            loadProducts();
        } else {
            alert('Failed to delete product');
        }
    } catch(e) { console.error(e); alert('Error deleting product'); }
}

async function updateCredentials() {
    const username = document.getElementById('updateUsername').value.trim();
    const password = document.getElementById('updatePassword').value;
    
    if (!username && !password) return alert("Please enter a new username or password to update.");
    
    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/update-credentials', {
            method: 'PUT',
            headers,
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if(res.ok) {
            alert("Credentials updated successfully. Please login again.");
            logout();
        } else {
            alert(data.message || 'Error updating credentials');
        }
    } catch (e) {
        console.error(e);
        alert('Server error');
    }
}

function openProductModal() {
    document.getElementById('productModalTitle').innerText = 'Add Product';
    document.getElementById('editProductId').value = '';
    document.getElementById('pName').value = '';
    document.getElementById('pPrice').value = '';
    document.getElementById('pProfit').value = '';
    document.getElementById('pCategory').value = '';
    document.getElementById('pImage').value = '';
    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

function editProduct(id) {
    const p = allProducts.find(x => x._id === id);
    if (!p) return;
    document.getElementById('productModalTitle').innerText = 'Edit Product';
    document.getElementById('editProductId').value = p._id;
    document.getElementById('pName').value = p.name;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pProfit').value = p.profit || '';
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pImage').value = '';
    document.getElementById('productModal').classList.add('active');
}

async function saveProduct() {
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const profit = document.getElementById('pProfit').value;
    const category = document.getElementById('pCategory').value;
    const imageFile = document.getElementById('pImage').files[0];

    if (!name || !price || !category) {
        return alert('Please fill all required fields');
    }

    if (!id && !imageFile) {
        return alert('Please select an image for the new product');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (profit) formData.append('profit', profit);
    formData.append('category', category);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const url = id ? `https://shafeeq-pansaar-store-production.up.railway.app/api/admin/products/${id}` : `https://shafeeq-pansaar-store-production.up.railway.app/api/admin/products`;
    const method = id ? 'PUT' : 'POST';
    const customHeaders = { 'x-auth-token': token };

    try {
        const res = await fetch(url, { method, headers: customHeaders, body: formData });
        if (!res.ok) {
            const error = await res.json();
            return alert(error.message || 'Error saving product');
        }
        closeProductModal();
        loadProducts();
    } catch (e) { console.error(e); alert('Error saving product'); }
}

async function toggleSoldOut(id, isSoldOut) {
    try {
        await fetch(`https://shafeeq-pansaar-store-production.up.railway.app/api/admin/products/${id}`, {
            method: 'PUT', headers, body: JSON.stringify({ isSoldOut })
        });
    } catch (e) { alert('Error updating status'); loadProducts(); }
}

// --- ORDERS ---
let allOrders = [];
async function loadOrders() {
    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/orders', { headers });
        allOrders = await res.json();
        const tbody = document.getElementById('ordersTableBody');
        tbody.innerHTML = '';
        allOrders.forEach(o => {
            const badgeClass = o.status === 'Pending' ? 'badge-pending' : 'badge-completed';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${o._id.substring(18)}</td>
                <td>${o.user ? o.user.name : 'Guest'}</td>
                <td>${o.shippingAddress}</td>
                <td>${o.paymentMethod}</td>
                <td>Rs. ${o.totalAmount}</td>
                <td><span class="badge ${badgeClass}">${o.status}</span></td>
                <td>
                    ${o.status === 'Pending' ? `<button class="btn btn-primary" style="margin-right: 5px; font-size: 0.85rem;" onclick="markOrderComplete('${o._id}')">Mark Complete</button>` : '<span style="margin-right: 5px; color: var(--success-color); font-weight: bold; font-size: 0.9rem;">Completed</span>'}
                    <button class="btn btn-secondary" style="font-size: 0.85rem;" onclick="viewOrderDetails('${o._id}')">Details</button>
                    <button class="btn btn-secondary" style="font-size: 0.85rem; background: #ef4444; border: none; color: white; margin-left: 5px;" onclick="deleteOrder('${o._id}')"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

async function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o._id === orderId);
    if(!order) return;
    
    const list = document.getElementById('orderDetailsList');
    list.innerHTML = '';
    
    order.items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.name}</strong> (x${item.qty}) - Rs. ${item.price}`;
        li.style.marginBottom = '0.5rem';
        list.appendChild(li);
    });
    
    document.getElementById('orderDetailsTotal').textContent = order.totalAmount;

    const tContainer = document.getElementById('orderTransactionIdContainer');
    if (order.paymentMethod && order.paymentMethod !== 'Cash on Delivery') {
        if (!currentSettings) {
            try {
                const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/settings', { headers });
                currentSettings = await res.json();
            } catch(e) { console.error("Error fetching settings for matching", e); }
        }

        const pDetails = order.paymentDetails || {};
        document.getElementById('orderUserAccountText').innerText = pDetails.accountName || order.userPaymentAccount || 'N/A';
        document.getElementById('orderTransactionIdText').innerText = pDetails.transactionId || order.transactionId || 'N/A';
        document.getElementById('orderReceiptNameText').innerText = pDetails.receiptName || 'N/A';
        document.getElementById('orderAmountText').innerText = pDetails.amount ? 'Rs. ' + pDetails.amount : 'N/A';
        
        const methodDetails = currentSettings?.paymentMethods?.find(m => (m.methodName || m.name) === order.paymentMethod);
        const nameStatusElem = document.getElementById('nameMatchStatus');
        const amountStatusElem = document.getElementById('amountMatchStatus');
        
        if (nameStatusElem) nameStatusElem.innerHTML = '';
        if (amountStatusElem) amountStatusElem.innerHTML = '';

        if (methodDetails && pDetails.receiptName && nameStatusElem) {
            const adminName = (methodDetails.accountHolderName || '').trim();
            const userName = pDetails.receiptName.trim();
            if (adminName && userName) {
                if (adminName === userName) {
                    nameStatusElem.innerHTML = '<span style="color: #10b981; font-weight: bold;">Matched</span>';
                } else if (adminName.toLowerCase() === userName.toLowerCase()) {
                    nameStatusElem.innerHTML = '<span style="color: #f59e0b; font-weight: bold;">Slightly Matched</span>';
                } else {
                    nameStatusElem.innerHTML = '<span style="color: #ef4444; font-weight: bold;">Warning Unmatched</span>';
                }
            }
        }

        if (pDetails.amount && amountStatusElem) {
            if (Number(pDetails.amount) === Number(order.totalAmount)) {
                amountStatusElem.innerHTML = '<span style="color: #10b981; font-weight: bold;">Matched</span>';
            } else {
                amountStatusElem.innerHTML = '<span style="color: #ef4444; font-weight: bold;">Warning Unmatched</span>';
            }
        }

        const btn = document.getElementById('viewScreenshotBtn');
        if (pDetails.screenshot) {
            btn.style.display = 'inline-block';
            btn.onclick = () => window.open(pDetails.screenshot, '_blank');
        } else {
            btn.style.display = 'none';
        }
        
        tContainer.style.display = 'block';
    } else {
        tContainer.style.display = 'none';
    }

    document.getElementById('orderDetailsModalOverlay').classList.add('active');
}

function closeOrderDetailsModal() {
    document.getElementById('orderDetailsModalOverlay').classList.remove('active');
}

async function markOrderComplete(id) {
    if(!confirm('Mark this order as completed?')) return;
    try {
        await fetch(`https://shafeeq-pansaar-store-production.up.railway.app/api/admin/orders/${id}/complete`, { method: 'PUT', headers });
        loadOrders();
    } catch (e) { alert('Error'); }
}

async function deleteOrder(id) {
    if(!confirm('Are you sure you want to delete this order?')) return;
    try {
        const res = await fetch(`https://shafeeq-pansaar-store-production.up.railway.app/api/admin/orders/${id}`, { method: 'DELETE', headers });
        if(res.ok) {
            loadOrders();
        } else {
            alert('Failed to delete order');
        }
    } catch (e) { alert('Error deleting order'); }
}

async function resetDashboard() {
    if(!confirm('WARNING: This will delete ALL orders and reset earnings to 0. Are you sure you want to proceed?')) return;
    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/orders/reset', { method: 'DELETE', headers });
        if (res.ok) {
            alert('Dashboard reset successfully');
            loadDashboard();
        } else {
            alert('Failed to reset dashboard');
        }
    } catch (e) { alert('Error resetting dashboard'); }
}

async function resetEarnings() {
    if(!confirm('WARNING: This will delete all Completed/Delivered orders to reset your earnings to 0. Pending orders will be kept safe. Proceed?')) return;
    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/orders/reset-earnings', { method: 'DELETE', headers });
        if (res.ok) {
            alert('Earnings reset successfully');
            loadDashboard();
            loadOrders();
        } else {
            alert('Failed to reset earnings');
        }
    } catch (e) { alert('Error resetting earnings'); }
}

// --- FEEDBACK ---
async function loadFeedback() {
    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/feedback', { headers });
        const feedbacks = await res.json();
        const tbody = document.getElementById('feedbackTableBody');
        tbody.innerHTML = '';
        feedbacks.forEach(f => {
            const tr = document.createElement('tr');
            const d = new Date(f.createdAt).toLocaleDateString();
            const rating = f.rating ? f.rating : 5;
            tr.innerHTML = `
                <td>${d}</td>
                <td>${f.name}</td>
                <td>${f.email || '-'}</td>
                <td>${rating} <i class="fas fa-star" style="color: #facc15;"></i></td>
                <td>${f.message}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

// --- QUESTIONS ---
async function loadQuestions() {
    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/questions', { headers });
        const questions = await res.json();
        const tbody = document.getElementById('questionsTableBody');
        tbody.innerHTML = '';
        questions.forEach(q => {
            const tr = document.createElement('tr');
            const d = new Date(q.createdAt).toLocaleDateString();
            tr.innerHTML = `
                <td>${d}</td>
                <td>${q.name}</td>
                <td>${q.email}</td>
                <td>${q.question}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

// --- SETTINGS ---
let currentSettings = null;
async function loadSettings() {
    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/settings', { headers });
        const settings = await res.json();
        currentSettings = settings;
        
        const toggle = document.getElementById('storeOpenToggle');
        toggle.checked = settings.isStoreOpen;
        document.getElementById('storeStatusText').innerText = settings.isStoreOpen ? 'Store is Open' : 'Store is Closed';

        // Auto Open UI
        document.getElementById('autoOpenToggle').checked = settings.isAutoOpenClose || false;
        document.getElementById('openTimeInput').value = settings.openTime || "08:00";
        document.getElementById('closeTimeInput').value = settings.closeTime || "21:00";

        const tbody = document.getElementById('paymentsTableBody');
        tbody.innerHTML = '';
        if(settings.paymentMethods) {
            settings.paymentMethods.forEach((m, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${m.methodName || m.name}</td>
                    <td>
                        <div style="font-size: 0.85rem; margin-bottom: 5px;">
                            <strong>A/C No:</strong> ${m.accountNumber || '-'} <br>
                            <strong>Name:</strong> ${m.accountHolderName || '-'}
                            ${m.details ? `<br><strong>Details:</strong> ${m.details}` : ''}
                        </div>
                    </td>
                    <td><button class="btn btn-secondary" style="background:#ef4444; border:none; color:white; padding: 5px 10px;" onclick="deletePaymentMethod(${idx})"><i class="fas fa-trash"></i></button></td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) { console.error(e); }
}

async function toggleStoreStatus(isOpen) {
    document.getElementById('storeStatusText').innerText = isOpen ? 'Store is Open' : 'Store is Closed';
    try {
        await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/settings', {
            method: 'PUT', headers, body: JSON.stringify({ isStoreOpen: isOpen, isAutoOpenClose: false })
        });
        // Turn off auto schedule on manual override
        document.getElementById('autoOpenToggle').checked = false;
    } catch (e) { alert('Error'); loadSettings(); }
}

async function updateAutoSchedule() {
    const isAutoOpenClose = document.getElementById('autoOpenToggle').checked;
    const openTime = document.getElementById('openTimeInput').value;
    const closeTime = document.getElementById('closeTimeInput').value;

    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/settings', {
            method: 'PUT', headers, body: JSON.stringify({ isAutoOpenClose, openTime, closeTime })
        });
        // We reload settings to let the backend dynamically sync and send back the correct store state
        await loadSettings();
    } catch (e) { alert('Error updating auto schedule'); loadSettings(); }
}

async function updatePaymentDetail(idx, newDetail) {
    currentSettings.paymentMethods[idx].details = newDetail;
    try {
        await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/settings', {
            method: 'PUT', headers, body: JSON.stringify({ paymentMethods: currentSettings.paymentMethods })
        });
    } catch (e) { alert('Error'); }
}

function togglePaymentFields() {
    const name = document.getElementById('payName').value.trim().toLowerCase();
    const fields = document.getElementById('paymentAdditionalFields');
    if (name === 'cash on delivery' || name === 'cod') {
        fields.style.display = 'none';
    } else {
        fields.style.display = 'block';
    }
}

function openPaymentModal() {
    document.getElementById('payName').value = '';
    document.getElementById('payAccountNumber').value = '';
    document.getElementById('payAccountHolderName').value = '';
    document.getElementById('payDetails').value = '';
    togglePaymentFields();
    document.getElementById('paymentModal').classList.add('active');
}
function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

async function savePaymentMethod() {
    const name = document.getElementById('payName').value.trim();
    const details = document.getElementById('payDetails').value.trim();
    const accountNumber = document.getElementById('payAccountNumber').value.trim();
    const accountHolderName = document.getElementById('payAccountHolderName').value.trim();
    
    if (!name) return alert("Method Name is required");

    currentSettings.paymentMethods.push({ name: name, methodName: name, details, accountNumber, accountHolderName });
    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/settings', {
            method: 'PUT', headers, body: JSON.stringify({ paymentMethods: currentSettings.paymentMethods })
        });
        if (!res.ok) {
            const err = await res.json();
            console.error(err);
            return alert('Error adding payment method');
        }
        closePaymentModal();
        loadSettings();
    } catch (e) { alert('Error adding payment method'); }
}

async function deletePaymentMethod(idx) {
    if(!confirm("Are you sure you want to delete this payment method?")) return;
    currentSettings.paymentMethods.splice(idx, 1);
    try {
        await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/settings', {
            method: 'PUT', headers, body: JSON.stringify({ paymentMethods: currentSettings.paymentMethods })
        });
        loadSettings();
    } catch (e) { alert('Error deleting payment method'); }
}

async function createAdmin() {
    const u = document.getElementById('newAdminUsername').value;
    const p = document.getElementById('newAdminPassword').value;
    if(!u || !p) return alert('Fill all fields');
    
    try {
        const res = await fetch('https://shafeeq-pansaar-store-production.up.railway.app/api/admin/create', {
            method: 'POST', headers, body: JSON.stringify({ username: u, password: p })
        });
        const data = await res.json();
        alert(data.message);
    } catch (e) { alert('Error'); }
}

// Init
loadDashboard();
