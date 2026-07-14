/**
 * Client Gallery Controller
 *
 * Images are stored locally in server/uploads/ and served as static files.
 * To add cloud storage: update middleware/upload.js and replace the fs.unlink
 * calls below with the cloud provider's delete API.
 */

const fs = require('fs');
const path = require('path');
const prisma = require('../utils/prismaClient');
const slugify = require('slugify');
const { sendClientGalleryReady } = require('../services/emailService');

const slug = (str) => slugify(str, { lower: true, strict: true, trim: true });

/** Derive a public URL from an uploaded file */
const fileToUrl = (file) => `/uploads/${file.filename}`;

/** Delete a local upload file safely (fire-and-forget) */
const deleteLocalFile = (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) return;
  const filePath = path.join(__dirname, '..', imageUrl);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Failed to delete local file:', filePath, err.message);
    }
  });
};

// ─── ADMIN ROUTES ──────────────────────────────────────────────────────────

const createGallery = async (req, res, next) => {
  try {
    const {
      title, clientName, clientEmail, eventName, eventDate,
      description, password, expiryDate, downloadsEnabled, status,
    } = req.body;

    const coverImage = req.file ? fileToUrl(req.file) : (req.body.coverImage || '');

    const gallery = await prisma.clientGallery.create({
      data: {
        title,
        slug: slug(`${title}-${Math.random().toString(36).substring(2, 7)}`),
        clientName,
        eventName,
        description,
        password,
        status: status || 'active',
        coverImage,
        downloadsEnabled: downloadsEnabled === 'true' || downloadsEnabled === true,
        eventDate: eventDate ? new Date(eventDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    });

    if (clientEmail) {
      sendClientGalleryReady(gallery, clientEmail).catch(console.error);
    }

    res.status(201).json({ success: true, data: gallery });
  } catch (err) { next(err); }
};

const getAdminGalleries = async (req, res, next) => {
  try {
    const galleries = await prisma.clientGallery.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { images: true } } },
    });
    res.json({ success: true, data: galleries });
  } catch (err) { next(err); }
};

const getAdminGalleryById = async (req, res, next) => {
  try {
    const gallery = await prisma.clientGallery.findUnique({
      where: { id: req.params.id },
      include: { images: { orderBy: { order: 'asc' } } },
    });
    if (!gallery) return res.status(404).json({ success: false, message: 'Gallery not found.' });
    res.json({ success: true, data: gallery });
  } catch (err) { next(err); }
};

const updateGallery = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      // Delete old cover image
      const existing = await prisma.clientGallery.findUnique({ where: { id: req.params.id }, select: { coverImage: true } });
      if (existing) deleteLocalFile(existing.coverImage);
      updateData.coverImage = fileToUrl(req.file);
    }

    if (updateData.downloadsEnabled !== undefined) {
      updateData.downloadsEnabled = updateData.downloadsEnabled === 'true' || updateData.downloadsEnabled === true;
    }
    if (updateData.eventDate) updateData.eventDate = new Date(updateData.eventDate);
    if (updateData.expiryDate) updateData.expiryDate = new Date(updateData.expiryDate);

    delete updateData.id;

    const gallery = await prisma.clientGallery.update({ where: { id: req.params.id }, data: updateData });
    res.json({ success: true, data: gallery });
  } catch (err) { next(err); }
};

const deleteGallery = async (req, res, next) => {
  try {
    const gallery = await prisma.clientGallery.findUnique({
      where: { id: req.params.id },
      include: { images: true },
    });
    if (!gallery) return res.status(404).json({ success: false, message: 'Not found' });

    // Delete local files for all gallery images
    if (gallery.coverImage) deleteLocalFile(gallery.coverImage);
    for (const img of gallery.images) {
      deleteLocalFile(img.imageUrl);
    }

    await prisma.clientGallery.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Gallery deleted.' });
  } catch (err) { next(err); }
};

const addGalleryImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }

    const galleryId = req.params.id;
    const imagesData = req.files.map((file, index) => ({
      galleryId,
      imageUrl: fileToUrl(file),
      cloudinaryId: null, // reserved for future cloud storage
      order: index,
    }));

    await prisma.galleryImage.createMany({ data: imagesData });
    res.json({ success: true, message: 'Images uploaded.' });
  } catch (err) { next(err); }
};

const deleteGalleryImage = async (req, res, next) => {
  try {
    const img = await prisma.galleryImage.findUnique({ where: { id: req.params.imageId } });
    if (img) deleteLocalFile(img.imageUrl);
    await prisma.galleryImage.delete({ where: { id: req.params.imageId } });
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) { next(err); }
};

// ─── PUBLIC ROUTES (CLIENT FACING) ─────────────────────────────────────────

const verifyAndGetGallery = async (req, res, next) => {
  try {
    const { slug: gallerySlug } = req.params;
    const { password } = req.body;

    const gallery = await prisma.clientGallery.findUnique({ where: { slug: gallerySlug } });

    if (!gallery) return res.status(404).json({ success: false, message: 'Gallery not found.' });
    if (gallery.status !== 'active') return res.status(403).json({ success: false, message: 'This gallery is no longer active.' });
    if (gallery.expiryDate && new Date() > gallery.expiryDate) {
      return res.status(403).json({ success: false, message: 'This gallery has expired.' });
    }

    if (gallery.password && gallery.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    const galleryWithImages = await prisma.clientGallery.findUnique({
      where: { id: gallery.id },
      include: { images: { orderBy: { order: 'asc' } } },
    });

    res.json({ success: true, data: galleryWithImages });
  } catch (err) { next(err); }
};

module.exports = {
  createGallery, getAdminGalleries, getAdminGalleryById, updateGallery, deleteGallery,
  addGalleryImages, deleteGalleryImage, verifyAndGetGallery,
};
