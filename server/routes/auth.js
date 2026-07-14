const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');

router.post('/login', authRateLimiter, login);
router.get('/me', protect, getMe);

module.exports = router;
