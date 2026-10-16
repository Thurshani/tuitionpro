import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Classes from './pages/Classes';
import Students from './pages/Students';
import Payments from './pages/Payments';
import Materials from './pages/Materials';
import Teachers from './pages/admin/Teachers';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import Attendance from './pages/teacher/Attendance';
import Reminders from './pages/teacher/Reminders';
import MyAttendance from './pages/student/MyAttendance';
import Notifications from './pages/student/Notifications';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
export default function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="classes" element={<Classes />} />
            <Route path="students" element={<Students />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute role="teacher" />}>
          <Route path="/teacher" element={<DashboardLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="classes" element={<Classes />} />
            <Route path="students" element={<Students />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="payments" element={<Payments />} />
            <Route path="materials" element={<Materials />} />
            <Route path="reminders" element={<Reminders />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/student" element={<DashboardLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="classes" element={<Classes />} />
            <Route path="attendance" element={<MyAttendance />} />
            <Route path="payments" element={<Payments />} />
            <Route path="materials" element={<Materials />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
