/**
 * Frame Controller
 */
const prisma = require('../utils/prismaClient');

const getFrames = async (req, res, next) => {
  try {
    const frames = await prisma.frame.findMany({ orderBy: { price: 'asc' } });
    res.json({ success: true, data: frames });
  } catch (err) { next(err); }
};

const createFrame = async (req, res, next) => {
  try {
    const { name, color, material, price } = req.body;
    const frame = await prisma.frame.create({ data: { name, color, material, price: Number(price) } });
    res.status(201).json({ success: true, data: frame });
  } catch (err) { next(err); }
};

const updateFrame = async (req, res, next) => {
  try {
    const { name, color, material, price } = req.body;
    const frame = await prisma.frame.update({
      where: { id: req.params.id },
      data: { name, color, material, price: Number(price) },
    });
    res.json({ success: true, data: frame });
  } catch (err) { next(err); }
};

const deleteFrame = async (req, res, next) => {
  try {
    await prisma.frame.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Frame deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getFrames, createFrame, updateFrame, deleteFrame };
