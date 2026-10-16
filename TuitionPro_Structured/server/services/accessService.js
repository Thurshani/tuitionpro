import Class from '../models/Class.js';
import Student from '../models/Student.js';
import * as valid from '../utils/validation.js';
import { httpError as fail, validate as must } from '../utils/httpError.js';
export async function allowedClass(req, classId) {
  must(valid.id(classId), 'Invalid class');
  const c = await Class.findById(classId);
  if (!c) throw fail('Class not found', 404);
  if (req.user.role === 'admin') return c;
  if (req.user.role === 'teacher' && c.teacher_id === req.user.id) return c;
  if (req.user.role === 'student') {
    const enrolled = await Student.belongsToClass(req.user.id, classId);
    if (enrolled) return c;
  }
  throw fail('This class is not assigned to your account', 403);
}
export async function allowedStudent(req, sid) {
  must(valid.id(sid), 'Invalid student');
  const s = await Student.findById(sid);
  if (!s) throw fail('Student not found', 404);
  if (req.user.role === 'student' && s.user_id !== req.user.id) throw fail('Access denied', 403);
  await allowedClass(req, s.class_id);
  return s;
}
