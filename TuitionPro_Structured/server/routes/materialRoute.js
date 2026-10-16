import express from 'express';
import role from '../middlewares/requireRole.js';
import upload from '../configs/upload.js';
import {
  uploadMaterial,
  downloadMaterial,
  deleteMaterial,
} from '../controllers/materialController.js';

const router = express.Router();
router.post('/', role('admin', 'teacher'), upload.single('file'), uploadMaterial);
router.get('/:id/file', downloadMaterial);
router.delete('/:id', role('admin', 'teacher'), deleteMaterial);
export default router;
