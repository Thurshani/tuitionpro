import test from 'node:test';
import assert from 'node:assert/strict';
import Class from '../models/Class.js';
import Student from '../models/Student.js';
import { allowedClass, allowedStudent } from '../services/accessService.js';
test('Teacher class access and student record access stay scoped to the authenticated identity', async () => {
  const originals = {
    findClass: Class.findById,
    findStudent: Student.findById,
    enrolled: Student.belongsToClass,
  };
  try {
    Class.findById = async () => ({ id: 17, teacher_id: 2 });
    Student.findById = async () => ({ id: 22, user_id: 3, class_id: 17 });
    Student.belongsToClass = async () => true;
    assert.equal((await allowedClass({ user: { id: 2, role: 'teacher' } }, 17)).id, 17);
    await assert.rejects(
      allowedClass({ user: { id: 9, role: 'teacher' } }, 17),
      (error) => error.status === 403,
    );
    await assert.rejects(
      allowedStudent({ user: { id: 8, role: 'student' } }, 22),
      (error) => error.status === 403,
    );
    assert.equal((await allowedStudent({ user: { id: 3, role: 'student' } }, 22)).id, 22);
    Student.belongsToClass = async () => false;
    await assert.rejects(
      allowedClass({ user: { id: 3, role: 'student' } }, 17),
      (error) => error.status === 403,
    );
  } finally {
    Class.findById = originals.findClass;
    Student.findById = originals.findStudent;
    Student.belongsToClass = originals.enrolled;
  }
});
