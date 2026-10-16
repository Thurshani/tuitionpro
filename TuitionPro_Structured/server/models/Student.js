import { query, pool } from '../configs/db.js';
const Student = {
  findById: async (id) =>
    (
      await query('SELECT s.*,u.name FROM students s JOIN users u ON s.user_id=u.id WHERE s.id=?', [
        id,
      ])
    )[0],
  belongsToClass: async (userId, classId) =>
    (await query('SELECT id FROM students WHERE user_id=? AND class_id=?', [userId, classId]))
      .length > 0,
};
export async function createAccount({ name, email, phone, class_id, passwordHash }) {
  const c = await pool.getConnection();
  try {
    await c.beginTransaction();
    const [u] = await c.execute(
      "INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,'student')",
      [name.trim(), email.trim().toLowerCase(), passwordHash],
    );
    const [s] = await c.execute(
      'INSERT INTO students(user_id,class_id,parent_phone) VALUES(?,?,?)',
      [u.insertId, class_id, phone],
    );
    await c.commit();
    return s.insertId;
  } catch (e) {
    await c.rollback();
    throw e;
  } finally {
    c.release();
  }
}

Student.createAccount = createAccount;
export default Student;
