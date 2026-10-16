import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';
import * as valid from '../utils/validation.js';
import { validate as must } from '../utils/httpError.js';
import { allowedClass } from '../services/accessService.js';

export const createStudent = async (req, res) => {
  let { name, email, phone, password, class_id } = req.body;
  await allowedClass(req, class_id);
  must(
    valid.text(name, 1, 100) &&
      valid.email(email) &&
      valid.text(password, 8, 100) &&
      valid.text(phone, 1, 30),
    'Enter student name, email, contact and password (8+ characters)',
  );
  const id = await Student.createAccount({
    name,
    email,
    phone,
    class_id,
    passwordHash: await bcrypt.hash(password, 12),
  });
  res.status(201).json({ id });
};
