import { query } from '../configs/db.js';
const User = {
  findByEmail: async (email) => (await query('SELECT * FROM users WHERE email=?', [email]))[0],
  findById: async (id) => (await query('SELECT id,name,email,role FROM users WHERE id=?', [id]))[0],
  findPassword: async (id) => (await query('SELECT password_hash FROM users WHERE id=?', [id]))[0],
  updatePassword: (id, hash) => query('UPDATE users SET password_hash=? WHERE id=?', [hash, id]),
};
export default User;
