/**
 * Frame Design Controller — Full CRUD for frame designs
 * CRAFT CREATOR'S Custom Photo Framing Studio
 */
const prisma = require('../utils/prismaClient');
const slugify = require('slugify');

const slug = (str) => slugify(str, { lower: true, strict: true, trim: true });

// ─── GET All Frames ───────────────────────────────────────────────────────────
const getFrames = async (req, res, next) => {
  try {
    const { category, material, featured, bestseller, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = { isAvailable: true };

    if (featured === 'true') where.featured = true;
    if (bestseller === 'true') where.bestseller = true;
    if (material) where.material = material;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { material: { contains: search } },
      ];
    }
    if (category) {
      where.category = { slug: category };
    }

    const [frames, total] = await Promise.all([
      prisma.frameDesign.findMany({
        where,
        include: { category: true },
        orderBy: [{ featured: 'desc' }, { bestseller: 'desc' }, { order: 'asc' }],
        skip,
        take: Number(limit),
      }),
      prisma.frameDesign.count({ where }),
    ]);

    res.json({
      success: true,
      data: frames,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) { next(err); }
};

// ─── GET Single Frame by Slug ─────────────────────────────────────────────────
const getFrameBySlug = async (req, res, next) => {
  try {
    const frame = await prisma.frameDesign.findUnique({
      where: { slug: req.params.slug },
      include: { category: true, reviews: true },
    });
    if (!frame) return res.status(404).json({ success: false, message: 'Frame not found.' });

    // Track view
    await prisma.frameDesign.update({
      where: { id: frame.id },
      data: { views: frame.views + 1 },
    }).catch(() => {});

    // Related frames (same category, different frame)
    const related = await prisma.frameDesign.findMany({
      where: {
        categoryId: frame.categoryId,
        id: { not: frame.id },
        isAvailable: true,
      },
      include: { category: true },
      take: 4,
      orderBy: { featured: 'desc' },
    });

    res.json({ success: true, data: { ...frame, related } });
  } catch (err) { next(err); }
};

// ─── POST Create Frame (Admin) ────────────────────────────────────────────────
const createFrame = async (req, res, next) => {
  try {
    const {
      name, description, imageUrl, galleryImages = [],
      material, colors = [], availableSizes = [],
      thickness, basePrice, productionDays,
      featured, bestseller, isAvailable, categoryId, order,
    } = req.body;

    if (!name || !imageUrl || !material) {
      return res.status(400).json({ success: false, message: 'Name, imageUrl, and material are required.' });
    }

    const frameSlug = slug(name);

    // Check slug uniqueness
    const existing = await prisma.frameDesign.findUnique({ where: { slug: frameSlug } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A frame with this name already exists.' });
    }

    const frame = await prisma.frameDesign.create({
      data: {
        name, slug: frameSlug, description, imageUrl,
        galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
        material,
        colors: Array.isArray(colors) ? colors : [],
        availableSizes: Array.isArray(availableSizes) ? availableSizes : [],
        thickness: thickness || '2cm',
        basePrice: Number(basePrice) || 2000,
        productionDays: Number(productionDays) || 3,
        featured: !!featured,
        bestseller: !!bestseller,
        isAvailable: isAvailable !== false,
        categoryId: categoryId || null,
        order: Number(order) || 0,
        views: 0,
      },
    });

    res.status(201).json({ success: true, data: frame });
  } catch (err) { next(err); }
};

// ─── PUT Update Frame (Admin) ─────────────────────────────────────────────────
const updateFrame = async (req, res, next) => {
  try {
    const {
      name, description, imageUrl, galleryImages,
      material, colors, availableSizes,
      thickness, basePrice, productionDays,
      featured, bestseller, isAvailable, categoryId, order,
    } = req.body;

    const data = {};
    if (name !== undefined) { data.name = name; data.slug = slug(name); }
    if (description !== undefined) data.description = description;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (galleryImages !== undefined) data.galleryImages = galleryImages;
    if (material !== undefined) data.material = material;
    if (colors !== undefined) data.colors = colors;
    if (availableSizes !== undefined) data.availableSizes = availableSizes;
    if (thickness !== undefined) data.thickness = thickness;
    if (basePrice !== undefined) data.basePrice = Number(basePrice);
    if (productionDays !== undefined) data.productionDays = Number(productionDays);
    if (featured !== undefined) data.featured = !!featured;
    if (bestseller !== undefined) data.bestseller = !!bestseller;
    if (isAvailable !== undefined) data.isAvailable = !!isAvailable;
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (order !== undefined) data.order = Number(order);

    const frame = await prisma.frameDesign.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, data: frame });
  } catch (err) { next(err); }
};

// ─── DELETE Frame (Admin) ─────────────────────────────────────────────────────
const deleteFrame = async (req, res, next) => {
  try {
    await prisma.frameDesign.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Frame deleted.' });
  } catch (err) { next(err); }
};

// ─── Track Analytics ──────────────────────────────────────────────────────────
const trackFrameEvent = async (req, res, next) => {
  try {
    const { event, frameId, meta } = req.body;
    await prisma.analytics.create({
      data: {
        event: event || 'frame_view',
        frameId: frameId || null,
        meta: meta ? JSON.stringify(meta) : null,
      },
    });
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getFrames, getFrameBySlug, createFrame, updateFrame, deleteFrame, trackFrameEvent };
