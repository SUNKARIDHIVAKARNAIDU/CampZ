import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import Fees from './pages/Fees';
import Profile from './pages/Profile';
import ProtectedRoute from './routes/ProtectedRoute';
import Toast from './components/Toast';
import { ROLES } from './utils/constants';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} allowedRoles={[ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT]} />}
            />
            <Route
              path="/students"
              element={<ProtectedRoute element={<Students />} allowedRoles={[ROLES.ADMIN]} />}
            />
            <Route
              path="/courses"
              element={<ProtectedRoute element={<Courses />} allowedRoles={[ROLES.ADMIN]} />}
            />
            <Route
              path="/attendance"
              element={<ProtectedRoute element={<Attendance />} allowedRoles={[ROLES.FACULTY]} />}
            />
            <Route
              path="/exams"
              element={<ProtectedRoute element={<Exams />} allowedRoles={[ROLES.ADMIN, ROLES.FACULTY]} />}
            />
            <Route
              path="/fees"
              element={<ProtectedRoute element={<Fees />} allowedRoles={[ROLES.ADMIN]} />}
            />
            <Route
              path="/my-profile"
              element={<ProtectedRoute element={<Profile />} allowedRoles={[ROLES.STUDENT]} />}
            />
            <Route path="*" element={<ProtectedRoute element={<Dashboard />} allowedRoles={[ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT]} />} />
          </Routes>
          <Toast />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;