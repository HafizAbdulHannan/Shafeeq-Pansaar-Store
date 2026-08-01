const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const authAdmin = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });
// Setup initial admin
router.post('/setup', adminController.setup);

router.get('/fix-products', async (req, res) => {
    try {
        const Product = require('../models/Product');
        const delRes = await Product.deleteMany({ category: 'General' });
        const oldProducts = await Product.find({ image: { $regex: 'localhost:5000' } });
        let updatedCount = 0;
        for (const p of oldProducts) {
            p.image = p.image.replace('http://localhost:5000', 'https://shafeeq-pansaar-store-production.up.railway.app');
            await p.save();
            updatedCount++;
        }
        res.json({ deleted: delRes.deletedCount, fixed: updatedCount });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// Admin Login
router.post('/login', adminController.login);

// Create new admin (Permanent only)
router.post('/create', authAdmin, adminController.createAdmin);

// Forgot Password
router.post('/forgot-password', adminController.forgotPassword);

// Dashboard Stats
router.get('/dashboard-stats', authAdmin, adminController.getDashboardStats);

// Products Management
router.post('/products', authAdmin, upload.single('image'), adminController.createProduct);
router.put('/products/:id', authAdmin, upload.single('image'), adminController.updateProduct);
router.delete('/products/:id', authAdmin, adminController.deleteProduct);

// Update current admin credentials
router.put('/update-credentials', authAdmin, adminController.updateCredentials);

// Orders Management
router.get('/orders', authAdmin, adminController.getOrders);
router.put('/orders/:id/complete', authAdmin, adminController.completeOrder);
router.delete('/orders/reset-earnings', authAdmin, adminController.resetEarnings);
router.delete('/orders/reset', authAdmin, adminController.resetOrders);
router.delete('/orders/:id', authAdmin, adminController.deleteOrder);

// Settings Management
router.get('/settings', adminController.getSettings);
router.put('/settings', authAdmin, adminController.updateSettings);

// Feedback Management
router.get('/feedback', authAdmin, adminController.getFeedback);

module.exports = router;
