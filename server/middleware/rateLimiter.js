/**
 * Rate Limiters
 * Protect API endpoints from abuse
 */

const rateLimit = require('express-rate-limit');

/** Global API rate limiter — 200 requests per 15 minutes */
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

/** Strict limiter for auth routes — 10 attempts per 15 minutes */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
});

/** Newsletter subscribe — 5 per hour */
const newsletterRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many subscription attempts. Try again in an hour.' },
});

module.exports = { globalRateLimiter, authRateLimiter, newsletterRateLimiter };
