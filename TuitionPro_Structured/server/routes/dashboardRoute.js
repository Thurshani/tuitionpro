import express from 'express';
import { getState } from '../controllers/dashboardController.js';

const router = express.Router();
router.get('/state', getState);
export default router;
