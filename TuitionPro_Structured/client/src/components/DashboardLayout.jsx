import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppContext, errorMessage } from '../context/AppContext';
import Sidebar from './Sidebar';
import Icon from './Icon';
import Modal from './Modal';
export default function DashboardLayout() {
  const { user, month, setMonth, api } = useAppContext();
  const [menu, setMenu] = useState(false),
    [passwordOpen, setPasswordOpen] = useState(false),
    [saving, setSaving] = useState(false);
  const location = useLocation();
  const page = location.pathname.split('/')[2] || 'dashboard';
  const updatePassword = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    try {
      await api.put('/api/auth/password', Object.fromEntries(form));
      toast.success('Password updated');
      setPasswordOpen(false);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <Sidebar open={menu} onClose={() => setMenu(false)} />
      {menu && (
        <button
          className="mobile-shade"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        />
      )}
      <main className="main">
        <header className="topbar">
          <button className="mobile" aria-label="Open navigation" onClick={() => setMenu(true)}>
            <Icon name="menu" />
          </button>
          <span className="trail">
            Workspace / <strong>{page}</strong>
          </span>
          <div className="top-actions">
            <span className="badge blue">{user.role.toUpperCase()}</span>
            <input
              aria-label="Fee month"
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            />
            <button onClick={() => setPasswordOpen(true)}>Password</button>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
        <p className="workspace-footer">TuitionPro · Your classroom, connected.</p>
      </main>
      {passwordOpen && (
        <Modal title="Change password" onClose={() => setPasswordOpen(false)}>
          <form onSubmit={updatePassword}>
            <label htmlFor="oldPassword">Current password</label>
            <input id="oldPassword" name="oldPassword" type="password" required />
            <label htmlFor="newPassword">New password</label>
            <input id="newPassword" name="newPassword" type="password" minLength={8} required />
            <button className="primary" disabled={saving}>
              {saving ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
