/**
 * Photo Controller
 * CRUD for photographs — public reads, admin writes.
 *
 * Images are stored locally in server/uploads/ and served as static files.
 * To add cloud storage: update middleware/upload.js and replace the fs.unlink
 * calls in deletePhoto/updatePhoto with the cloud provider's delete API.
 */

const fs = require('fs');
const path = require('path');
const prisma = require('../utils/prismaClient');
const slugify = require('slugify');

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

/** GET /api/photos — Paginated photo list with filters */
const getPhotos = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      collection,
      featured,
      bestSeller,
      limitedEdition,
      search,
      sort = 'createdAt',
      order = 'desc',
      status = 'published',
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where = { status };

    if (category) {
      where.category = { slug: category };
    }
    if (collection) {
      where.collections = { some: { collection: { slug: collection } } };
    }
    if (featured === 'true') where.featured = true;
    if (bestSeller === 'true') where.bestSeller = true;
    if (limitedEdition === 'true') where.limitedEdition = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    const validSortFields = ['createdAt', 'views', 'title', 'basePrice'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    const [photos, total] = await prisma.$transaction([
      prisma.photo.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortField]: sortOrder },
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.photo.count({ where }),
    ]);

    res.json({
      success: true,
      data: photos,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/photos/:slug — Single photo by slug */
const getPhotoBySlug = async (req, res, next) => {
  try {
    const photo = await prisma.photo.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        collections: { include: { collection: { select: { id: true, name: true, slug: true } } } },
      },
    });

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found.' });
    }

    // Increment view count (fire-and-forget)
    prisma.photo.update({
      where: { id: photo.id },
      data: { views: { increment: 1 } },
    }).catch(() => {});

    res.json({ success: true, data: photo });
  } catch (err) {
    next(err);
  }
};

/** GET /api/photos/:slug/related — Related photos by category */
const getRelatedPhotos = async (req, res, next) => {
  try {
    const photo = await prisma.photo.findUnique({
      where: { slug: req.params.slug },
      select: { id: true, categoryId: true },
    });

    if (!photo) return res.status(404).json({ success: false, message: 'Photo not found.' });

    const related = await prisma.photo.findMany({
      where: {
        categoryId: photo.categoryId,
        id: { not: photo.id },
        status: 'published',
      },
      take: 6,
      orderBy: { views: 'desc' },
      include: { category: { select: { name: true, slug: true } } },
    });

    res.json({ success: true, data: related });
  } catch (err) {
    next(err);
  }
};

/** POST /api/photos — Create photo (admin) */
const createPhoto = async (req, res, next) => {
  try {
    const {
      title, description, story, camera, lens, iso, aperture, shutterSpeed,
      location, dateTaken, tags, palette, featured, bestSeller, limitedEdition,
      editionSize, editionSold, status, categoryId, basePrice, orientation, resolution,
    } = req.body;

    // imageUrl: prefer uploaded file, then manually provided URL
    const imageUrl = req.file ? fileToUrl(req.file) : (req.body.imageUrl || '');

    const photoSlug = slug(title);

    const photo = await prisma.photo.create({
      data: {
        title,
        slug: photoSlug,
        description,
        story,
        imageUrl,
        galleryImages: [],
        cloudinaryId: null,
        camera,
        lens,
        iso,
        aperture,
        shutterSpeed,
        location,
        resolution,
        orientation: orientation || 'landscape',
        dateTaken: dateTaken ? new Date(dateTaken) : null,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
        palette: Array.isArray(palette) ? palette : (palette ? palette.split(',').map(p => p.trim()) : []),
        featured: featured === 'true' || featured === true,
        bestSeller: bestSeller === 'true' || bestSeller === true,
        limitedEdition: limitedEdition === 'true' || limitedEdition === true,
        editionSize: editionSize ? Number(editionSize) : 100,
        editionSold: editionSold ? Number(editionSold) : 0,
        status: status || 'published',
        categoryId: categoryId || null,
        basePrice: basePrice ? Number(basePrice) : 4500,
      },
    });

    res.status(201).json({ success: true, data: photo, message: 'Photo created successfully.' });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/photos/:id — Update photo (admin) */
const updatePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      // Delete old local file if it exists
      const existing = await prisma.photo.findUnique({ where: { id }, select: { imageUrl: true } });
      if (existing) deleteLocalFile(existing.imageUrl);

      updateData.imageUrl = fileToUrl(req.file);
      updateData.cloudinaryId = null;
    }

    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim());
    }
    if (updateData.palette && typeof updateData.palette === 'string') {
      updateData.palette = updateData.palette.split(',').map(p => p.trim());
    }
    if (updateData.galleryImages && typeof updateData.galleryImages === 'string') {
      updateData.galleryImages = updateData.galleryImages.split(',').map(u => u.trim());
    }
    if (updateData.dateTaken) updateData.dateTaken = new Date(updateData.dateTaken);
    if (updateData.basePrice) updateData.basePrice = Number(updateData.basePrice);
    if (updateData.editionSize !== undefined) updateData.editionSize = Number(updateData.editionSize);
    if (updateData.editionSold !== undefined) updateData.editionSold = Number(updateData.editionSold);
    if (updateData.featured !== undefined) updateData.featured = updateData.featured === 'true' || updateData.featured === true;
    if (updateData.bestSeller !== undefined) updateData.bestSeller = updateData.bestSeller === 'true' || updateData.bestSeller === true;
    if (updateData.limitedEdition !== undefined) updateData.limitedEdition = updateData.limitedEdition === 'true' || updateData.limitedEdition === true;

    if (updateData.title) updateData.slug = slug(updateData.title);
    delete updateData.id;

    const photo = await prisma.photo.update({ where: { id }, data: updateData });
    res.json({ success: true, data: photo, message: 'Photo updated.' });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/photos/:id — Delete photo (admin) */
const deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const photo = await prisma.photo.findUnique({ where: { id } });

    if (!photo) return res.status(404).json({ success: false, message: 'Photo not found.' });

    // Delete main image and all gallery images from local storage
    deleteLocalFile(photo.imageUrl);
    if (Array.isArray(photo.galleryImages)) {
      photo.galleryImages.forEach(url => deleteLocalFile(url));
    }

    await prisma.photo.delete({ where: { id } });
    res.json({ success: true, message: 'Photo deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPhotos, getPhotoBySlug, getRelatedPhotos, createPhoto, updatePhoto, deletePhoto };
