import Teacher from '../models/Teacher.js';
import bcrypt from 'bcryptjs';
import * as valid from '../utils/validation.js';
import { validate as must } from '../utils/httpError.js';
import { allowedClass } from '../services/accessService.js';

export const createTeacher = async (req, res) => {
  let { name, email, phone, subject, password, class_id } = req.body;
  must(
    valid.text(name, 1, 100) &&
      valid.email(email) &&
      valid.text(password, 8, 100) &&
      valid.text(phone, 1, 30) &&
      valid.text(subject, 1, 100),
    'Enter teacher name, email, contact, subject and password (8+ characters)',
  );
  if (class_id) await allowedClass(req, class_id);
  const id = await Teacher.createAccount({
    name,
    email,
    phone,
    subject,
    class_id,
    passwordHash: await bcrypt.hash(password, 12),
  });
  res.status(201).json({ id, teacherId: 'TCH-' + String(id).padStart(3, '0') });
};
