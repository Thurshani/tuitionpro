import express from 'express';
import rateLimit from 'express-rate-limit';
import authUser from '../middlewares/authUser.js';
import { login, changePassword } from '../controllers/authController.js';

const router = express.Router();
router.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }), login);
router.put('/password', authUser, changePassword);
export default router;
