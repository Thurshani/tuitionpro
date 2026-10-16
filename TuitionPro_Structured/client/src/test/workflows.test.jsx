import React from 'react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Attendance from '../pages/teacher/Attendance';
import Payments from '../pages/Payments';
import Students from '../pages/Students';
import ProtectedRoute from '../components/ProtectedRoute';
import Reminders from '../pages/teacher/Reminders';
import { calculateFees } from '../utils/format';
const { state } = vi.hoisted(() => ({ state: { value: null } }));
vi.mock('../context/AppContext', () => ({
  useAppContext: () => state.value,
  errorMessage: (error) => error.message,
}));
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));
const api = { put: vi.fn().mockResolvedValue({ data: { ok: true } }), post: vi.fn() };
function mount(element, path = '/') {
  return render(<MemoryRouter initialEntries={[path]}>{element}</MemoryRouter>);
}
beforeEach(() => {
  vi.clearAllMocks();
  state.value = {
    user: { id: 2, name: 'Nilo', role: 'teacher' },
    month: '2026-10',
    loading: false,
    busy: false,
    api,
    save: async (work) => work(),
    data: {
      classes: [{ id: 17, name: 'Maths', fee: 2000 }],
      students: [
        { id: 22, name: 'Arun', class_id: 17, parent_phone: '0771234567', attendance: 50, paid: 0 },
        {
          id: 23,
          name: 'Kavindi',
          class_id: 17,
          parent_phone: '0712345678',
          attendance: 100,
          paid: 1,
        },
      ],
      attendance: [
        { student_id: 22, class_id: 17, session_date: '2026-10-07', present: 1 },
        { student_id: 23, class_id: 17, session_date: '2026-10-07', present: 0 },
      ],
      materials: [],
      notifications: [],
      teachers: [],
    },
  };
});
afterEach(cleanup);
describe('TuitionPro workflows', () => {
  it('saves bulk attendance against the selected database IDs and date', async () => {
    mount(<Attendance />);
    fireEvent.change(screen.getByLabelText('Session date'), { target: { value: '2026-10-07' } });
    await waitFor(() => expect(screen.getAllByText('✓ Present').length).toBe(1));
    fireEvent.click(screen.getByText('Mark all present'));
    fireEvent.click(screen.getByText('Save session attendance'));
    await waitFor(() =>
      expect(api.put).toHaveBeenCalledWith('/api/attendance', {
        class_id: 17,
        date: '2026-10-07',
        records: [
          { student_id: 22, present: true },
          { student_id: 23, present: true },
        ],
      }),
    );
  });
  it('keeps payment mutation scoped to the selected student and month', async () => {
    mount(<Payments />);
    fireEvent.click(screen.getByText('Mark paid'));
    await waitFor(() =>
      expect(api.put).toHaveBeenCalledWith('/api/payments/22', { month: '2026-10', paid: true }),
    );
    expect(calculateFees(state.value.data.students, state.value.data.classes)).toEqual({
      expected: 4000,
      collected: 2000,
      pending: 2000,
    });
  });
  it('searches students by name without losing class filtering', () => {
    mount(<Students />);
    fireEvent.change(screen.getByLabelText('Search student name'), { target: { value: 'kav' } });
    expect(screen.queryByText('Arun')).toBeNull();
    expect(screen.getByText('Kavindi')).toBeTruthy();
  });
  it('redirects a teacher away from an admin route', () => {
    mount(
      <Routes>
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<div>Secret admin</div>} />
        </Route>
        <Route path="/teacher" element={<div>Teacher home</div>} />
      </Routes>,
      '/admin',
    );
    expect(screen.getByText('Teacher home')).toBeTruthy();
    expect(screen.queryByText('Secret admin')).toBeNull();
  });
  it('student fee view does not expose payment editing controls', () => {
    state.value.user.role = 'student';
    mount(<Payments />);
    expect(screen.queryByText('Mark paid')).toBeNull();
    expect(screen.queryByText('Undo payment')).toBeNull();
  });
  it('invalidates a generated reminder when the language changes', async () => {
    api.post.mockResolvedValue({ data: { message: 'Hello parent', source: 'template' } });
    mount(<Reminders />);
    fireEvent.click(screen.getByText('✧ Generate / regenerate'));
    await waitFor(() => expect(screen.getByText('Hello parent')).toBeTruthy());
    expect(screen.getByText('Notify student').disabled).toBe(false);
    fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'Tamil' } });
    expect(screen.getByText('Notify student').disabled).toBe(true);
  });
});
