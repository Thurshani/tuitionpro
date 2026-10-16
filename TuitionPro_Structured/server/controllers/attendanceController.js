import { pool } from '../configs/db.js';
import * as valid from '../utils/validation.js';
import { validate as must } from '../utils/httpError.js';
import { allowedClass, allowedStudent } from '../services/accessService.js';
import Attendance from '../models/Attendance.js';

export const saveAttendance = async (req, res) => {
  const { class_id, date, records } = req.body;
  await allowedClass(req, class_id);
  must(valid.date(date) && Array.isArray(records) && records.length <= 1000, 'Invalid session');
  for (const r of records) {
    must(valid.id(r.student_id) && typeof r.present === 'boolean', 'Invalid attendance record');
    let st = await allowedStudent(req, r.student_id);
    must(st.class_id === +class_id, 'Student belongs to another class');
  }
  const c = await pool.getConnection();
  try {
    await c.beginTransaction();
    for (const r of records) await Attendance.save(c, r.student_id, class_id, date, r.present);
    await c.commit();
    res.json({ ok: true });
  } catch (e) {
    await c.rollback();
    throw e;
  } finally {
    c.release();
  }
};
