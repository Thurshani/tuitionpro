import { pool } from '../configs/db.js';
export async function createAccount({ name, email, phone, subject, class_id, passwordHash }) {
  const c = await pool.getConnection();
  try {
    await c.beginTransaction();
    const [r] = await c.execute(
      "INSERT INTO users(name,email,password_hash,role,phone,subject) VALUES(?,?,?,'teacher',?,?)",
      [name.trim(), email.trim().toLowerCase(), passwordHash, phone, subject],
    );
    if (class_id)
      await c.execute('UPDATE classes SET teacher_id=? WHERE id=?', [r.insertId, class_id]);
    await c.commit();
    return r.insertId;
  } catch (e) {
    await c.rollback();
    throw e;
  } finally {
    c.release();
  }
}

export default { createAccount };
