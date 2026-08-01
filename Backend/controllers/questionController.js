const Question = require('../models/Question');

exports.submitQuestion = async (req, res) => {
    try {
        const { name, email, question } = req.body;
        const newQuestion = new Question({ name, email, question });
        await newQuestion.save();
        res.json({ message: 'Question submitted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        res.json(questions);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};
