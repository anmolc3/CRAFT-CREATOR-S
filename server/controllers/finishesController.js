/**
 * Print Finishes Controller — CRUD (Matte, Glossy, Fine Art Paper, Canvas)
 */
const prisma = require('../utils/prismaClient');

const getFinishes = async (req, res, next) => {
  try {
    const finishes = await prisma.printFinish.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: finishes });
  } catch (err) { next(err); }
};

const createFinish = async (req, res, next) => {
  try {
    const { name, price, order } = req.body;
    const finish = await prisma.printFinish.create({ data: { name, price: Number(price) || 0, order: Number(order) || 0 } });
    res.status(201).json({ success: true, data: finish });
  } catch (err) { next(err); }
};

const updateFinish = async (req, res, next) => {
  try {
    const { name, price, order } = req.body;
    const finish = await prisma.printFinish.update({
      where: { id: req.params.id },
      data: { name, price: Number(price), order: Number(order) },
    });
    res.json({ success: true, data: finish });
  } catch (err) { next(err); }
};

const deleteFinish = async (req, res, next) => {
  try {
    await prisma.printFinish.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Finish deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getFinishes, createFinish, updateFinish, deleteFinish };
