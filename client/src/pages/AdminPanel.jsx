// pages/AdminPanel.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useExams, useAllReports, useUsers } from '../hooks/useApi';
import {
  FiChevronRight,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiShield,
  FiAlertCircle,
  FiUsers,
  FiBook,
  FiBarChart2,
  FiSettings,
  FiCpu,
  FiHardDrive,
  FiServer,
  FiDatabase,
  FiLock,
  FiZap
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    uptime: 0,
    activeSessions: 0,
    examsToday: 0,
    avgResponseTime: 0,
    totalUsers: 0,
    totalExams: 0,
    passRate: 0,
    suspiciousActivities: 0
  });

  // Fetch real data with error handling
  const { 
    exams = [], 
    loading: examsLoading, 
    error: examsError 
  } = useExams();
  
  const { 
    reports = [], 
    loading: reportsLoading, 
    error: reportsError 
  } = useAllReports();
  
  const { 
    users = [], 
    loading: usersLoading, 
    error: usersError 
  } = useUsers();

  // Show errors if any
  useEffect(() => {
    if (examsError) toast.error(`Exams Error: ${examsError}`);
    if (reportsError) toast.error(`Reports Error: ${reportsError}`);
    if (usersError) toast.error(`Users Error: ${usersError}`);
  }, [examsError, reportsError, usersError]);

  // Calculate stats with useMemo to prevent infinite loops
  const calculatedStats = useMemo(() => {
    if (!exams.length && !reports.length && !users.length) {
      return null;
    }

    const today = new Date().toDateString();
    const examsToday = reports.filter(r => 
      r.completedAt && new Date(r.completedAt).toDateString() === today
    ).length;

    const passRate = reports.length > 0 
      ? Number((reports.filter(r => r.passed).length / reports.length * 100).toFixed(1))
      : 78.5;

    return {
      examsToday,
      totalUsers: users.length,
      totalExams: exams.length,
      passRate,
    };
  }, [exams, reports, users]);

  // Update stats only when calculatedStats changes
  useEffect(() => {
    if (calculatedStats) {
      setStats(prev => ({
        ...prev,
        ...calculatedStats
      }));
    }
  }, [calculatedStats]);

  const performanceStats = [
    { 
      label: 'Suspicious Activities', 
      value: stats.suspiciousActivities, 
      trend: 'down', 
      change: '-2', 
      color: 'red',
      progress: 15,
      icon: FiAlertCircle
    },
    { 
      label: 'Exam Attempts Today', 
      value: stats.examsToday, 
      trend: 'up', 
      change: '+12%', 
      color: 'green',
      progress: Math.min(stats.examsToday / 10, 100),
      icon: FiZap
    },
    { 
      label: 'Average Score', 
      value: `${stats.passRate}%`, 
      trend: 'up', 
      change: '+3.2%', 
      color: 'blue',
      progress: stats.passRate,
      icon: FiBarChart2
    },
    { 
      label: 'System Response', 
      value: `${stats.avgResponseTime}s`, 
      trend: 'stable', 
      change: '0.8s', 
      color: 'purple',
      progress: 20,
      icon: FiClock
    },
  ];

  const systemHealth = [
    { label: 'CPU Usage', value: 45, icon: FiCpu, color: 'blue' },
    { label: 'Memory Usage', value: 62, icon: FiHardDrive, color: 'purple' },
    { label: 'Storage', value: 28, icon: FiDatabase, color: 'green' },
    { label: 'Network', value: 34, icon: FiServer, color: 'yellow' },
  ];

  const loading = examsLoading || reportsLoading || usersLoading;

  if (loading) {
    return (
      <div className="bg-black min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Loading admin dashboard...</p>
          <p className="text-sm text-gray-600 mt-2">Fetching system analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-[calc(100vh-4rem)] w-full">
      <div className="space-y-8">
        {/* System Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-green-400 font-medium bg-green-500/10 px-2 py-1 rounded-full inline-flex items-center mb-2 border border-green-500/20">
                  <FiTrendingUp className="mr-1" /> +0.01%
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.uptime}%</div>
                <p className="text-gray-500">System Uptime</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all">
                <FiActivity className="h-6 w-6" />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-800">
              <div className="text-sm text-gray-500">Last 30 days • 99.99% target</div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded-full inline-flex items-center mb-2 border border-blue-500/20">
                  <FiTrendingUp className="mr-1" /> +12%
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.activeSessions.toLocaleString()}</div>
                <p className="text-gray-500">Active Sessions</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                <FiUsers className="h-6 w-6" />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-800">
              <div className="text-sm text-gray-500">Current active users</div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-emerald-500/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-full inline-flex items-center mb-2 border border-emerald-500/20">
                  <FiTrendingUp className="mr-1" /> +8%
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.examsToday}</div>
                <p className="text-gray-500">Exams Today</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                <FiBook className="h-6 w-6" />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-800">
              <div className="text-sm text-gray-500">Started/completed today</div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-yellow-500/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-yellow-400 font-medium bg-yellow-500/10 px-2 py-1 rounded-full inline-flex items-center mb-2 border border-yellow-500/20">
                  <FiTrendingDown className="mr-1" /> -0.2s
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.avgResponseTime}s</div>
                <p className="text-gray-500">Avg. Response Time</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500/20 group-hover:scale-110 transition-all">
                <FiClock className="h-6 w-6" />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-800">
              <div className="text-sm text-gray-500">System response time</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceStats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClass = {
              red: 'from-red-500 to-rose-400',
              green: 'from-green-500 to-emerald-400',
              blue: 'from-blue-500 to-cyan-400',
              purple: 'from-purple-500 to-pink-400'
            };
            
            return (
              <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
                      <Icon className={`h-5 w-5 text-${stat.color}-400`} />
                    </div>
                    <span className="text-gray-400 text-sm">{stat.label}</span>
                  </div>
                  <span className={`
                    text-xs font-medium px-2 py-1 rounded-full border
                    ${stat.trend === 'up' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      stat.trend === 'down' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'}
                  `}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-4">
                  {stat.value}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-400">{stat.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${colorClass[stat.color]}`}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Exams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Recent Exams</h2>
                  <p className="text-sm text-gray-500 mt-1">Latest exams created in the system</p>
                </div>
                <Link 
                  to="/admin/exams" 
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center group"
                >
                  View All 
                  <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {exams.slice(0, 4).map((exam) => (
                  <div key={exam._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all group">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center mr-4 border border-purple-500/20">
                        <FiBook className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{exam.title}</h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                          <span>{exam.subject || 'General'}</span>
                          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                          <span>{exam.questions?.length || 0} questions</span>
                          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                          <span>{exam.duration || 60} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
                        exam.isActive 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-gray-800 text-gray-400 border-gray-700'
                      }`}>
                        {exam.isActive ? 'Active' : 'Draft'}
                      </span>
                      <Link 
                        to={`/exam/${exam._id}`}
                        className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg"
                      >
                        <FiEye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Attempts */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Recent Attempts</h2>
                  <p className="text-sm text-gray-500 mt-1">Latest exam submissions</p>
                </div>
                <Link 
                  to="/admin/reports" 
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center group"
                >
                  View All 
                  <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {reports.slice(0, 4).map((report) => (
                  <div key={report._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all group">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 border ${
                        report.passed 
                          ? 'bg-green-500/10 border-green-500/20' 
                          : 'bg-red-500/10 border-red-500/20'
                      }`}>
                        {report.passed ? (
                          <FiCheckCircle className="h-6 w-6 text-green-400" />
                        ) : (
                          <FiXCircle className="h-6 w-6 text-red-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {report.user?.name || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {report.exam?.title || 'Unknown Exam'}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                          <span>{new Date(report.completedAt).toLocaleDateString()}</span>
                          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                          <span>{Math.floor(report.timeTaken / 60)}m {report.timeTaken % 60}s</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${
                        report.passed ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {report.percentage?.toFixed(1)}%
                      </div>
                      <div className={`text-xs font-medium mt-1 ${
                        report.passed ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {report.passed ? 'Passed' : 'Failed'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="group p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-purple-500 transition-all"
            >
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-4 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all">
                <FiUsers className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-1">Manage Users</h3>
              <p className="text-sm text-gray-500 mb-4">
                {stats.totalUsers} total users
              </p>
              <div className="flex items-center text-purple-400 text-sm font-medium">
                Go to Users 
                <FiChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
            
            <Link
              to="/exams/create"
              className="group p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-emerald-500 transition-all"
            >
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-4 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                <FiBook className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-1">Create Exam</h3>
              <p className="text-sm text-gray-500 mb-4">
                {stats.totalExams} exams total
              </p>
              <div className="flex items-center text-emerald-400 text-sm font-medium">
                Create Now 
                <FiChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
            
            <Link
              to="/admin/analytics"
              className="group p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-blue-500 transition-all"
            >
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-4 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                <FiBarChart2 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-1">Analytics</h3>
              <p className="text-sm text-gray-500 mb-4">
                {reports.length} total attempts
              </p>
              <div className="flex items-center text-blue-400 text-sm font-medium">
                View Insights 
                <FiChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
            
            <Link
              to="/admin/settings"
              className="group p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-pink-500 transition-all"
            >
              <div className="p-3 rounded-lg bg-pink-500/10 text-pink-400 w-fit mb-4 group-hover:bg-pink-500/20 group-hover:scale-110 transition-all">
                <FiSettings className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-1">Settings</h3>
              <p className="text-sm text-gray-500 mb-4">Configure system</p>
              <div className="flex items-center text-pink-400 text-sm font-medium">
                Configure 
                <FiChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;