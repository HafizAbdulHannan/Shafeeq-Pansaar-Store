const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    profit: { type: Number, default: 0 },
    qty: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentDetails: {
        accountName: { type: String, default: '' },
        transactionId: { type: String, default: '' },
        receiptName: { type: String, default: '' },
        amount: { type: Number, default: 0 },
        screenshot: { type: String, default: '' }
    },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
