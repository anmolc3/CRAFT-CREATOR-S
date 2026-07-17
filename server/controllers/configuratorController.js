/**
 * Configurator Controller — Frame configuration options
 * Returns all options needed for the custom frame configurator
 */
const prisma = require('../utils/prismaClient');

const getConfiguratorOptions = async (req, res, next) => {
  try {
    const [frames, sizes, glassOptions, mountOptions, materials, colors, categories] = await Promise.all([
      prisma.frameDesign.findMany({
        where: { isAvailable: true },
        include: { category: true },
        orderBy: [{ featured: 'desc' }, { order: 'asc' }],
      }),
      prisma.frameSize.findMany({ orderBy: { order: 'asc' } }),
      prisma.glassOption.findMany({ orderBy: { order: 'asc' } }),
      prisma.mountOption.findMany({ orderBy: { order: 'asc' } }),
      prisma.frameMaterial.findMany({ orderBy: { order: 'asc' } }),
      prisma.frameColor.findMany({ orderBy: { order: 'asc' } }),
      prisma.frameCategory.findMany({ orderBy: { order: 'asc' } }),
    ]);

    res.json({
      success: true,
      data: { frames, sizes, glassOptions, mountOptions, materials, colors, categories },
    });
  } catch (err) { next(err); }
};

const getSizes = async (req, res, next) => {
  try {
    const sizes = await prisma.frameSize.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: sizes });
  } catch (err) { next(err); }
};

const getGlassOptions = async (req, res, next) => {
  try {
    const options = await prisma.glassOption.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: options });
  } catch (err) { next(err); }
};

const getMountOptions = async (req, res, next) => {
  try {
    const options = await prisma.mountOption.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: options });
  } catch (err) { next(err); }
};

const getMaterials = async (req, res, next) => {
  try {
    const materials = await prisma.frameMaterial.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: materials });
  } catch (err) { next(err); }
};

const getColors = async (req, res, next) => {
  try {
    const colors = await prisma.frameColor.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: colors });
  } catch (err) { next(err); }
};

// Admin CRUD for sizes
const createSize = async (req, res, next) => {
  try {
    const { label, width, height, basePrice, isCustom, order } = req.body;
    const size = await prisma.frameSize.create({
      data: { label, width: Number(width), height: Number(height), basePrice: Number(basePrice) || 1500, isCustom: !!isCustom, order: Number(order) || 0 },
    });
    res.status(201).json({ success: true, data: size });
  } catch (err) { next(err); }
};

const updateSize = async (req, res, next) => {
  try {
    const { label, width, height, basePrice, isCustom, order } = req.body;
    const size = await prisma.frameSize.update({
      where: { id: req.params.id },
      data: { label, width: Number(width), height: Number(height), basePrice: Number(basePrice), isCustom: !!isCustom, order: Number(order) },
    });
    res.json({ success: true, data: size });
  } catch (err) { next(err); }
};

const deleteSize = async (req, res, next) => {
  try {
    await prisma.frameSize.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Size deleted.' });
  } catch (err) { next(err); }
};

// Admin CRUD for glass
const createGlass = async (req, res, next) => {
  try {
    const { name, description, price, order } = req.body;
    const glass = await prisma.glassOption.create({
      data: { name, description, price: Number(price) || 0, order: Number(order) || 0 },
    });
    res.status(201).json({ success: true, data: glass });
  } catch (err) { next(err); }
};

const updateGlass = async (req, res, next) => {
  try {
    const { name, description, price, order } = req.body;
    const glass = await prisma.glassOption.update({
      where: { id: req.params.id },
      data: { name, description, price: Number(price), order: Number(order) },
    });
    res.json({ success: true, data: glass });
  } catch (err) { next(err); }
};

const deleteGlass = async (req, res, next) => {
  try {
    await prisma.glassOption.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Glass option deleted.' });
  } catch (err) { next(err); }
};

// Admin CRUD for mount
const createMount = async (req, res, next) => {
  try {
    const { name, description, price, order } = req.body;
    const mount = await prisma.mountOption.create({
      data: { name, description, price: Number(price) || 0, order: Number(order) || 0 },
    });
    res.status(201).json({ success: true, data: mount });
  } catch (err) { next(err); }
};

const updateMount = async (req, res, next) => {
  try {
    const { name, description, price, order } = req.body;
    const mount = await prisma.mountOption.update({
      where: { id: req.params.id },
      data: { name, description, price: Number(price), order: Number(order) },
    });
    res.json({ success: true, data: mount });
  } catch (err) { next(err); }
};

const deleteMount = async (req, res, next) => {
  try {
    await prisma.mountOption.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Mount option deleted.' });
  } catch (err) { next(err); }
};

module.exports = {
  getConfiguratorOptions,
  getSizes, getGlassOptions, getMountOptions, getMaterials, getColors,
  createSize, updateSize, deleteSize,
  createGlass, updateGlass, deleteGlass,
  createMount, updateMount, deleteMount,
};
