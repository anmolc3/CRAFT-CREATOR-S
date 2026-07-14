/**
 * Settings Controller — Singleton site settings
 */
const prisma = require('../utils/prismaClient');

const getSettings = async (req, res, next) => {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
};

const updateSettings = async (req, res, next) => {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: req.body });
    } else {
      settings = await prisma.settings.update({ where: { id: settings.id }, data: req.body });
    }
    res.json({ success: true, data: settings, message: 'Settings updated.' });
  } catch (err) { next(err); }
};

module.exports = { getSettings, updateSettings };
