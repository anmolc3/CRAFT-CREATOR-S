/**
 * Auth Controller
 * Admin login/logout, token refresh
 */

const bcrypt = require('bcryptjs');
const prisma = require('../utils/prismaClient');
const { signToken } = require('../utils/jwtUtils');

/** POST /api/auth/login */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = signToken({ id: admin.id, email: admin.email });

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        admin: { id: admin.id, name: admin.name, email: admin.email },
      },
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/auth/me — Get logged-in admin profile */
const getMe = async (req, res) => {
  res.json({ success: true, data: req.admin });
};

module.exports = { login, getMe };
