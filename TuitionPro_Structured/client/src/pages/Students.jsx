import { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { initials, currency } from '../utils/format';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
export default function Students() {
  const { data, save, api, busy } = useAppContext();
  const [query, setQuery] = useState(''),
    [classId, setClassId] = useState('all'),
    [open, setOpen] = useState(false),
    [selected, setSelected] = useState(null);
  const rows = useMemo(
    () =>
      data.students.filter(
        (student) =>
          student.name.toLowerCase().includes(query.toLowerCase()) &&
          (classId === 'all' || student.class_id === Number(classId)),
      ),
    [data.students, query, classId],
  );
  const submit = async (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    fields.class_id = Number(fields.class_id);
    try {
      await save(() => api.post('/api/students', fields), 'Student account created');
      setOpen(false);
    } catch {}
  };
  return (
    <>
      <PageHeader
        title="Your students"
        description="Student records, attendance and parent contact details."
      >
        <button className="primary" disabled={!data.classes.length} onClick={() => setOpen(true)}>
          + Add student
        </button>
      </PageHeader>
      <section className="card">
        <div className="filters">
          <input
            aria-label="Search student name"
            placeholder="Search student name…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter students by class"
            value={classId}
            onChange={(event) => setClassId(event.target.value)}
          >
            <option value="all">All classes</option>
            {data.classes.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Parent contact</th>
                <th>Attendance</th>
                <th>Fee status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="person">
                      <span className="avatar">{initials(student.name)}</span>
                      <button className="link student-name" onClick={() => setSelected(student)}>
                        {student.name}
                      </button>
                    </div>
                  </td>
                  <td>{data.classes.find((item) => item.id === student.class_id)?.name}</td>
                  <td>{student.parent_phone}</td>
                  <td>
                    <span className="progress">
                      <i
                        style={{
                          width: `${student.attendance}%`,
                          background:
                            student.attendance >= 90
                              ? '#3ea68a'
                              : student.attendance >= 80
                                ? '#d4a04c'
                                : '#d5757e',
                        }}
                      />
                    </span>
                    {student.attendance}%
                  </td>
                  <td>
                    <span className={`badge ${student.paid ? '' : 'amber'}`}>
                      {student.paid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <EmptyState message="No matching students." />}
      </section>
      {open && (
        <Modal title="Register student" onClose={() => setOpen(false)}>
          <form onSubmit={submit}>
            <label htmlFor="student-name">Full name</label>
            <input id="student-name" name="name" required maxLength={100} />
            <label htmlFor="student-email">Login email</label>
            <input id="student-email" name="email" type="email" required />
            <label htmlFor="student-password">Initial password (8+ characters)</label>
            <input id="student-password" name="password" type="password" required minLength={8} />
            <label htmlFor="student-class">Class</label>
            <select id="student-class" name="class_id" required>
              {data.classes.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <label htmlFor="parent-phone">Parent contact</label>
            <input id="parent-phone" name="phone" type="tel" required maxLength={30} />
            <button className="primary" disabled={busy}>
              Create student account
            </button>
          </form>
        </Modal>
      )}
      {selected && (
        <Modal title="Student overview" onClose={() => setSelected(null)}>
          <div className="profile-summary">
            <span className="avatar">{initials(selected.name)}</span>
            <div>
              <h2>{selected.name}</h2>
              <p className="muted">
                {data.classes.find((item) => item.id === selected.class_id)?.name}
              </p>
            </div>
          </div>
          <div className="attendance-summary">
            <div>
              <span>Attendance</span>
              <strong>{selected.attendance}%</strong>
            </div>
            <div>
              <span>Fees</span>
              <strong>{selected.paid ? 'Paid' : 'Pending'}</strong>
            </div>
          </div>
          <label>Parent contact</label>
          <p>{selected.parent_phone}</p>
          <label>Login email</label>
          <p>{selected.email}</p>
          <label>Monthly fee</label>
          <p>{currency(data.classes.find((item) => item.id === selected.class_id)?.fee)}</p>
        </Modal>
      )}
    </>
  );
}
