const express = require('express');
const router = express.Router();
const { getFinishes, createFinish, updateFinish, deleteFinish } = require('../controllers/finishesController');
const { protect } = require('../middleware/auth');

router.get('/', getFinishes);
router.post('/', protect, createFinish);
router.put('/:id', protect, updateFinish);
router.delete('/:id', protect, deleteFinish);

module.exports = router;
