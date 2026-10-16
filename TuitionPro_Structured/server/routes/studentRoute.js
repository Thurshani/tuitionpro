import express from 'express';
import role from '../middlewares/requireRole.js';
import { createStudent } from '../controllers/studentController.js';

const router = express.Router();
router.post('/', role('admin', 'teacher'), createStudent);
export default router;
