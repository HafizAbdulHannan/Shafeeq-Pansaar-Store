const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const orderController = require('../controllers/orderController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// Create Order
router.post('/', upload.single('screenshot'), orderController.createOrder);

// Get User Orders
router.get('/user/:userId', orderController.getUserOrders);

// Delete User Order
router.delete('/:id', orderController.deleteUserOrder);

module.exports = router;
