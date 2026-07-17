/**
 * Category Controller — Frame Categories CRUD
 * CRAFT CREATOR'S Custom Photo Framing Studio
 */
const prisma = require('../utils/prismaClient');
const slugify = require('slugify');
const slug = (str) => slugify(str, { lower: true, strict: true, trim: true });

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.frameCategory.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { frames: true } } },
    });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await prisma.frameCategory.findUnique({
      where: { slug: req.params.slug },
      include: { frames: { where: { isAvailable: true }, orderBy: { featured: 'desc' } } },
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, imageUrl, order } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required.' });
    const category = await prisma.frameCategory.create({
      data: { name, slug: slug(name), description, imageUrl, order: Number(order) || 0 },
    });
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, description, imageUrl, order } = req.body;
    const data = {};
    if (name !== undefined) { data.name = name; data.slug = slug(name); }
    if (description !== undefined) data.description = description;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (order !== undefined) data.order = Number(order);
    const category = await prisma.frameCategory.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
};

const deleteCategory = async (req, res, next) => {
  try {
    await prisma.frameCategory.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
