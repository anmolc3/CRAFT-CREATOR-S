const express = require('express');
const router = express.Router();
const { getMountOptions, createMountOption, updateMountOption, deleteMountOption } = require('../controllers/mountController');
const { protect } = require('../middleware/auth');

router.get('/', getMountOptions);
router.post('/', protect, createMountOption);
router.put('/:id', protect, updateMountOption);
router.delete('/:id', protect, deleteMountOption);

module.exports = router;
