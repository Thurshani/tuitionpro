import Icon from './Icon';
export default function EmptyState({ message = 'No records yet.', icon = 'classes' }) {
  return (
    <div className="empty">
      <Icon name={icon} size={28} />
      <p>{message}</p>
    </div>
  );
}
