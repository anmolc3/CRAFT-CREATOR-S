/**
 * Analytics Controller
 * Track events, provide admin analytics summary
 */
const prisma = require('../utils/prismaClient');

/** POST /api/analytics/track — Record an event */
const trackEvent = async (req, res, next) => {
  try {
    const { event, photoId, meta } = req.body;
    const validEvents = ['view', 'whatsapp_click', 'favorite', 'inquiry_start'];
    if (!validEvents.includes(event)) {
      return res.status(400).json({ success: false, message: 'Invalid event type.' });
    }

    await prisma.analytics.create({
      data: {
        event,
        photoId: photoId || null,
        meta: meta ? JSON.stringify(meta) : null,
      },
    });

    res.json({ success: true, message: 'Event tracked.' });
  } catch (err) { next(err); }
};

/** GET /api/analytics — Admin analytics dashboard data */
const getAnalytics = async (req, res, next) => {
  try {
    const [
      totalPhotos,
      featuredPhotos,
      bestSellers,
      totalViews,
      whatsappClicks,
      favoritesCount,
      newsletterSubscribers,
      recentUploads,
      popularCategories,
      popularCollections,
      mostViewedPhotos,
      topWhatsappPhotos,
    ] = await prisma.$transaction([
      prisma.photo.count({ where: { status: 'published' } }),
      prisma.photo.count({ where: { featured: true } }),
      prisma.photo.count({ where: { bestSeller: true } }),
      prisma.analytics.count({ where: { event: 'view' } }),
      prisma.analytics.count({ where: { event: 'whatsapp_click' } }),
      prisma.analytics.count({ where: { event: 'favorite' } }),
      prisma.newsletter.count(),
      prisma.photo.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { category: { select: { name: true } } },
      }),
      prisma.category.findMany({
        orderBy: { photos: { _count: 'desc' } },
        take: 5,
        include: { _count: { select: { photos: true } } },
      }),
      prisma.collection.findMany({
        orderBy: { photos: { _count: 'desc' } },
        take: 5,
        include: { _count: { select: { photos: true } } },
      }),
      prisma.photo.findMany({
        orderBy: { views: 'desc' },
        take: 8,
        include: { category: { select: { name: true, slug: true } } },
      }),
      prisma.analytics.groupBy({
        by: ['photoId'],
        where: { event: 'whatsapp_click', photoId: { not: null } },
        _count: { photoId: true },
        orderBy: { _count: { photoId: 'desc' } },
        take: 5,
      }),
    ]);

    // Enrich top WhatsApp photos
    const topWhatsappPhotoIds = topWhatsappPhotos.map(t => t.photoId).filter(Boolean);
    const enrichedWhatsapp = await prisma.photo.findMany({
      where: { id: { in: topWhatsappPhotoIds } },
      select: { id: true, title: true, imageUrl: true, slug: true },
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalPhotos,
          featuredPhotos,
          bestSellers,
          totalViews,
          whatsappClicks,
          favoritesCount,
          newsletterSubscribers,
        },
        recentUploads,
        popularCategories,
        popularCollections,
        mostViewedPhotos,
        topWhatsappPhotos: topWhatsappPhotos.map(t => ({
          photoId: t.photoId,
          clicks: t._count.photoId,
          photo: enrichedWhatsapp.find(p => p.id === t.photoId) || null,
        })),
      },
    });
  } catch (err) { next(err); }
};

module.exports = { trackEvent, getAnalytics };
