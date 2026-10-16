import { generateReminderMessage } from '../services/reminderService.js';
import * as valid from '../utils/validation.js';
import { httpError as fail, validate as must } from '../utils/httpError.js';
import { allowedClass, allowedStudent } from '../services/accessService.js';
import Payment from '../models/Payment.js';

export const generateReminder = async (req, res) => {
  let { student_id, language, tone, month } = req.body;
  const s = await allowedStudent(req, student_id);
  must(
    ['English', 'Tamil'].includes(language) &&
      ['Polite', 'Friendly', 'Firm'].includes(tone) &&
      valid.month(month),
    'Invalid reminder options',
  );
  const paid = await Payment.find(s.id, month);
  must(!paid, 'This month has already been paid');
  const c = await allowedClass(req, s.class_id);
  const result = await generateReminderMessage({ student: s, classInfo: c, month, language, tone });
  res.json(result);
};
