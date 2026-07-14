/**
 * Collection Controller
 */

const prisma = require('../utils/prismaClient');
const slugify = require('slugify');
const slug = (str) => slugify(str, { lower: true, strict: true, trim: true });

const getCollections = async (req, res, next) => {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { photos: true } },
        photos: {
          take: 4,
          orderBy: { order: 'asc' },
          include: { photo: { select: { id: true, title: true, imageUrl: true, slug: true } } },
        },
      },
    });
    res.json({ success: true, data: collections });
  } catch (err) { next(err); }
};

const getCollectionBySlug = async (req, res, next) => {
  try {
    const collection = await prisma.collection.findUnique({
      where: { slug: req.params.slug },
      include: {
        photos: {
          orderBy: { order: 'asc' },
          include: {
            photo: {
              include: { category: { select: { name: true, slug: true } } },
            },
          },
        },
      },
    });
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found.' });
    res.json({ success: true, data: collection });
  } catch (err) { next(err); }
};

const createCollection = async (req, res, next) => {
  try {
    const { name, description, imageUrl, order } = req.body;
    const collection = await prisma.collection.create({
      data: { name, slug: slug(name), description, imageUrl, order: Number(order) || 0 },
    });
    res.status(201).json({ success: true, data: collection });
  } catch (err) { next(err); }
};

const updateCollection = async (req, res, next) => {
  try {
    const { name, description, imageUrl, order } = req.body;
    const data = { description, imageUrl, order: Number(order) || 0 };
    if (name) { data.name = name; data.slug = slug(name); }
    const collection = await prisma.collection.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: collection });
  } catch (err) { next(err); }
};

const deleteCollection = async (req, res, next) => {
  try {
    await prisma.collection.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Collection deleted.' });
  } catch (err) { next(err); }
};

/** POST /api/collections/:id/photos — Add photo to collection */
const addPhotoToCollection = async (req, res, next) => {
  try {
    const { photoId, order = 0 } = req.body;
    const record = await prisma.collectionPhoto.upsert({
      where: { collectionId_photoId: { collectionId: req.params.id, photoId } },
      update: { order: Number(order) },
      create: { collectionId: req.params.id, photoId, order: Number(order) },
    });
    res.json({ success: true, data: record });
  } catch (err) { next(err); }
};

/** DELETE /api/collections/:id/photos/:photoId */
const removePhotoFromCollection = async (req, res, next) => {
  try {
    await prisma.collectionPhoto.delete({
      where: { collectionId_photoId: { collectionId: req.params.id, photoId: req.params.photoId } },
    });
    res.json({ success: true, message: 'Photo removed from collection.' });
  } catch (err) { next(err); }
};

module.exports = { getCollections, getCollectionBySlug, createCollection, updateCollection, deleteCollection, addPhotoToCollection, removePhotoFromCollection };
