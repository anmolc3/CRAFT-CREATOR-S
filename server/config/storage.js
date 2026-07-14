/**
 * Storage Configuration
 *
 * Currently: local disk storage via multer (see middleware/upload.js).
 *
 * To add cloud storage in the future (e.g. Cloudinary, S3, Backblaze):
 *  1. Install the relevant SDK here.
 *  2. Export a configured client or storage adapter.
 *  3. Update middleware/upload.js to use it.
 *  4. Update controllers to use the cloud delete API instead of fs.unlink.
 *
 * No changes to routes or other controllers will be required.
 */

module.exports = {
  provider: 'local', // 'local' | 'cloudinary' | 's3'
};
