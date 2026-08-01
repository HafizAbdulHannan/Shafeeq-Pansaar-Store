const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    profit: { type: Number, default: 0 },
    category: { type: String, required: true },
    image: { type: String, required: true },
    isSoldOut: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
