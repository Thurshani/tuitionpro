import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { initials } from '../utils/format';
import Logo from './Logo';
import Icon from './Icon';
const menus = {
  admin: ['teachers', 'classes', 'students'],
  teacher: ['classes', 'students', 'attendance', 'payments', 'materials', 'reminders'],
  student: ['classes', 'attendance', 'payments', 'materials', 'notifications'],
};
export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const items = ['dashboard', ...menus[user.role]];
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <Logo />
      <p className="muted sidebar-subtitle">INSTITUTE MANAGEMENT</p>
      <nav className="nav">
        <small>Workspace</small>
        {items.map((item) => (
          <NavLink
            key={item}
            to={item === 'dashboard' ? `/${user.role}` : `/${user.role}/${item}`}
            end={item === 'dashboard'}
            onClick={onClose}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon name={item} />
            {item === 'reminders' ? 'AI Reminders' : item[0].toUpperCase() + item.slice(1)}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="support">
          <h3>Everything in one place.</h3>
          <p>Less paperwork. More time for teaching.</p>
        </div>
        <div className="profile">
          <span className="avatar">{initials(user.name)}</span>
          <div>
            <strong>{user.name}</strong>
            <div className="muted">{user.role} workspace</div>
          </div>
          <button
            aria-label="Logout"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <Icon name="logout" />
          </button>
        </div>
      </div>
    </aside>
  );
}
