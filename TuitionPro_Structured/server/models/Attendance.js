// The caller supplies a transaction connection so one session saves atomically.
const Attendance = {
  save: (connection, studentId, classId, date, present) =>
    connection.execute(
      'INSERT INTO attendance(student_id,class_id,session_date,present) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE present=VALUES(present)',
      [studentId, classId, date, present],
    ),
};
export default Attendance;
