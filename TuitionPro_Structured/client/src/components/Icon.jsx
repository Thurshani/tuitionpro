import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Wallet,
  FolderOpen,
  Sparkles,
  Bell,
  LogOut,
  Menu,
  Plus,
  Download,
  Play,
  Trash2,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
const icons = {
  dashboard: LayoutDashboard,
  teachers: GraduationCap,
  students: Users,
  classes: BookOpen,
  attendance: CalendarCheck,
  payments: Wallet,
  materials: FolderOpen,
  reminders: Sparkles,
  notifications: Bell,
  logout: LogOut,
  menu: Menu,
  plus: Plus,
  download: Download,
  play: Play,
  delete: Trash2,
  arrow: ArrowRight,
  check: Check,
  close: X,
};
export default function Icon({ name, size = 18, ...props }) {
  const Component = icons[name] || BookOpen;
  return <Component size={size} strokeWidth={1.7} aria-hidden="true" {...props} />;
}
