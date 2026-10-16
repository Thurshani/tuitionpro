import express from 'express';
import role from '../middlewares/requireRole.js';
import { createClass, assignTeacher } from '../controllers/classController.js';

const router = express.Router();
router.post('/', role('admin'), createClass);
router.put('/:id/teacher', role('admin'), assignTeacher);
export default router;
