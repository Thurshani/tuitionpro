import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { currency, calculateFees, monthLabel, initials } from '../utils/format';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
export default function Payments() {
  const { user, data, month, save, api, busy } = useAppContext();
  const [filter, setFilter] = useState('all');
  const fees = calculateFees(data.students, data.classes),
    isStudent = user.role === 'student';
  const rows = data.students.filter(
    (student) => filter === 'all' || (filter === 'paid' ? student.paid : !student.paid),
  );
  const update = async (student) => {
    try {
      await save(
        () => api.put(`/api/payments/${student.id}`, { month, paid: !Boolean(student.paid) }),
        'Payment updated',
      );
    } catch {}
  };
  return (
    <>
      <PageHeader
        title={isStudent ? 'My fee statement' : 'Monthly fee management'}
        description={`${monthLabel(month)} · Choose a different month in the top bar.`}
      />
      <div className="stats">
        <StatCard
          label="Expected fees"
          value={currency(fees.expected)}
          note={monthLabel(month)}
          icon="payments"
        />
        <StatCard
          label="Collected"
          value={currency(fees.collected)}
          note="Recorded payments"
          icon="check"
        />
        <StatCard
          label="Pending"
          value={currency(fees.pending)}
          note="Outstanding fees"
          icon="payments"
        />
      </div>
      {!isStudent && (
        <div className="payment-panels">
          <button className="payment-panel paid-panel" onClick={() => setFilter('paid')}>
            <span>✓ Paid students</span>
            <strong>{data.students.filter((student) => student.paid).length}</strong>
            <small>{currency(fees.collected)} received · View records →</small>
          </button>
          <button className="payment-panel pending-panel" onClick={() => setFilter('pending')}>
            <span>◷ Pending students</span>
            <strong>{data.students.filter((student) => !student.paid).length}</strong>
            <small>{currency(fees.pending)} outstanding · View records →</small>
          </button>
        </div>
      )}
      <section className="card">
        <div className="card-head">
          <h2>Payment records</h2>
          <span className="badge blue">{monthLabel(month)}</span>
        </div>
        {!isStudent && (
          <div className="record-tabs">
            {['all', 'paid', 'pending'].map((item) => (
              <button
                key={item}
                className={filter === item ? 'current' : ''}
                onClick={() => setFilter(item)}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        )}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Monthly fee</th>
                <th>Status</th>
                {!isStudent && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="person">
                      <span className="avatar">{initials(student.name)}</span>
                      {student.name}
                    </div>
                  </td>
                  <td>{data.classes.find((item) => item.id === student.class_id)?.name}</td>
                  <td>
                    <strong>
                      {currency(data.classes.find((item) => item.id === student.class_id)?.fee)}
                    </strong>
                  </td>
                  <td>
                    <span className={`badge ${student.paid ? '' : 'amber'}`}>
                      {student.paid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  {!isStudent && (
                    <td>
                      <button disabled={busy} onClick={() => update(student)}>
                        {student.paid ? 'Undo payment' : 'Mark paid'}
                      </button>
                      {!student.paid && (
                        <Link
                          className="link inline-action"
                          to={`/${user.role}/reminders?student=${student.id}`}
                        >
                          ✧ Remind
                        </Link>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <EmptyState message="No matching payments." />}
        <p className="muted section-action">
          Fees are recorded by your teacher. Online payment collection is outside this project.
        </p>
      </section>
    </>
  );
}
