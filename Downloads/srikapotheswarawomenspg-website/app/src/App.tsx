import { Routes, Route } from 'react-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminStudents from '@/pages/admin/Students';
import AdminStudentForm from '@/pages/admin/StudentForm';
import AdminRooms from '@/pages/admin/Rooms';
import AdminPayments from '@/pages/admin/Payments';
import AdminBeds from '@/pages/admin/Beds';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';

function PublicPages() {
  useSmoothScroll();
  return <PublicLayout />;
}

function AdminRoutes() {
  return (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicPages />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoutes />}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="students/new" element={<AdminStudentForm />} />
          <Route path="students/:id" element={<AdminStudentForm />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="beds" element={<AdminBeds />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
