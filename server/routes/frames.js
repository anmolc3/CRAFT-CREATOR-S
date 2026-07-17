const express = require('express');
const router = express.Router();
const { getFrames, getFrameBySlug, createFrame, updateFrame, deleteFrame, trackFrameEvent } = require('../controllers/frameController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/frames')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `frame-${crypto.randomUUID()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// Public
router.get('/', getFrames);
router.get('/:slug', getFrameBySlug);
router.post('/track', trackFrameEvent);

// Admin
router.post('/', protect, upload.single('image'), createFrame);
router.put('/:id', protect, upload.single('image'), updateFrame);
router.delete('/:id', protect, deleteFrame);

module.exports = router;
