import { query } from '../configs/db.js';
const Payment = {
  find: async (studentId, month) =>
    (
      await query('SELECT student_id FROM payments WHERE student_id=? AND month=?', [
        studentId,
        month,
      ])
    )[0],
  markPaid: (studentId, month, amount) =>
    query(
      'INSERT INTO payments(student_id,month,amount) VALUES(?,?,?) ON DUPLICATE KEY UPDATE amount=VALUES(amount),paid_at=CURRENT_TIMESTAMP',
      [studentId, month, amount],
    ),
  remove: (studentId, month) =>
    query('DELETE FROM payments WHERE student_id=? AND month=?', [studentId, month]),
};
export default Payment;
