import React, { useState, useEffect } from 'react';
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
  FiX,
  FiVideo,
  FiTarget,
  FiUsers,
  FiAward,
  FiFileText,
  FiActivity,
  FiBell,
  FiHelpCircle,
  FiGrid
} from 'react-icons/fi';
import { 
  HiOutlineSparkles,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import { MdOutlineLeaderboard, MdOutlineQuiz } from 'react-icons/md';
import { VscGraph } from 'react-icons/vsc';
import { clearAuth, getUser, getUserRole } from '../utils/auth';
import toast from 'react-hot-toast';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const userRole = getUserRole() || 'student';

  useEffect(() => {
    // Fetch notifications based on user role
    const fetchNotifications = async () => {
      try {
        // You can implement this API call
        // const res = await userAPI.getNotifications();
        // setNotifications(res.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/');
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

  // Role-based navigation configuration
  const getNavigationByRole = () => {
    const navigationConfig = {
      // Student Navigation
      student: [
        { 
          name: 'Dashboard', 
          href: '/dashboard', 
          icon: FiHome,
          current: location.pathname === '/dashboard'
        },
        { 
          name: 'Exams', 
          href: '/exams', 
          icon: FiBook,
          current: location.pathname.startsWith('/exams') && !location.pathname.includes('create')
        },
        { 
          name: 'Live Proctoring', 
          href: '/exams', 
          icon: FiVideo,
          badge: 'LIVE',
          current: location.pathname.includes('proctoring')
        },
        { 
          name: 'Reports', 
          href: '/reports', 
          icon: FiBarChart2,
          current: location.pathname.startsWith('/reports')
        },
        { 
          name: 'Practice', 
          href: '/exams', 
          icon: FiTarget,
          current: false
        },
        { 
          name: 'Leaderboard', 
          href: '/reports', 
          icon: MdOutlineLeaderboard,
          current: false
        }
      ],

      // Teacher Navigation
      teacher: [
        { 
          name: 'Dashboard', 
          href: '/dashboard', 
          icon: FiHome,
          current: location.pathname === '/dashboard'
        },
        { 
          name: 'My Exams', 
          href: '/exams', 
          icon: FiBook,
          current: location.pathname.startsWith('/exams') && !location.pathname.includes('create')
        },
        { 
          name: 'Create Exam', 
          href: '/exams/create', 
          icon: FiFileText,
          current: location.pathname === '/exams/create'
        },
        { 
          name: 'Reports', 
          href: '/reports', 
          icon: FiBarChart2,
          current: location.pathname.startsWith('/reports')
        },
        { 
          name: 'Analytics', 
          href: '/reports', 
          icon: VscGraph,
          current: false
        }
      ],

      // Admin Navigation
      admin: [
        { 
          name: 'Dashboard', 
          href: '/admin', 
          icon: FiHome,
          current: location.pathname === '/admin'
        },
        { 
          name: 'User Management', 
          href: '/admin/users', 
          icon: FiUsers,
          current: location.pathname === '/admin/users'
        },
        { 
          name: 'Exam Management', 
          href: '/exams', 
          icon: FiBook,
          current: location.pathname.startsWith('/exams')
        },
        { 
          name: 'Reports', 
          href: '/reports', 
          icon: FiBarChart2,
          current: location.pathname.startsWith('/reports')
        },
        { 
          name: 'Settings', 
          href: '/admin/settings', 
          icon: FiSettings,
          current: location.pathname === '/admin/settings'
        }
      ]
    };

    return navigationConfig[userRole] || navigationConfig.student;
  };

  const navigation = getNavigationByRole();

  // Role-based styling
  const roleColors = {
    student: {
      primary: 'from-blue-600 to-cyan-500',
      bg: 'bg-blue-50',
      light: 'from-blue-50 to-cyan-50',
      text: 'text-blue-600',
      border: 'border-blue-600',
      gradient: 'from-sage-600 to-wisdom-blue'
    },
    teacher: {
      primary: 'from-emerald-600 to-green-500',
      bg: 'bg-emerald-50',
      light: 'from-emerald-50 to-green-50',
      text: 'text-emerald-600',
      border: 'border-emerald-600',
      gradient: 'from-emerald-600 to-teal-500'
    },
    admin: {
      primary: 'from-purple-600 to-pink-500',
      bg: 'bg-purple-50',
      light: 'from-purple-50 to-pink-50',
      text: 'text-purple-600',
      border: 'border-purple-600',
      gradient: 'from-purple-600 to-pink-500'
    }
  };

  const currentRoleColor = roleColors[userRole] || roleColors.student;

  // Check if current path is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen ${
      isAdminRoute ? 'bg-black' : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-50 ${
        isAdminRoute 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white/80 backdrop-blur-lg border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo with Role Badge */}
              <div className="flex-shrink-0 flex items-center">
                <Link to={userRole === 'admin' ? '/admin' : '/dashboard'} className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${currentRoleColor.gradient} flex items-center justify-center mr-2 shadow-lg`}>
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <div>
                    <span className={`text-xl font-bold font-display ${
                      isAdminRoute ? 'text-white' : 'text-gray-900'
                    }`}>
                      Sage
                    </span>
                    {userRole === 'admin' && (
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        isAdminRoute 
                          ? 'bg-purple-500/20 text-purple-300' 
                          : 'bg-purple-100 text-purple-700'
                      } font-medium`}>
                        Admin
                      </span>
                    )}
                    {userRole === 'teacher' && !isAdminRoute && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                        Teacher
                      </span>
                    )}
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all
                      ${item.current
                        ? isAdminRoute
                          ? `bg-gradient-to-r ${currentRoleColor.gradient} text-white shadow-lg`
                          : `bg-gradient-to-r ${currentRoleColor.gradient} text-white shadow-md`
                        : isAdminRoute
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {item.badge && (
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                        item.current 
                          ? 'bg-white/20 text-white' 
                          : isAdminRoute
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-red-100 text-red-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className={`relative p-2 rounded-lg transition-colors ${
                isAdminRoute 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <FiBell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Help/Support */}
              <Link 
                to="/help" 
                className={`hidden md:block p-2 rounded-lg transition-colors ${
                  isAdminRoute 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FiHelpCircle className="h-5 w-5" />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-md transition-colors ${
                  isAdminRoute 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentRoleColor.gradient} flex items-center justify-center shadow-lg`}>
                    <span className="text-sm font-semibold text-white">
                      {getInitials(user?.name || 'User')}
                    </span>
                  </div>
                  <div className="ml-3 hidden md:block text-left">
                    <p className={`text-sm font-medium ${isAdminRoute ? 'text-white' : 'text-gray-900'}`}>
                      {user?.name || 'User'}
                    </p>
                    <p className={`text-xs ${currentRoleColor.text}`}>
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </p>
                  </div>
                  <FiChevronDown className={`ml-2 h-5 w-5 ${isAdminRoute ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>

                {/* User dropdown menu */}
                {userDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 bg-white ring-1 ring-black ring-opacity-5">
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
                    <Link
                      to={userRole === 'admin' ? '/admin/settings' : '/profile'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <FiSettings className="h-4 w-4 mr-2" />
                        Settings
                      </div>
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
          <div className={`md:hidden ${
            isAdminRoute ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'
          }`}>
            <div className="pt-2 pb-3 space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-base font-medium rounded-lg
                    ${item.current
                      ? `bg-gradient-to-r ${currentRoleColor.gradient} text-white`
                      : isAdminRoute
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                  {item.badge && (
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      item.current 
                        ? 'bg-white/20 text-white' 
                        : isAdminRoute
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-red-100 text-red-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <div className={`pt-4 pb-3 border-t ${isAdminRoute ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${currentRoleColor.gradient} flex items-center justify-center`}>
                    <span className="text-sm font-semibold text-white">
                      {getInitials(user?.name || 'User')}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className={`text-base font-medium ${isAdminRoute ? 'text-white' : 'text-gray-800'}`}>
                    {user?.name || 'User'}
                  </div>
                  <div className={`text-sm font-medium ${currentRoleColor.text}`}>
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Link
                  to="/profile"
                  className={`block px-3 py-2 text-base font-medium rounded-lg ${
                    isAdminRoute 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiUser className="h-5 w-5 mr-3" />
                    Your Profile
                  </div>
                </Link>
                <Link
                  to={userRole === 'admin' ? '/admin/settings' : '/profile'}
                  className={`block px-3 py-2 text-base font-medium rounded-lg ${
                    isAdminRoute 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiSettings className="h-5 w-5 mr-3" />
                    Settings
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium rounded-lg ${
                    isAdminRoute 
                      ? 'text-red-400 hover:text-red-300 hover:bg-gray-800' 
                      : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  }`}
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

      {/* Page Header - Dynamic based on route - Hide for admin routes */}
      {!isAdminRoute && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">
                  {getPageTitle(location.pathname, userRole)}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {getPageDescription(location.pathname, userRole)}
                </p>
              </div>
              {userRole === 'teacher' && location.pathname === '/exams' && (
                <Link
                  to="/exams/create"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-300"
                >
                  + Create New Exam
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Header for admin routes */}
      {isAdminRoute && (
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold text-white">
                  {getPageTitle(location.pathname, userRole)}
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  {getPageDescription(location.pathname, userRole)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Renders child routes */}
      <main className={`${
        isAdminRoute ? 'bg-black' : ''
      } max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        <Outlet />
      </main>

      {/* Floating Action Button for Mobile - Student Quick Practice */}
      {userRole === 'student' && !isAdminRoute && (
        <Link 
          to="/exams" 
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-sage-600 to-wisdom-blue text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:shadow-sage-600/50 hover:scale-110 transition-all duration-300"
        >
          <FiTarget className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
};

// Helper functions for page titles and descriptions
const getPageTitle = (pathname, role) => {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/exams') return role === 'teacher' ? 'My Exams' : 'Available Exams';
  if (pathname === '/exams/create') return 'Create New Exam';
  if (pathname.includes('/exam/') && pathname.includes('/edit')) return 'Edit Exam';
  if (pathname.includes('/exam/') && pathname.includes('/take')) return 'Take Exam';
  if (pathname.includes('/exam/')) return 'Exam Details';
  if (pathname === '/reports') return 'Exam Reports';
  if (pathname.includes('/report/')) return 'Report Details';
  if (pathname === '/profile') return 'My Profile';
  if (pathname === '/admin') return 'Admin Dashboard';
  if (pathname === '/admin/users') return 'User Management';
  if (pathname === '/admin/settings') return 'System Settings';
  return 'X Exam';
};

const getPageDescription = (pathname, role) => {
  if (pathname === '/dashboard') {
    if (role === 'admin') return 'Overview of your platform and system status';
    if (role === 'teacher') return 'Monitor your students and exam performance';
    return 'Track your learning progress and upcoming exams';
  }
  if (pathname === '/exams') {
    if (role === 'teacher') return 'Manage and create exams for your students';
    if (role === 'admin') return 'Manage all exams in the system';
    return 'Browse and attempt available exams';
  }
  if (pathname === '/exams/create') return 'Create a new exam with questions and settings';
  if (pathname.includes('/exam/') && pathname.includes('/edit')) return 'Modify exam details and questions';
  if (pathname.includes('/exam/') && pathname.includes('/take')) return 'Read instructions carefully before starting';
  if (pathname === '/reports') {
    if (role === 'admin') return 'View all exam reports and analytics';
    if (role === 'teacher') return 'Review student performance and results';
    return 'Your exam history and performance analysis';
  }
  if (pathname === '/profile') return 'Manage your account and preferences';
  if (pathname === '/admin') return 'Platform overview and quick actions';
  if (pathname === '/admin/users') return 'Add, edit, or remove system users';
  if (pathname === '/admin/settings') return 'Configure system settings and parameters';
  return '';
};

export default Layout;