const express = require('express');
const router = express.Router();
const { trackEvent, getAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.post('/track', trackEvent);
router.get('/', protect, getAnalytics);

module.exports = router;
