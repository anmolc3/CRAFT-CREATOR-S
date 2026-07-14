const express = require('express');
const router = express.Router();
const { getCollections, getCollectionBySlug, createCollection, updateCollection, deleteCollection, addPhotoToCollection, removePhotoFromCollection } = require('../controllers/collectionController');
const { protect } = require('../middleware/auth');

router.get('/', getCollections);
router.get('/:slug', getCollectionBySlug);
router.post('/', protect, createCollection);
router.put('/:id', protect, updateCollection);
router.delete('/:id', protect, deleteCollection);
router.post('/:id/photos', protect, addPhotoToCollection);
router.delete('/:id/photos/:photoId', protect, removePhotoFromCollection);

module.exports = router;
