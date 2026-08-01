const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { name, email, password, dob, age, phone, defaultAddress } = req.body;
        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            dob,
            age,
            phone,
            defaultAddress,
            addresses: [defaultAddress]
        });

        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, dob: user.dob, age: user.age, phone: user.phone, defaultAddress: user.defaultAddress, addresses: user.addresses } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, dob: user.dob, age: user.age, phone: user.phone, defaultAddress: user.defaultAddress, addresses: user.addresses } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email, phone, newPassword } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        
        if (user.phone !== phone) return res.status(400).json({ message: 'Phone number does not match our records for this email.' });
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        
        res.json({ message: 'Password reset successfully' });
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};
