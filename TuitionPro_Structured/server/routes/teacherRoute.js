import express from 'express';
import role from '../middlewares/requireRole.js';
import { createTeacher } from '../controllers/teacherController.js';

const router = express.Router();
router.post('/', role('admin'), createTeacher);
export default router;
