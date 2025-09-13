const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegistration } = require('../middleware/validationMiddleware');

router.post('/signup', validateRegistration, signup);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;