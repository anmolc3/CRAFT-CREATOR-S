/**
 * Mount Options Controller — CRUD (With Mount, Without Mount)
 */
const prisma = require('../utils/prismaClient');

const getMountOptions = async (req, res, next) => {
  try {
    const options = await prisma.mountOption.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: options });
  } catch (err) { next(err); }
};

const createMountOption = async (req, res, next) => {
  try {
    const { name, price, order } = req.body;
    const option = await prisma.mountOption.create({ data: { name, price: Number(price) || 0, order: Number(order) || 0 } });
    res.status(201).json({ success: true, data: option });
  } catch (err) { next(err); }
};

const updateMountOption = async (req, res, next) => {
  try {
    const { name, price, order } = req.body;
    const option = await prisma.mountOption.update({
      where: { id: req.params.id },
      data: { name, price: Number(price), order: Number(order) },
    });
    res.json({ success: true, data: option });
  } catch (err) { next(err); }
};

const deleteMountOption = async (req, res, next) => {
  try {
    await prisma.mountOption.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Mount option deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getMountOptions, createMountOption, updateMountOption, deleteMountOption };
