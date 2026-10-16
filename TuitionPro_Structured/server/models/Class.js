import { query } from '../configs/db.js';
const Class = {
  findById: async (id) => (await query('SELECT * FROM classes WHERE id=?', [id]))[0],
  assignTeacher: (id, teacherId) =>
    query('UPDATE classes SET teacher_id=? WHERE id=?', [teacherId, id]),
  create: (name, schedule, fee) =>
    query('INSERT INTO classes(name,schedule,fee) VALUES(?,?,?)', [name, schedule, fee]),
};
export default Class;
