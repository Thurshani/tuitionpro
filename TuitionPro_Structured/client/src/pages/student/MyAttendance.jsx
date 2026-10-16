import { useAppContext } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
export default function MyAttendance() {
  const { data } = useAppContext();
  const student = data.students[0];
  return (
    <>
      <PageHeader
        title="My attendance"
        description="Your recorded class sessions and attendance percentage."
      />
      <div className="stats">
        <StatCard
          label="Attendance"
          value={`${student?.attendance || 0}%`}
          note="Recorded class sessions"
          icon="attendance"
        />
      </div>
      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Session date</th>
                <th>Class</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...data.attendance]
                .sort((a, b) => b.session_date.localeCompare(a.session_date))
                .map((item) => (
                  <tr key={item.class_id + item.session_date}>
                    <td>{item.session_date}</td>
                    <td>{data.classes.find((cls) => cls.id === item.class_id)?.name}</td>
                    <td>
                      <span className={`badge ${item.present ? '' : 'amber'}`}>
                        {item.present ? 'Present' : 'Absent'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {!data.attendance.length && <EmptyState message="No attendance recorded yet." />}
      </section>
    </>
  );
}
