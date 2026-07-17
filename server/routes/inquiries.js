const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const {
  getInquiries, getInquiryById, createInquiry,
  updateInquiry, deleteInquiry, getInquiryStats,
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

// Multer config for customer photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/inquiries')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `inquiry-${crypto.randomUUID()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only image files (JPG, PNG, WEBP, HEIC) are allowed'));
  },
});

// Public
router.post('/', upload.single('photo'), createInquiry);

// Admin
router.get('/', protect, getInquiries);
router.get('/stats', protect, getInquiryStats);
router.get('/:id', protect, getInquiryById);
router.put('/:id', protect, updateInquiry);
router.delete('/:id', protect, deleteInquiry);

module.exports = router;
