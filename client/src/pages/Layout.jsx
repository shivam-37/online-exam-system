import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome,
  FiBook,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { clearAuth, getUser } from '../utils/auth';
import toast from 'react-hot-toast';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: FiHome,
      roles: ['student', 'teacher', 'admin'],
      current: location.pathname === '/dashboard'
    },
    { 
      name: 'Exams', 
      href: '/exams', 
      icon: FiBook,
      roles: ['student', 'teacher', 'admin'],
      current: location.pathname.startsWith('/exam') || location.pathname === '/exams'
    },
    { 
      name: 'Reports', 
      href: '/reports', 
      icon: FiBarChart2,
      roles: ['student', 'teacher', 'admin'],
      current: location.pathname.startsWith('/report') || location.pathname === '/reports'
    },
    { 
      name: 'Admin', 
      href: '/admin', 
      icon: FiSettings,
      roles: ['admin'],
      current: location.pathname.startsWith('/admin')
    },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || 'student')
  );

  const isAdminPage = location.pathname.startsWith('/admin');
  const isDarkMode = isAdminPage;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${isDarkMode ? 'bg-primary-600' : 'bg-primary-500'}`}>
                    <span className="text-white font-bold">S</span>
                  </div>
                  <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Sage Exam
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors
                      ${item.current
                        ? isDarkMode
                          ? 'border-primary-500 text-white'
                          : 'border-primary-600 text-gray-900'
                        : isDarkMode
                          ? 'border-transparent text-gray-300 hover:text-white hover:border-gray-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-md ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>

              {/* User dropdown */}
              <div className="ml-4 relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-primary-500' : 'focus:ring-primary-600'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-primary-600' : 'bg-primary-100'}`}>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-primary-600'}`}>
                      {getInitials(user?.name || 'User')}
                    </span>
                  </div>
                  <div className="ml-3 hidden md:block text-left">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user?.name || 'User'}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                    </p>
                  </div>
                  <FiChevronDown className={`ml-2 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>

                {/* User dropdown menu */}
                {userDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <FiUser className="h-4 w-4 mr-2" />
                        Your Profile
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <FiLogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="pt-2 pb-3 space-y-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-base font-medium border-l-4
                    ${item.current
                      ? isDarkMode
                        ? 'border-primary-500 bg-gray-900 text-white'
                        : 'border-primary-600 bg-primary-50 text-primary-700'
                      : isDarkMode
                        ? 'border-transparent text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-600'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </div>
            <div className={`pt-4 pb-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-primary-600' : 'bg-primary-100'}`}>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-primary-600'}`}>
                      {getInitials(user?.name || 'User')}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {user?.name || 'User'}
                  </div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className={`block px-4 py-2 text-base font-medium ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiUser className="h-5 w-5 mr-3" />
                    Your Profile
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className={`block w-full text-left px-4 py-2 text-base font-medium ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
                >
                  <div className="flex items-center">
                    <FiLogOut className="h-5 w-5 mr-3" />
                    Sign out
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;