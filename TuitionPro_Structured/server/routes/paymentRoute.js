import express from 'express';
import role from '../middlewares/requireRole.js';
import { updatePayment } from '../controllers/paymentController.js';

const router = express.Router();
router.put('/:id', role('admin', 'teacher'), updatePayment);
export default router;
