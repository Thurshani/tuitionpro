import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as valid from '../utils/validation.js';
import { httpError as fail, validate as must } from '../utils/httpError.js';
import User from '../models/User.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  must(valid.email(email) && valid.text(password, 1, 100), 'Enter a valid email and password');
  const u = await User.findByEmail(email.trim().toLowerCase());
  if (!u || !(await bcrypt.compare(password, u.password_hash)))
    throw fail('Invalid email or password', 401);
  const user = { id: u.id, name: u.name, email: u.email, role: u.role };
  res.json({ user, token: jwt.sign({ id: u.id }, process.env.JWT_SECRET, { expiresIn: '8h' }) });
};
export const changePassword = async (req, res) => {
  must(
    valid.text(req.body.oldPassword, 1, 100) && valid.text(req.body.newPassword, 8, 100),
    'New password must have 8+ characters',
  );
  const u = await User.findPassword(req.user.id);
  if (!(await bcrypt.compare(req.body.oldPassword, u.password_hash)))
    throw fail('Current password is incorrect', 400);
  await User.updatePassword(req.user.id, await bcrypt.hash(req.body.newPassword, 12));
  res.json({ ok: true });
};
