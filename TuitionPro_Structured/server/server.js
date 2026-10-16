import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { query } from './configs/db.js';
import authUser from './middlewares/authUser.js';
import errorHandler from './middlewares/errorHandler.js';
import authRouter from './routes/authRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';
import teacherRouter from './routes/teacherRoute.js';
import classRouter from './routes/classRoute.js';
import studentRouter from './routes/studentRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import attendanceRouter from './routes/attendanceRoute.js';
import materialRouter from './routes/materialRoute.js';
import reminderRouter from './routes/reminderRoute.js';
import notificationRouter from './routes/notificationRoute.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('Set a 32+ character JWT_SECRET in server/.env');
}
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '200kb' }));
app.get('/api/health', async (req, res) => {
  await query('SELECT 1');
  res.json({ status: 'ok' });
});
app.use('/api/auth', authRouter);
app.use('/api', authUser);
app.use('/api/', dashboardRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/classes', classRouter);
app.use('/api/students', studentRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/materials', materialRouter);
app.use('/api/reminders', reminderRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api', (req, res) => res.status(404).json({ error: 'Endpoint not found' }));
app.use(errorHandler);
const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`TuitionPro API running on http://localhost:${port}`));
