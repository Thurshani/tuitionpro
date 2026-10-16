import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Loading from './Loading';
export default function ProtectedRoute({ role }) {
  const { user, loading } = useAppContext();
  if (loading) return <Loading />;
  if (!user) return <Navigate to={`/login?role=${role}`} replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return <Outlet />;
}
