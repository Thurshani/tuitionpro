import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';
export default function Teachers() {
  const { data, api, save, busy } = useAppContext();
  const [open, setOpen] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    fields.class_id = fields.class_id || null;
    try {
      await save(() => api.post('/api/teachers', fields), 'Teacher account created');
      setOpen(false);
    } catch {}
  };
  return (
    <>
      <PageHeader
        title="Teacher management"
        description="Register teachers, issue IDs and assign their classes."
      >
        <button className="primary" onClick={() => setOpen(true)}>
          + Add teacher
        </button>
      </PageHeader>
      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Teacher ID</th>
                <th>Teacher</th>
                <th>Subject</th>
                <th>Contact</th>
                <th>Assigned classes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>
                    <strong>TCH-{String(teacher.id).padStart(3, '0')}</strong>
                  </td>
                  <td>
                    {teacher.name}
                    <div className="muted">{teacher.email}</div>
                  </td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.phone}</td>
                  <td>
                    {data.classes
                      .filter((item) => item.teacher_id === teacher.id)
                      .map((item) => item.name)
                      .join(', ') || 'Unassigned'}
                  </td>
                  <td>
                    <span className="badge">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!data.teachers.length && <EmptyState message="Register your first teacher." />}
      </section>
      {open && (
        <Modal title="Register teacher" onClose={() => setOpen(false)}>
          <form onSubmit={submit}>
            <label htmlFor="teacher-name">Full name</label>
            <input id="teacher-name" name="name" required maxLength={100} />
            <label htmlFor="teacher-email">Login email</label>
            <input id="teacher-email" name="email" type="email" required />
            <label htmlFor="teacher-password">Initial password (8+ characters)</label>
            <input id="teacher-password" name="password" type="password" minLength={8} required />
            <label htmlFor="teacher-phone">Contact number</label>
            <input id="teacher-phone" name="phone" type="tel" required maxLength={30} />
            <label htmlFor="teacher-subject">Subject</label>
            <input id="teacher-subject" name="subject" required maxLength={100} />
            <label htmlFor="teacher-class">Assign class</label>
            <select id="teacher-class" name="class_id">
              <option value="">Assign later</option>
              {data.classes.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <button className="primary" disabled={busy}>
              {busy ? 'Saving…' : 'Create teacher account'}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
