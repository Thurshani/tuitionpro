import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { httpError as fail } from '../utils/httpError.js';
export const uploads = fileURLToPath(new URL('../uploads/', import.meta.url));
fs.mkdirSync(uploads, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: uploads,
    filename: (req, file, cb) =>
      cb(null, crypto.randomUUID() + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: Number(process.env.UPLOAD_LIMIT_MB || 100) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(
      ['.pdf', '.mp4', '.webm'].includes(ext) ? null : fail('Upload a PDF, MP4 or WebM file'),
      ['.pdf', '.mp4', '.webm'].includes(ext),
    );
  },
});
export default upload;
