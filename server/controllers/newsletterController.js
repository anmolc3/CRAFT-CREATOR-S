/**
 * Newsletter Controller
 */
const prisma = require('../utils/prismaClient');

const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You are already subscribed!' });
    }

    await prisma.newsletter.create({ data: { email } });

    res.status(201).json({ success: true, message: 'Thank you for subscribing! You\'ll receive updates on new prints and exhibitions.' });
  } catch (err) { next(err); }
};

const getSubscribers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const [subscribers, total] = await prisma.$transaction([
      prisma.newsletter.findMany({
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { subscribedAt: 'desc' },
      }),
      prisma.newsletter.count(),
    ]);
    res.json({ success: true, data: subscribers, total });
  } catch (err) { next(err); }
};

const deleteSubscriber = async (req, res, next) => {
  try {
    await prisma.newsletter.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Subscriber removed.' });
  } catch (err) { next(err); }
};

module.exports = { subscribe, getSubscribers, deleteSubscriber };
