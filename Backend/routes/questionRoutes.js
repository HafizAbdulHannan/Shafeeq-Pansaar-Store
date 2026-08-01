const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authAdmin = require('../middleware/authMiddleware');

router.post('/', questionController.submitQuestion);
router.get('/', authAdmin, questionController.getQuestions);

module.exports = router;
