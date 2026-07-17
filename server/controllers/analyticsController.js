/**
 * Analytics Controller — Dashboard stats
 * CRAFT CREATOR'S Custom Photo Framing Studio
 */
const prisma = require('../utils/prismaClient');

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalFrames,
      featuredFrames,
      totalInquiries,
      pendingInquiries,
      totalSubscribers,
      whatsappClicks,
      recentInquiries,
      popularFrames,
    ] = await Promise.all([
      prisma.frameDesign.count({ where: { isAvailable: true } }),
      prisma.frameDesign.count({ where: { featured: true } }),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'pending' } }),
      prisma.newsletter.count(),
      prisma.analytics.count({ where: { event: 'whatsapp_click' } }),
      prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.frameDesign.findMany({
        where: { isAvailable: true },
        orderBy: { views: 'desc' },
        take: 5,
        include: { category: true },
      }),
    ]);

    // Status breakdown
    const [confirmed, inProgress, completed, cancelled] = await Promise.all([
      prisma.inquiry.count({ where: { status: 'confirmed' } }),
      prisma.inquiry.count({ where: { status: 'in_progress' } }),
      prisma.inquiry.count({ where: { status: 'completed' } }),
      prisma.inquiry.count({ where: { status: 'cancelled' } }),
    ]);

    res.json({
      success: true,
      data: {
        totalFrames,
        featuredFrames,
        totalInquiries,
        inquiryBreakdown: { pending: pendingInquiries, confirmed, inProgress, completed, cancelled },
        totalSubscribers,
        whatsappClicks,
        recentInquiries,
        popularFrames,
      },
    });
  } catch (err) { next(err); }
};

const trackEvent = async (req, res, next) => {
  try {
    const { event, frameId, meta } = req.body;
    await prisma.analytics.create({
      data: { event, frameId: frameId || null, meta: meta ? JSON.stringify(meta) : null },
    });
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getDashboardStats, trackEvent };
