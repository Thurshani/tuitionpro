import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { currentMonth } from '../utils/format';
const AppContext = createContext(null);
const emptyData = {
  classes: [],
  students: [],
  teachers: [],
  attendance: [],
  materials: [],
  notifications: [],
};
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
});
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('tuitionpro_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const errorMessage = (error) =>
  error.response?.data?.error || error.message || 'Request failed';
export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(emptyData);
  const [month, setMonth] = useState(currentMonth());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const requestSequence = useRef(0);
  const refresh = useCallback(async () => {
    const sequence = ++requestSequence.current;
    const token = sessionStorage.getItem('tuitionpro_token');
    const response = await api.get('/api/state', { params: { month } });
    if (
      sequence !== requestSequence.current ||
      token !== sessionStorage.getItem('tuitionpro_token')
    )
      return null;
    setUser(response.data.user);
    setData({ ...emptyData, ...response.data });
    return response.data;
  }, [month]);
  const logout = useCallback(() => {
    requestSequence.current++;
    sessionStorage.removeItem('tuitionpro_token');
    setUser(null);
    setData(emptyData);
  }, []);
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!sessionStorage.getItem('tuitionpro_token')) {
        if (active) setLoading(false);
        return;
      }
      try {
        await refresh();
      } catch (error) {
        if (error.response?.status === 401) logout();
        else toast.error(errorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [refresh, logout]);
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && sessionStorage.getItem('tuitionpro_token')) logout();
        return Promise.reject(error);
      },
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [logout]);
  const login = async (email, password, role) => {
    const { data: result } = await api.post('/api/auth/login', { email, password });
    if (result.user.role !== role)
      throw Error(`This is a ${result.user.role} account. Choose the matching role.`);
    sessionStorage.setItem('tuitionpro_token', result.token);
    try {
      await refresh();
    } catch (error) {
      logout();
      throw error;
    }
    return result.user;
  };
  const save = async (work, message) => {
    setBusy(true);
    try {
      const result = await work();
      await refresh();
      toast.success(message);
      return result;
    } catch (error) {
      toast.error(errorMessage(error));
      throw error;
    } finally {
      setBusy(false);
    }
  };
  const value = { user, data, month, setMonth, loading, busy, login, logout, refresh, save, api };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const useAppContext = () => useContext(AppContext);
