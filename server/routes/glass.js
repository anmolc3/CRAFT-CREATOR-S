const express = require('express');
const router = express.Router();
const { getGlassOptions, createGlassOption, updateGlassOption, deleteGlassOption } = require('../controllers/glassController');
const { protect } = require('../middleware/auth');

router.get('/', getGlassOptions);
router.post('/', protect, createGlassOption);
router.put('/:id', protect, updateGlassOption);
router.delete('/:id', protect, deleteGlassOption);

module.exports = router;
