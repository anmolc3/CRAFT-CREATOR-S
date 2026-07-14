const express = require('express');
const router = express.Router();
const { 
  createGallery, getAdminGalleries, getAdminGalleryById, updateGallery, deleteGallery, 
  addGalleryImages, deleteGalleryImage, verifyAndGetGallery 
} = require('../controllers/clientGalleryController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public Client Route
router.post('/verify/:slug', verifyAndGetGallery); // POST to send password

// Admin Routes
router.get('/', protect, getAdminGalleries);
router.get('/:id', protect, getAdminGalleryById);
router.post('/', protect, upload.single('coverImage'), createGallery);
router.put('/:id', protect, upload.single('coverImage'), updateGallery);
router.delete('/:id', protect, deleteGallery);

// Admin Gallery Images
router.post('/:id/images', protect, upload.array('images', 20), addGalleryImages);
router.delete('/:id/images/:imageId', protect, deleteGalleryImage);

module.exports = router;
