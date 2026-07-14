/**
 * SIKHAR PHOTOGRAPHY — Main Server Entry Point
 * Express REST API with Prisma + PostgreSQL
 */

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const corsConfig = require('./config/cors');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
const categoryRoutes = require('./routes/categories');
const collectionRoutes = require('./routes/collections');
const frameRoutes = require('./routes/frames');
const sizeRoutes = require('./routes/sizes');
const blogRoutes = require('./routes/blogs');
const testimonialRoutes = require('./routes/testimonials');
const newsletterRoutes = require('./routes/newsletter');
const settingsRoutes = require('./routes/settings');
const analyticsRoutes = require('./routes/analytics');

// Phase 2 Extension Routes
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const clientGalleryRoutes = require('./routes/clientGalleries');

// Print Configurator Routes
const finishRoutes = require('./routes/finishes');
const glassRoutes = require('./routes/glass');
const mountRoutes = require('./routes/mount');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors(corsConfig));

// ─── Body Parsers ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static Uploads (local dev fallback) ─────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api', globalRateLimiter);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/frames', frameRoutes);
app.use('/api/sizes', sizeRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Phase 2 Extensions
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/client-galleries', clientGalleryRoutes);

// Print Configurator
app.use('/api/finishes', finishRoutes);
app.use('/api/glass', glassRoutes);
app.use('/api/mount', mountRoutes);

// ─── 404 for unknown API routes ───────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}\n`);
});

module.exports = app;
