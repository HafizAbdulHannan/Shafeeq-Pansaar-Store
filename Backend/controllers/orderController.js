const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        let { user, items, totalAmount, shippingAddress, paymentMethod, paymentDetails } = req.body;
        
        if (typeof items === 'string') items = JSON.parse(items);
        if (typeof paymentDetails === 'string') paymentDetails = JSON.parse(paymentDetails);

        const newOrder = new Order({
            user,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentDetails: paymentDetails || {}
        });

        if (req.file) {
            newOrder.paymentDetails.screenshot = 'http://localhost:5000/uploads/' + req.file.filename;
        }

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteUserOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
