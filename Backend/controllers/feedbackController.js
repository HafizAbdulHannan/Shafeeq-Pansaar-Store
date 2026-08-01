const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
    try {
        const { name, email, rating, message } = req.body;
        const newFeedback = new Feedback({ name, email, rating, message });
        await newFeedback.save();
        res.json({ message: 'Feedback submitted successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStats = async (req, res) => {
    try {
        const User = require('../models/User'); // Need to import User model here
        const usersCount = await User.countDocuments();
        const feedbackList = await Feedback.find();
        
        let totalRating = 0;
        let reviewsCount = feedbackList.length;
        
        feedbackList.forEach(fb => {
            totalRating += (fb.rating || 5); // default to 5 if no rating
        });
        
        const avgRating = reviewsCount > 0 ? (totalRating / reviewsCount).toFixed(1) : 5.0;
        
        // Get top 5 recent reviews
        const recentReviews = await Feedback.find().sort({ createdAt: -1 }).limit(5);
        
        res.json({
            users: usersCount,
            rating: avgRating,
            reviews: reviewsCount,
            recentReviews: recentReviews
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};
