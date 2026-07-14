/**
 * Multer local disk storage upload middleware.
 *
 * Uploads are stored in server/uploads/ and served as static files
 * at http://localhost:5000/uploads/<filename>.
 *
 * To swap in cloud storage later:
 *  - Install your cloud SDK (e.g. cloudinary, aws-sdk).
 *  - Update config/storage.js with the client.
 *  - Replace `multer.diskStorage` below with the cloud storage engine.
 *  - Update controllers to use the cloud delete API instead of fs.unlink.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(file.mimetype)) return cb(null, true);
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed.'));
  },
});

module.exports = upload;
