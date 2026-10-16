import { useAppContext } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
export default function Notifications() {
  const { data } = useAppContext();
  return (
    <>
      <PageHeader
        title="My notifications"
        description="Class updates and fee reminders from your teacher."
      />
      <section className="card">
        {data.notifications.length ? (
          data.notifications.map((item) => (
            <article className="notification-card" key={item.id}>
              <span className="badge blue">Teacher message</span>
              <p>{item.message}</p>
              <small className="muted">{new Date(item.created_at).toLocaleString('en-GB')}</small>
            </article>
          ))
        ) : (
          <EmptyState message="No messages yet." icon="notifications" />
        )}
      </section>
    </>
  );
}
