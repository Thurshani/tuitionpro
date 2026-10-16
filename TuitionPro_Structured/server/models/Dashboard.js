import { query } from '../configs/db.js';

export async function getDashboardState(user, mo) {
  let classes;
  if (user.role === 'admin') classes = await query('SELECT * FROM classes ORDER BY id');
  else if (user.role === 'teacher')
    classes = await query('SELECT * FROM classes WHERE teacher_id=? ORDER BY id', [user.id]);
  else
    classes = await query(
      'SELECT c.* FROM classes c JOIN students s ON s.class_id=c.id WHERE s.user_id=? ORDER BY c.id',
      [user.id],
    );
  let ids = classes.map((c) => c.id),
    students = [],
    materials = [],
    attendance = [],
    notifications = [];
  if (ids.length) {
    const marks = ids.map(() => '?').join(',');
    let where = user.role === 'student' ? ' AND s.user_id=?' : '';
    students = await query(
      `SELECT s.*,u.name,u.email,p.student_id IS NOT NULL paid,COALESCE(ROUND(AVG(a.present)*100),0) attendance FROM students s JOIN users u ON s.user_id=u.id LEFT JOIN payments p ON p.student_id=s.id AND p.month=? LEFT JOIN attendance a ON a.student_id=s.id WHERE s.class_id IN (${marks})${where} GROUP BY s.id,u.name,u.email,p.student_id ORDER BY s.id`,
      [mo, ...ids, ...(where ? [user.id] : [])],
    );
    materials = await query(
      `SELECT id,class_id,name,type,original_name,created_at FROM materials WHERE class_id IN (${marks}) ORDER BY id DESC`,
      ids,
    );
    const sids = students.map((s) => s.id);
    if (sids.length) {
      const sm = sids.map(() => '?').join(',');
      attendance = await query(
        `SELECT student_id,class_id,DATE_FORMAT(session_date,'%Y-%m-%d') session_date,present FROM attendance WHERE student_id IN (${sm})`,
        sids,
      );
      notifications = await query(
        `SELECT * FROM notifications WHERE student_id IN (${sm}) ORDER BY id DESC`,
        sids,
      );
    }
  }
  const teachers =
    user.role === 'admin'
      ? await query(
          "SELECT id,name,email,phone,subject FROM users WHERE role='teacher' ORDER BY id",
        )
      : [];
  return { user, classes, students, teachers, materials, attendance, notifications };
}
