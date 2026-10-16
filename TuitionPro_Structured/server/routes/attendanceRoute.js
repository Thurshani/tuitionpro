import express from 'express';
import role from '../middlewares/requireRole.js';
import { saveAttendance } from '../controllers/attendanceController.js';

const router = express.Router();
router.put('/', role('admin', 'teacher'), saveAttendance);
export default router;
