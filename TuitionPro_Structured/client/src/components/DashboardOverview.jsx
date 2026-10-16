import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { currency, calculateFees, monthLabel, initials } from '../utils/format';
import PageHeader from './PageHeader';
import StatCard from './StatCard';
import EmptyState from './EmptyState';
export default function DashboardOverview({ title }) {
  const { user, data, month } = useAppContext();
  const { classes, students, attendance } = data;
  const fees = calculateFees(students, classes);
  const average = students.length
    ? Math.round(students.reduce((sum, item) => sum + Number(item.attendance), 0) / students.length)
    : 0;
  const pending = students.filter((item) => !item.paid);
  const present = attendance.filter((item) => item.present).length;
  const base = `/${user.role}`;
  const isStudent = user.role === 'student';
  const stats = isStudent
    ? [
        ['My classes', classes.length, 'Assigned classes', 'classes'],
        ['My attendance', average + '%', 'Recorded sessions', 'attendance'],
        ['Monthly fee', currency(fees.expected), monthLabel(month), 'payments'],
        ['Learning resources', data.materials.length, 'Class notes and videos', 'materials'],
      ]
    : [
        ['Total students', students.length, 'Registered learners', 'students'],
        [
          user.role === 'admin' ? 'Teachers' : 'Active classes',
          user.role === 'admin' ? data.teachers.length : classes.length,
          'Your institute workspace',
          'teachers',
        ],
        ['Fees collected', currency(fees.collected), monthLabel(month), 'payments'],
        ['Attendance rate', average + '%', 'Recorded student average', 'attendance'],
      ];
  return (
    <>
      <PageHeader
        title={title}
        description="A clear view of your classroom and today’s priorities."
      />
      <div className="welcome-strip">
        <div>
          <span className="welcome-label">{user.role.toUpperCase()} WORKSPACE</span>
          <h2>Welcome back, {user.name}.</h2>
          <p>Your classes, learners and next steps, together.</p>
        </div>
        <div className="welcome-date">
          {new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>
      <div className="stats">
        {stats.map(([label, value, note, icon]) => (
          <StatCard key={label} {...{ label, value, note, icon }} />
        ))}
      </div>
      <div className="grid">
        <section className="card">
          <div className="card-head">
            <h2>Class schedule</h2>
            <Link className="link" to={`${base}/classes`}>
              View classes →
            </Link>
          </div>
          {classes.length ? (
            classes.map((item) => (
              <div className="class-row" key={item.id}>
                <div className="class-icon">π</div>
                <div className="details">
                  <h3>{item.name}</h3>
                  <span className="muted">{item.schedule}</span>
                </div>
                <div className="time">
                  {currency(item.fee)}
                  <small>per month</small>
                </div>
              </div>
            ))
          ) : (
            <EmptyState message="No classes assigned yet." />
          )}
        </section>
        <section className="card">
          <div className="card-head">
            <h2>Fee collection</h2>
            <span className="badge blue">{monthLabel(month)}</span>
          </div>
          <div
            className="fee-donut"
            style={{ '--fill': `${fees.expected ? (fees.collected / fees.expected) * 100 : 0}%` }}
          >
            <div>
              <strong>
                {fees.expected ? Math.round((fees.collected / fees.expected) * 100) : 0}%
              </strong>
              <small>Collected</small>
            </div>
          </div>
          <div className="fee-legend">
            <span>
              <i />
              Collected<strong>{currency(fees.collected)}</strong>
            </span>
            <span>
              <i className="pending" />
              Pending<strong>{currency(fees.pending)}</strong>
            </span>
          </div>
        </section>
      </div>
      <div className="grid">
        <section className="card">
          <div className="card-head">
            <h2>Attendance summary</h2>
          </div>
          <div className="attendance-summary">
            <div className="present-count">
              <span>Present</span>
              <strong>{present}</strong>
            </div>
            <div className="absent-count">
              <span>Absent</span>
              <strong>{attendance.length - present}</strong>
            </div>
            <div>
              <span>Entries</span>
              <strong>{attendance.length}</strong>
            </div>
          </div>
          <p className="muted">Based on saved class sessions.</p>
        </section>
        <section className="card">
          <div className="card-head">
            <h2>{isStudent ? 'Recent updates' : 'Pending fee alerts'}</h2>
            <span className="badge amber">
              {isStudent ? data.notifications.length : pending.length}
            </span>
          </div>
          {isStudent
            ? data.notifications.slice(0, 3).map((item) => (
                <p className="notice" key={item.id}>
                  {item.message}
                </p>
              ))
            : pending.slice(0, 4).map((item) => (
                <div className="pending-row" key={item.id}>
                  <div className="person">
                    <span className="avatar">{initials(item.name)}</span>
                    <div>
                      {item.name}
                      <small>{classes.find((cls) => cls.id === item.class_id)?.name}</small>
                    </div>
                  </div>
                  <strong>{currency(classes.find((cls) => cls.id === item.class_id)?.fee)}</strong>
                </div>
              ))}
          {!isStudent && !pending.length && (
            <EmptyState message="All fees for this month are paid." />
          )}
        </section>
      </div>
    </>
  );
}
