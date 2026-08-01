const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/Admin');
const Settings = require('../models/Settings');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');

exports.setup = async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount > 0) return res.status(400).json({ message: 'Admin already setup' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Hannan123', salt);

        const newAdmin = new Admin({
            username: 'Admin',
            password: hashedPassword,
            isPermanent: true
        });
        await newAdmin.save();

        const defaultSettings = new Settings({
            isStoreOpen: true,
            openTime: '8:00 AM',
            closeTime: '9:00 PM',
            paymentMethods: [
                { name: 'Cash on Delivery (COD)', icon: 'fas fa-truck' },
                { name: 'JazzCash', icon: 'fas fa-mobile-alt' },
                { name: 'Easypaisa', icon: 'fas fa-wallet' }
            ]
        });
        await defaultSettings.save();

        res.json({ message: 'Admin and Default Settings created successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { admin: { id: admin._id, username: admin.username, isPermanent: admin.isPermanent } },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '1d' }
        );

        res.json({ token, admin: { username: admin.username, isPermanent: admin.isPermanent } });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createAdmin = async (req, res) => {
    try {
        if (!req.admin.isPermanent) return res.status(403).json({ message: 'Only permanent admin can create new admins' });

        const { username, password } = req.body;
        let admin = await Admin.findOne({ username });
        if (admin) return res.status(400).json({ message: 'Admin already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            isPermanent: false
        });
        await newAdmin.save();
        res.json({ message: 'New admin created successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { username, secretKey, newPassword } = req.body;
        
        if (secretKey !== 'Shafeeq123') return res.status(400).json({ message: 'Invalid Secret Key' });
        
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: 'Admin not found' });
        
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();
        
        res.json({ message: 'Admin password reset successfully' });
    } catch(e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const completedOrders = await Order.countDocuments({ status: 'Delivered' });
        
        const orders = await Order.find({ status: 'Delivered' });
        let totalEarnings = 0;
        let totalProfit = 0;
        
        orders.forEach(o => {
            totalEarnings += o.totalAmount;
            o.items.forEach(item => {
                totalProfit += (item.profit || 0) * item.qty;
            });
        });

        res.json({
            totalOrders, pendingOrders, completedOrders, totalEarnings, totalProfit
        });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        if (req.file) {
            productData.image = 'http://localhost:5000/uploads/' + req.file.filename;
        }
        if (productData.price) productData.price = Number(productData.price);
        if (productData.profit) productData.profit = Number(productData.profit);

        const newProduct = new Product(productData);
        await newProduct.save();
        res.json(newProduct);
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = 'http://localhost:5000/uploads/' + req.file.filename;
        }
        if (updateData.price) updateData.price = Number(updateData.price);
        if (updateData.profit) updateData.profit = Number(updateData.profit);

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedProduct);
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCredentials = async (req, res) => {
    try {
        const { username, password } = req.body;
        const adminId = req.admin.id;
        
        const updateData = {};
        if (username) updateData.username = username;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        await Admin.findByIdAndUpdate(adminId, updateData);
        res.json({ message: 'Credentials updated successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
        res.json(orders);
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.completeOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: 'Delivered' }, { new: true });
        res.json(order);
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted' });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetOrders = async (req, res) => {
    try {
        await Order.deleteMany({});
        res.json({ message: 'All orders reset' });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetEarnings = async (req, res) => {
    try {
        // Only delete orders that are NOT pending to preserve them
        await Order.deleteMany({ status: { $ne: 'Pending' } });
        res.json({ message: 'Earnings reset successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        
        if (settings && settings.isAutoOpenClose) {
            // Get current time in Pakistan timezone (HH:mm)
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Karachi',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            // Some environments return '24:xx' instead of '00:xx' with hour12: false
            let current = formatter.format(now).replace('24:', '00:');
            
            const openT = settings.openTime;
            const closeT = settings.closeTime;
            
            let calculatedOpen = false;
            if (openT <= closeT) {
                calculatedOpen = (current >= openT && current <= closeT);
            } else {
                // handles wrapping past midnight (e.g., 20:00 to 02:00)
                calculatedOpen = (current >= openT || current <= closeT);
            }
            
            // Sync with DB if out of sync
            if (calculatedOpen !== settings.isStoreOpen) {
                settings.isStoreOpen = calculatedOpen;
                await settings.save();
            }
        }
        
        res.json(settings);
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(req.body);
        } else {
            if (req.body.isStoreOpen !== undefined) settings.isStoreOpen = req.body.isStoreOpen;
            if (req.body.isAutoOpenClose !== undefined) settings.isAutoOpenClose = req.body.isAutoOpenClose;
            if (req.body.openTime !== undefined) settings.openTime = req.body.openTime;
            if (req.body.closeTime !== undefined) settings.closeTime = req.body.closeTime;
            if (req.body.paymentMethods) settings.paymentMethods = req.body.paymentMethods;
        }
        await settings.save();
        res.json(settings);
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().sort('-createdAt');
        res.json(feedback);
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};
