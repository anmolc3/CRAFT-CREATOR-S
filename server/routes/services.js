const express = require('express');
const router = express.Router();
const { getServices, getServiceBySlug, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

// Admin
router.post('/', protect, upload.single('heroImage'), createService);
router.put('/:id', protect, upload.single('heroImage'), updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
