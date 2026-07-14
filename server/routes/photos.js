const express = require('express');
const router = express.Router();
const { getPhotos, getPhotoBySlug, getRelatedPhotos, createPhoto, updatePhoto, deletePhoto } = require('../controllers/photoController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getPhotos);
router.get('/:slug', getPhotoBySlug);
router.get('/:slug/related', getRelatedPhotos);

// Admin routes
router.post('/', protect, upload.single('image'), createPhoto);
router.put('/:id', protect, upload.single('image'), updatePhoto);
router.delete('/:id', protect, deletePhoto);

module.exports = router;
