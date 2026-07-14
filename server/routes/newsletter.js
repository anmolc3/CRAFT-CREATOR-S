const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers, deleteSubscriber } = require('../controllers/newsletterController');
const { protect } = require('../middleware/auth');
const { newsletterRateLimiter } = require('../middleware/rateLimiter');

router.post('/subscribe', newsletterRateLimiter, subscribe);
router.get('/', protect, getSubscribers);
router.delete('/:id', protect, deleteSubscriber);

module.exports = router;
