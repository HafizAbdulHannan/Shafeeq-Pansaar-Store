const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    defaultAddress: { type: String, required: true },
    addresses: [{ type: String }],
    avatarUrl: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
