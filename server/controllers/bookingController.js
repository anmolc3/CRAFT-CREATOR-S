/**
 * Booking Controller
 */
const prisma = require('../utils/prismaClient');
const { sendBookingConfirmation, sendBookingStatusUpdate } = require('../services/emailService');

const createBooking = async (req, res, next) => {
  try {
    const { name, email, phone, whatsapp, eventType, preferredDate, alternateDate, time, location, guests, budget, requirements, serviceId } = req.body;
    
    // Process optional uploaded reference images
    let referenceImages = [];
    if (req.files && req.files.length > 0) {
      referenceImages = req.files.map(f => f.path || f.secure_url);
    }

    const booking = await prisma.booking.create({
      data: {
        name, email, phone, whatsapp, eventType, time, location, requirements,
        guests: guests ? Number(guests) : null,
        budget: budget ? Number(budget) : null,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        alternateDate: alternateDate ? new Date(alternateDate) : null,
        referenceImages,
        serviceId: serviceId || null,
      },
    });

    // Send async email notification
    sendBookingConfirmation(booking).catch(console.error);

    res.status(201).json({ success: true, data: booking, message: 'Booking request received successfully.' });
  } catch (err) { next(err); }
};

const getBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { eventType: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [bookings, total] = await prisma.$transaction([
      prisma.booking.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { service: { select: { title: true } } }
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) { next(err); }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { service: { select: { title: true } } }
    });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status, notes },
    });

    // Send async email notification for status update
    sendBookingStatusUpdate(booking).catch(console.error);

    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
};

const deleteBooking = async (req, res, next) => {
  try {
    await prisma.booking.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Booking deleted.' });
  } catch (err) { next(err); }
};

module.exports = { createBooking, getBookings, getBookingById, updateBookingStatus, deleteBooking };
