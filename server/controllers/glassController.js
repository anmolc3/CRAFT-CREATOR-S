/**
 * Glass Options Controller — CRUD (Standard Glass, Anti-Glare Glass)
 */
const prisma = require('../utils/prismaClient');

const getGlassOptions = async (req, res, next) => {
  try {
    const options = await prisma.glassOption.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: options });
  } catch (err) { next(err); }
};

const createGlassOption = async (req, res, next) => {
  try {
    const { name, price, order } = req.body;
    const option = await prisma.glassOption.create({ data: { name, price: Number(price) || 0, order: Number(order) || 0 } });
    res.status(201).json({ success: true, data: option });
  } catch (err) { next(err); }
};

const updateGlassOption = async (req, res, next) => {
  try {
    const { name, price, order } = req.body;
    const option = await prisma.glassOption.update({
      where: { id: req.params.id },
      data: { name, price: Number(price), order: Number(order) },
    });
    res.json({ success: true, data: option });
  } catch (err) { next(err); }
};

const deleteGlassOption = async (req, res, next) => {
  try {
    await prisma.glassOption.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Glass option deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getGlassOptions, createGlassOption, updateGlassOption, deleteGlassOption };
