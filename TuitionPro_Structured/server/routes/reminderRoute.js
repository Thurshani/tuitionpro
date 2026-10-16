import express from 'express';
import rateLimit from 'express-rate-limit';
import role from '../middlewares/requireRole.js';
import { generateReminder } from '../controllers/reminderController.js';

const router = express.Router();
router.post(
  '/',
  role('admin', 'teacher'),
  rateLimit({ windowMs: 60000, limit: 20 }),
  generateReminder,
);
export default router;
