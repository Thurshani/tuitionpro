import { query } from '../configs/db.js';
import * as valid from '../utils/validation.js';
import { validate as must } from '../utils/httpError.js';
import { allowedClass } from '../services/accessService.js';
import Class from '../models/Class.js';

export const createClass = async (req, res) => {
  let { name, schedule, fee } = req.body;
  must(
    valid.text(name, 1, 100) &&
      valid.text(schedule, 1, 150) &&
      Number.isFinite(+fee) &&
      +fee >= 0 &&
      +fee <= 1000000,
    'Invalid class details',
  );
  let r = await Class.create(name.trim(), schedule.trim(), +fee);
  res.status(201).json({ id: r.insertId });
};
export const assignTeacher = async (req, res) => {
  await allowedClass(req, req.params.id);
  must(valid.id(req.body.teacher_id), 'Invalid teacher');
  const [u] = await query("SELECT id FROM users WHERE id=? AND role='teacher'", [
    req.body.teacher_id,
  ]);
  must(u, 'Teacher not found');
  await Class.assignTeacher(req.params.id, u.id);
  res.json({ ok: true });
};
