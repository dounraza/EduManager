import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EnrollmentPage from './pages/EnrollmentPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import LoginPage from './pages/Admin/LoginPage';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import { AuthProvider } from './data/AuthContext';
import './styles/global.css';

// Admin Sub-pages
import Overview from './pages/Admin/Overview';
import EnrollmentRequests from './pages/Admin/EnrollmentRequests';
import StudentsList from './pages/Admin/StudentsList';
import ClassesList from './pages/Admin/ClassesList';
import TimetablePage from './pages/Admin/TimetablePage';
import TeachersList from './pages/Admin/TeachersList';
import SubjectsList from './pages/Admin/SubjectsList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/enroll" element={<EnrollmentPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminDashboard />}>
              <Route index element={<Overview />} />
              <Route path="requests" element={<EnrollmentRequests />} />
              <Route path="students" element={<StudentsList />} />
              <Route path="classes" element={<ClassesList />} />
              <Route path="timetable" element={<TimetablePage />} />
              <Route path="teachers" element={<TeachersList />} />
              <Route path="subjects" element={<SubjectsList />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
