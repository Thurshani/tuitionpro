import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { currency } from '../utils/format';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
export default function Classes() {
  const { user, data, save, api, busy } = useAppContext();
  const [creating, setCreating] = useState(false),
    [assigning, setAssigning] = useState(null);
  const create = async (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    fields.fee = Number(fields.fee);
    try {
      await save(() => api.post('/api/classes', fields), 'Class created');
      setCreating(false);
    } catch {}
  };
  const assign = async (event) => {
    event.preventDefault();
    const teacherId = Number(new FormData(event.currentTarget).get('teacher_id'));
    try {
      await save(
        () => api.put(`/api/classes/${assigning.id}/teacher`, { teacher_id: teacherId }),
        'Teacher assigned',
      );
      setAssigning(null);
    } catch {}
  };
  return (
    <>
      <PageHeader
        title={user.role === 'student' ? 'My classes' : 'Your classes'}
        description="A clear space for every class and weekly session."
      >
        {user.role === 'admin' && (
          <button className="primary" onClick={() => setCreating(true)}>
            + Create class
          </button>
        )}
      </PageHeader>
      <div className="cards">
        {data.classes.map((item) => (
          <article className="card course" key={item.id}>
            <div className="card-head">
              <span className="badge">Active class</span>
              <span className="muted">#{item.id}</span>
            </div>
            <div className="class-icon">π</div>
            <h2>{item.name}</h2>
            <p>{item.schedule}</p>
            <p>
              {user.role === 'student'
                ? 'Your enrolled class'
                : `${data.students.filter((student) => student.class_id === item.id).length} enrolled students`}
            </p>
            {user.role === 'admin' && (
              <p>
                Teacher:{' '}
                {data.teachers.find((teacher) => teacher.id === item.teacher_id)?.name ||
                  'Unassigned'}
              </p>
            )}
            <footer>
              <strong>
                {currency(item.fee)} <span className="muted">/ month</span>
              </strong>
              {user.role === 'admin' ? (
                <button className="link" onClick={() => setAssigning(item)}>
                  Assign teacher →
                </button>
              ) : (
                <Link
                  className="link"
                  to={`/${user.role}/${user.role === 'teacher' ? 'attendance' : 'materials'}${user.role === 'teacher' ? `?class=${item.id}` : ''}`}
                >
                  {user.role === 'teacher' ? 'Take attendance' : 'Materials'} →
                </Link>
              )}
            </footer>
          </article>
        ))}
      </div>
      {!data.classes.length && (
        <EmptyState
          message={
            user.role === 'admin'
              ? 'Create a class to get started.'
              : 'Management has not assigned a class yet.'
          }
        />
      )}
      {creating && (
        <Modal title="Create class" onClose={() => setCreating(false)}>
          <form onSubmit={create}>
            <label htmlFor="class-name">Class name</label>
            <input
              id="class-name"
              name="name"
              required
              maxLength={100}
              placeholder="Grade 10 · Mathematics"
            />
            <label htmlFor="class-schedule">Schedule</label>
            <input
              id="class-schedule"
              name="schedule"
              required
              maxLength={150}
              placeholder="Wednesday · 3:30–5:30 PM"
            />
            <label htmlFor="class-fee">Monthly fee (LKR)</label>
            <input
              id="class-fee"
              name="fee"
              type="number"
              required
              min="0"
              max="1000000"
              step="0.01"
            />
            <button className="primary" disabled={busy}>
              Create class
            </button>
          </form>
        </Modal>
      )}
      {assigning && (
        <Modal title="Assign teacher" onClose={() => setAssigning(null)}>
          <p className="muted">{assigning.name}</p>
          <form onSubmit={assign}>
            <label htmlFor="assigned-teacher">Teacher</label>
            <select
              id="assigned-teacher"
              name="teacher_id"
              required
              defaultValue={assigning.teacher_id || ''}
            >
              <option value="" disabled>
                Select teacher
              </option>
              {data.teachers.map((teacher) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            <button className="primary" disabled={busy || !data.teachers.length}>
              Save assignment
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
