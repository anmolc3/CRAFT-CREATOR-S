/**
 * Inquiry Controller — Customer framing inquiries
 * CRAFT CREATOR'S Custom Photo Framing Studio
 */
const path = require('path');
const fs = require('fs');
const prisma = require('../utils/prismaClient');

// ─── GET All Inquiries (Admin) ─────────────────────────────────────────────────
const getInquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { frameName: { contains: search } },
      ];
    }

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.inquiry.count({ where }),
    ]);

    res.json({
      success: true,
      data: inquiries,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) { next(err); }
};

// ─── GET Single Inquiry ────────────────────────────────────────────────────────
const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.params.id } });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true, data: inquiry });
  } catch (err) { next(err); }
};

// ─── POST Create Inquiry (Public) ─────────────────────────────────────────────
const createInquiry = async (req, res, next) => {
  try {
    const {
      customerName, email, phone, whatsapp,
      frameName, frameId, material, color, size,
      customWidth, customHeight, glass, mount, quantity,
      photoOption,
    } = req.body;

    if (!customerName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
    }

    // Handle uploaded image
    let uploadedImageUrl = null;
    if (req.file) {
      uploadedImageUrl = `/uploads/inquiries/${req.file.filename}`;
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        customerName,
        email,
        phone,
        whatsapp: whatsapp || null,
        frameName: frameName || null,
        frameId: frameId || null,
        material: material || null,
        color: color || null,
        size: size || null,
        customWidth: customWidth ? Number(customWidth) : null,
        customHeight: customHeight ? Number(customHeight) : null,
        glass: glass || null,
        mount: mount || null,
        quantity: Number(quantity) || 1,
        photoOption: photoOption || 'upload',
        uploadedImageUrl,
        status: 'pending',
      },
    });

    // Track analytics
    await prisma.analytics.create({
      data: {
        event: 'inquiry_submit',
        frameId: frameId || null,
        meta: JSON.stringify({ frameName, size }),
      },
    }).catch(() => {});

    res.status(201).json({ success: true, data: inquiry, message: 'Inquiry submitted successfully!' });
  } catch (err) { next(err); }
};

// ─── PUT Update Inquiry (Admin) ────────────────────────────────────────────────
const updateInquiry = async (req, res, next) => {
  try {
    const { status, notes, totalEstimate } = req.body;
    const data = {};
    if (status !== undefined) data.status = status;
    if (notes !== undefined) data.notes = notes;
    if (totalEstimate !== undefined) data.totalEstimate = Number(totalEstimate);

    const inquiry = await prisma.inquiry.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, data: inquiry });
  } catch (err) { next(err); }
};

// ─── DELETE Inquiry (Admin) ────────────────────────────────────────────────────
const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.params.id } });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });

    // Remove uploaded file if it exists
    if (inquiry.uploadedImageUrl) {
      const filePath = path.join(__dirname, '..', inquiry.uploadedImageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.inquiry.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Inquiry deleted.' });
  } catch (err) { next(err); }
};

// ─── GET Stats (Admin Dashboard) ──────────────────────────────────────────────
const getInquiryStats = async (req, res, next) => {
  try {
    const [total, pending, confirmed, inProgress, completed, cancelled, recent] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'pending' } }),
      prisma.inquiry.count({ where: { status: 'confirmed' } }),
      prisma.inquiry.count({ where: { status: 'in_progress' } }),
      prisma.inquiry.count({ where: { status: 'completed' } }),
      prisma.inquiry.count({ where: { status: 'cancelled' } }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    res.json({
      success: true,
      data: { total, pending, confirmed, inProgress, completed, cancelled, recent },
    });
  } catch (err) { next(err); }
};

module.exports = { getInquiries, getInquiryById, createInquiry, updateInquiry, deleteInquiry, getInquiryStats };
