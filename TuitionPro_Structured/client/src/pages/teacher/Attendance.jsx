import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { initials, today } from '../../utils/format';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
export default function Attendance() {
  const { data, save, api, busy } = useAppContext();
  const [params] = useSearchParams();
  const [classId, setClassId] = useState(Number(params.get('class')) || data.classes[0]?.id || 0),
    [date, setDate] = useState(today()),
    [marks, setMarks] = useState({});
  const students = useMemo(
    () => data.students.filter((student) => student.class_id === classId),
    [data.students, classId],
  );
  useEffect(() => {
    setMarks(
      Object.fromEntries(
        students.map((student) => {
          const record = data.attendance.find(
            (item) =>
              item.student_id === student.id &&
              item.class_id === classId &&
              item.session_date === date,
          );
          return [student.id, Boolean(record?.present)];
        }),
      ),
    );
  }, [students, data.attendance, classId, date]);
  const count = students.filter((student) => marks[student.id]).length;
  const bulk = (present) =>
    setMarks(Object.fromEntries(students.map((student) => [student.id, present])));
  const submit = async () => {
    try {
      await save(
        () =>
          api.put('/api/attendance', {
            class_id: classId,
            date,
            records: students.map((student) => ({
              student_id: student.id,
              present: Boolean(marks[student.id]),
            })),
          }),
        'Session attendance saved',
      );
    } catch {}
  };
  const history = Object.values(
    data.attendance.reduce((sessions, item) => {
      const key = item.class_id + ':' + item.session_date;
      sessions[key] ??= { classId: item.class_id, date: item.session_date, present: 0, absent: 0 };
      sessions[key][item.present ? 'present' : 'absent']++;
      return sessions;
    }, {}),
  );
  return (
    <>
      <PageHeader
        title="Class attendance"
        description="Choose a class and date, mark attendance, and save the session."
      />
      <section className="card">
        <div className="filters">
          <select
            aria-label="Attendance class"
            value={classId}
            onChange={(event) => setClassId(Number(event.target.value))}
          >
            {data.classes.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            aria-label="Session date"
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div className="attendance-summary">
          <div className="present-count">
            <span>Present</span>
            <strong>{count}</strong>
          </div>
          <div className="absent-count">
            <span>Absent</span>
            <strong>{students.length - count}</strong>
          </div>
          <div>
            <span>Students</span>
            <strong>{students.length}</strong>
          </div>
        </div>
        <div className="card-head">
          <h2>Attendance register</h2>
          <div className="bulk-actions">
            <button onClick={() => bulk(true)}>Mark all present</button>
            <button onClick={() => bulk(false)}>Mark all absent</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Session status</th>
                <th>Overall rate</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="person">
                      <span className="avatar">{initials(student.name)}</span>
                      {student.name}
                    </div>
                  </td>
                  <td>
                    <button
                      className={`attendance-toggle ${marks[student.id] ? 'is-present' : 'is-absent'}`}
                      onClick={() =>
                        setMarks((previous) => ({
                          ...previous,
                          [student.id]: !previous[student.id],
                        }))
                      }
                    >
                      {marks[student.id] ? '✓ Present' : '× Absent'}
                    </button>
                  </td>
                  <td>{student.attendance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!students.length && <EmptyState message="No students enrolled in this class." />}
        <button
          className="primary section-action"
          disabled={busy || !date || !students.length}
          onClick={submit}
        >
          {busy ? 'Saving…' : 'Save session attendance'}
        </button>
      </section>
      <section className="card section-action">
        <div className="card-head">
          <h2>Session history</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Date</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>
            <tbody>
              {history
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((item) => (
                  <tr key={item.classId + item.date}>
                    <td>{data.classes.find((cls) => cls.id === item.classId)?.name}</td>
                    <td>{item.date}</td>
                    <td>
                      <span className="badge">{item.present}</span>
                    </td>
                    <td>
                      <span className="badge amber">{item.absent}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {!history.length && <EmptyState message="No saved sessions yet." />}
      </section>
    </>
  );
}
