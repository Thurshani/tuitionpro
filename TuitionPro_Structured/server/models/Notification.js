import { query } from '../configs/db.js';
const Notification = {
  create: (studentId, message) =>
    query('INSERT INTO notifications(student_id,message) VALUES(?,?)', [studentId, message]),
};
export default Notification;
