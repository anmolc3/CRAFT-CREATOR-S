/**
 * Service Controller
 */
const prisma = require('../utils/prismaClient');
const slugify = require('slugify');

const slug = (str) => slugify(str, { lower: true, strict: true, trim: true });

const getServices = async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: services });
  } catch (err) { next(err); }
};

const getServiceBySlug = async (req, res, next) => {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: req.params.slug },
    });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, data: service });
  } catch (err) { next(err); }
};

const createService = async (req, res, next) => {
  try {
    const { title, description, overview, includes, price, duration, faqs, featured, status } = req.body;
    let heroImage = req.body.heroImage || '';
    
    if (req.file) {
      heroImage = req.file.path || req.file.secure_url || heroImage;
    }

    const parsedIncludes = includes ? (typeof includes === 'string' ? JSON.parse(includes) : includes) : [];
    const parsedFaqs = faqs ? (typeof faqs === 'string' ? JSON.parse(faqs) : faqs) : [];

    const service = await prisma.service.create({
      data: {
        title,
        slug: slug(title),
        description,
        overview,
        includes: parsedIncludes,
        price: Number(price) || 0,
        duration,
        heroImage,
        faqs: parsedFaqs,
        featured: featured === 'true' || featured === true,
        status: status || 'active',
      },
    });
    res.status(201).json({ success: true, data: service });
  } catch (err) { next(err); }
};

const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.heroImage = req.file.path || req.file.secure_url;
    }

    if (updateData.title) updateData.slug = slug(updateData.title);
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.includes && typeof updateData.includes === 'string') updateData.includes = JSON.parse(updateData.includes);
    if (updateData.faqs && typeof updateData.faqs === 'string') updateData.faqs = JSON.parse(updateData.faqs);
    if (updateData.featured !== undefined) updateData.featured = updateData.featured === 'true' || updateData.featured === true;

    delete updateData.id;

    const service = await prisma.service.update({ where: { id }, data: updateData });
    res.json({ success: true, data: service });
  } catch (err) { next(err); }
};

const deleteService = async (req, res, next) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Service deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getServices, getServiceBySlug, createService, updateService, deleteService };
