import express from 'express';
import role from '../middlewares/requireRole.js';
import { sendNotification } from '../controllers/notificationController.js';

const router = express.Router();
router.post('/', role('admin', 'teacher'), sendNotification);
export default router;
