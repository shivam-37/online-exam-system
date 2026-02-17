import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { clearAuth, getUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLogOut } from 'react-icons/fi';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Check if current page is admin panel to apply different styling
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen ${isAdminPage ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Header Bar - Minimal */}
      <div className={`sticky top-0 z-10 ${
        isAdminPage 
          ? 'bg-gray-800 border-b border-gray-700' 
          : 'bg-white border-b border-gray-200'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className={`text-xl font-bold ${
              isAdminPage ? 'text-white' : 'text-gray-900'
            }`}>
              SageExam
            </div>
            <div className={`ml-4 text-sm ${
              isAdminPage ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {/* Show page title dynamically */}
              {location.pathname === '/dashboard' && 'Dashboard'}
              {location.pathname === '/exams' && 'Exams'}
              {location.pathname === '/reports' && 'Reports'}
              {location.pathname.startsWith('/admin') && 'Admin Panel'}
            </div>
          </div>
          
          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className={`text-sm text-right hidden md:block ${
              isAdminPage ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className="font-medium">{user?.name || 'User'}</div>
              <div className="text-xs capitalize">{user?.role || 'student'}</div>
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAdminPage 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <FiLogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`min-h-[calc(100vh-4rem)] pb-8 ${
        isAdminPage ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`px-4 sm:px-6 lg:px-8 py-8 ${
          isAdminPage ? '' : 'max-w-7xl mx-auto'
        }`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;