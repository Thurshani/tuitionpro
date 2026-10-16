import Icon from './Icon';
export default function StatCard({ label, value, note, icon }) {
  return (
    <article className="stat">
      <div className="stat-top">
        {label}
        <span className="stat-icon">
          <Icon name={icon} />
        </span>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}
