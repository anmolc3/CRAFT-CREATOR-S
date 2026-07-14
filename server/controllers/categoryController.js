/**
 * Category Controller
 */

const prisma = require('../utils/prismaClient');
const slugify = require('slugify');
const slug = (str) => slugify(str, { lower: true, strict: true, trim: true });

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { photos: { where: { status: 'published' } } } } },
    });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        photos: {
          where: { status: 'published' },
          orderBy: { createdAt: 'desc' },
          include: { category: { select: { name: true, slug: true } } },
        },
      },
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, imageUrl, order } = req.body;
    const category = await prisma.category.create({
      data: { name, slug: slug(name), description, imageUrl, order: Number(order) || 0 },
    });
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, order } = req.body;
    const data = { description, imageUrl, order: Number(order) || 0 };
    if (name) { data.name = name; data.slug = slug(name); }
    const category = await prisma.category.update({ where: { id }, data });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
};

const deleteCategory = async (req, res, next) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
