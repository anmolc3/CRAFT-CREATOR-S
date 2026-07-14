/**
 * Size Controller
 */
const prisma = require('../utils/prismaClient');

const getSizes = async (req, res, next) => {
  try {
    const sizes = await prisma.printSize.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: sizes });
  } catch (err) { next(err); }
};

const createSize = async (req, res, next) => {
  try {
    const { label, width, height, basePrice, isCustom, order } = req.body;
    const size = await prisma.printSize.create({
      data: { label, width: Number(width), height: Number(height), basePrice: Number(basePrice), isCustom: isCustom === true, order: Number(order) || 0 },
    });
    res.status(201).json({ success: true, data: size });
  } catch (err) { next(err); }
};

const updateSize = async (req, res, next) => {
  try {
    const { label, width, height, basePrice, isCustom, order } = req.body;
    const size = await prisma.printSize.update({
      where: { id: req.params.id },
      data: { label, width: Number(width), height: Number(height), basePrice: Number(basePrice), isCustom: isCustom === true, order: Number(order) || 0 },
    });
    res.json({ success: true, data: size });
  } catch (err) { next(err); }
};

const deleteSize = async (req, res, next) => {
  try {
    await prisma.printSize.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Size deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getSizes, createSize, updateSize, deleteSize };
