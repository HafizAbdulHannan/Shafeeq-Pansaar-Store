const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Submit Feedback
router.post('/', feedbackController.submitFeedback);

// Get Stats
router.get('/stats', feedbackController.getStats);

module.exports = router;
