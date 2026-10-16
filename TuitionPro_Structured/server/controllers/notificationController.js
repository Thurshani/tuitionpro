import * as valid from '../utils/validation.js';
import { validate as must } from '../utils/httpError.js';
import { allowedStudent } from '../services/accessService.js';
import Notification from '../models/Notification.js';

export const sendNotification = async (req, res) => {
  await allowedStudent(req, req.body.student_id);
  must(valid.text(req.body.message, 1, 4000), 'Message required');
  await Notification.create(req.body.student_id, req.body.message);
  res.status(201).json({ ok: true });
};
