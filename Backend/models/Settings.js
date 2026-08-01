const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    details: { type: String, default: '' },
    icon: { type: String, default: 'fas fa-money-bill' },
    accountNumber: { type: String, default: '' },
    accountHolderName: { type: String, default: '' }
});

const settingsSchema = new mongoose.Schema({
    isStoreOpen: { type: Boolean, default: true },
    isAutoOpenClose: { type: Boolean, default: false },
    openTime: { type: String, default: '08:00' },
    closeTime: { type: String, default: '21:00' },
    paymentMethods: [paymentMethodSchema]
});

module.exports = mongoose.model('Settings', settingsSchema);
