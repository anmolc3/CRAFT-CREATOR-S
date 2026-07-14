const express = require('express');
const router = express.Router();
const { getFrames, createFrame, updateFrame, deleteFrame } = require('../controllers/frameController');
const { protect } = require('../middleware/auth');

router.get('/', getFrames);
router.post('/', protect, createFrame);
router.put('/:id', protect, updateFrame);
router.delete('/:id', protect, deleteFrame);

module.exports = router;
