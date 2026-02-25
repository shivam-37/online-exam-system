import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './utils/auth';

// Lazy load pages for better performance
const Layout = lazy(() => import('./pages/Layout'));
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Exams = lazy(() => import('./pages/Exams'));
const ExamDetail = lazy(() => import('./pages/ExamDetail'));
const Reports = lazy(() => import('./pages/Reports'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const TakeExam = lazy(() => import('./pages/TakeExam'));
const ReportDetail = lazy(() => import('./pages/ReportDetail'));
const CreateExam = lazy(() => import('./pages/CreateExam'));
const Profile = lazy(() => import('./pages/Profile'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage-600 to-wisdom-blue flex items-center justify-center shadow-lg shadow-sage-600/30 animate-pulse mx-auto mb-4">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div className="text-2xl font-display font-bold bg-gradient-to-r from-sage-400 to-wisdom-blue bg-clip-text text-transparent mb-2">
        Sage
      </div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-500 mx-auto"></div>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuth = isAuthenticated();
  const userRole = getUserRole();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children, isLanding = false }) => {
  const isAuth = isAuthenticated();

  if (isLanding) {
    return children;
  }

  if (isAuth) {
    const userRole = getUserRole();
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Not Found component
const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sage-600 to-wisdom-blue flex items-center justify-center shadow-lg shadow-sage-600/30 mx-auto mb-6">
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-4xl font-display font-bold text-white mb-3">404</h1>
      <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-gradient-to-r from-sage-600 to-wisdom-blue rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-sage-600/30 transition-all duration-300"
      >
        Go Back
      </button>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={
          <PublicRoute isLanding={true}>
            <Landing />
          </PublicRoute>
        } />

        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* TakeExam - Outside Layout for fullscreen proctored mode */}
        <Route path="/exam/:id/take" element={
          <ProtectedRoute allowedRoles={['student']}>
            <TakeExam />
          </ProtectedRoute>
        } />

        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/exams" element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
              <Exams />
            </ProtectedRoute>
          } />

          <Route path="/exam/:id" element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
              <ExamDetail />
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
              <Reports />
            </ProtectedRoute>
          } />

          <Route path="/report/:id" element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
              <ReportDetail />
            </ProtectedRoute>
          } />

          <Route path="/exams/create" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <CreateExam />
            </ProtectedRoute>
          } />

          <Route path="/exam/:id/edit" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <CreateExam />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />

          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminSettings />
            </ProtectedRoute>
          } />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;