const express = require('express');
const router = express.Router();
const {
  getConfiguratorOptions, getSizes, getGlassOptions, getMountOptions, getMaterials, getColors,
  createSize, updateSize, deleteSize,
  createGlass, updateGlass, deleteGlass,
  createMount, updateMount, deleteMount,
} = require('../controllers/configuratorController');
const { protect } = require('../middleware/auth');

// Public — read all options
router.get('/', getConfiguratorOptions);
router.get('/sizes', getSizes);
router.get('/glass', getGlassOptions);
router.get('/mount', getMountOptions);
router.get('/materials', getMaterials);
router.get('/colors', getColors);

// Admin — sizes
router.post('/sizes', protect, createSize);
router.put('/sizes/:id', protect, updateSize);
router.delete('/sizes/:id', protect, deleteSize);

// Admin — glass
router.post('/glass', protect, createGlass);
router.put('/glass/:id', protect, updateGlass);
router.delete('/glass/:id', protect, deleteGlass);

// Admin — mount
router.post('/mount', protect, createMount);
router.put('/mount/:id', protect, updateMount);
router.delete('/mount/:id', protect, deleteMount);

module.exports = router;
