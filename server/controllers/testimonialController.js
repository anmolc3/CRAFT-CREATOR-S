/**
 * Testimonial Controller
 */
const prisma = require('../utils/prismaClient');

const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: testimonials });
  } catch (err) { next(err); }
};

const createTestimonial = async (req, res, next) => {
  try {
    const { name, title, quote, rating, photoUrl } = req.body;
    const testimonial = await prisma.testimonial.create({
      data: { name, title, quote, rating: Number(rating) || 5, photoUrl },
    });
    res.status(201).json({ success: true, data: testimonial });
  } catch (err) { next(err); }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const { name, title, quote, rating, photoUrl } = req.body;
    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: { name, title, quote, rating: Number(rating), photoUrl },
    });
    res.json({ success: true, data: testimonial });
  } catch (err) { next(err); }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Testimonial deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
