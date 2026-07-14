const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getBookingById, updateBookingStatus, deleteBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.post('/', upload.array('referenceImages', 5), createBooking);

// Admin
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
