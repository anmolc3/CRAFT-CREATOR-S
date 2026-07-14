/**
 * Blog Controller
 */
const prisma = require('../utils/prismaClient');
const slugify = require('slugify');
const slug = (str) => slugify(str, { lower: true, strict: true, trim: true });

const getBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, published } = req.query;
    const where = {};
    if (published !== undefined) where.published = published === 'true';
    else where.published = true; // Public only sees published

    const [blogs, total] = await prisma.$transaction([
      prisma.blog.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } },
      }),
      prisma.blog.count({ where }),
    ]);

    res.json({
      success: true,
      data: blogs,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) { next(err); }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: req.params.slug },
      include: { author: { select: { name: true } } },
    });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found.' });
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
};

const createBlog = async (req, res, next) => {
  try {
    const { title, excerpt, content, coverImage, tags, published } = req.body;
    const blog = await prisma.blog.create({
      data: {
        title,
        slug: slug(title),
        excerpt,
        content,
        coverImage,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
        published: published === true || published === 'true',
        authorId: req.admin.id,
      },
    });
    res.status(201).json({ success: true, data: blog });
  } catch (err) { next(err); }
};

const updateBlog = async (req, res, next) => {
  try {
    const { title, excerpt, content, coverImage, tags, published } = req.body;
    const data = { excerpt, content, coverImage, published: published === true || published === 'true' };
    if (title) { data.title = title; data.slug = slug(title); }
    if (tags) data.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    const blog = await prisma.blog.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
};

const deleteBlog = async (req, res, next) => {
  try {
    await prisma.blog.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Blog post deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };
