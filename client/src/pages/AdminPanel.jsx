// AdminPanel.jsx - Updated to work with Layout component
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examAPI, reportAPI } from '../services/api';
import {
  FiChevronRight,
  FiDownload,
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
  FiSettings
} from 'react-icons/fi';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    uptime: 99.9,
    activeSessions: 1247,
    examsToday: 342,
    avgResponseTime: 0.8
  });
  
  const [recentExams, setRecentExams] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [examsRes, reportsRes] = await Promise.all([
        examAPI.getExams(),
        reportAPI.getAllReports(),
      ]);

      setRecentExams(examsRes.data.slice(0, 4));
      setRecentReports(reportsRes.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const performanceStats = [
    { label: 'Suspicious Activities', value: 3, trend: 'down', change: '-2' },
    { label: 'Exam Attempts Today', value: 1247, trend: 'up', change: '+12%' },
    { label: 'Average Score', value: 78.5, trend: 'up', change: '+3.2%' },
    { label: 'System Uptime', value: '99.9%', trend: 'stable' },
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-400">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-[calc(100vh-4rem)]">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-full inline-flex items-center mb-2">
                <FiTrendingUp className="mr-1" /> +0.1%
              </div>
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <p className="text-gray-400">Uptime</p>
            </div>
            <div className="p-3 rounded-lg bg-green-400/10 text-green-400">
              <FiActivity className="h-6 w-6" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">Last 30 days</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs text-blue-400 font-medium bg-blue-400/10 px-2 py-1 rounded-full inline-flex items-center mb-2">
                <FiTrendingUp className="mr-1" /> +12%
              </div>
              <div className="text-3xl font-bold text-white mb-1">1,247</div>
              <p className="text-gray-400">Active Sessions</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-400/10 text-blue-400">
              <FiUsers className="h-6 w-6" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">Current active users</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs text-purple-400 font-medium bg-purple-400/10 px-2 py-1 rounded-full inline-flex items-center mb-2">
                <FiTrendingUp className="mr-1" /> +8%
              </div>
              <div className="text-3xl font-bold text-white mb-1">342</div>
              <p className="text-gray-400">Exams Today</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-400/10 text-purple-400">
              <FiBook className="h-6 w-6" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">Started/completed today</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs text-yellow-400 font-medium bg-yellow-400/10 px-2 py-1 rounded-full inline-flex items-center mb-2">
                <FiTrendingDown className="mr-1" /> -0.2s
              </div>
              <div className="text-3xl font-bold text-white mb-1">0.8s</div>
              <p className="text-gray-400">Avg. Response Time</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-400/10 text-yellow-400">
              <FiClock className="h-6 w-6" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">System response time</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceStats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <span className={`
                text-xs font-medium px-2 py-1 rounded-full
                ${stat.trend === 'up' ? 'bg-green-400/10 text-green-400' :
                  stat.trend === 'down' ? 'bg-red-400/10 text-red-400' :
                  'bg-blue-400/10 text-blue-400'}
              `}>
                {stat.change || 'Stable'}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  stat.trend === 'up' ? 'bg-green-500' :
                  stat.trend === 'down' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${Math.min(100, (typeof stat.value === 'number' ? stat.value : 0) / 20)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Exams */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Recent Exams</h2>
              <Link 
                to="/admin/exams" 
                className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center"
              >
                View All <FiChevronRight className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentExams.map((exam) => (
                <div key={exam._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mr-4">
                      <FiBook className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{exam.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{exam.subject} • {exam.questions?.length || 0} questions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      exam.isActive 
                        ? 'bg-green-400/10 text-green-400 border border-green-400/20' 
                        : 'bg-gray-700 text-gray-400 border border-gray-600'
                    }`}>
                      {exam.isActive ? 'Active' : 'Draft'}
                    </span>
                    <Link 
                      to={`/exam/${exam._id}`}
                      className="text-gray-400 hover:text-white"
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
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Recent Attempts</h2>
              <Link 
                to="/admin/reports" 
                className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center"
              >
                View All <FiChevronRight className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                      report.passed 
                        ? 'bg-gradient-to-br from-green-500/20 to-green-600/20' 
                        : 'bg-gradient-to-br from-red-500/20 to-red-600/20'
                    }`}>
                      {report.passed ? (
                        <FiCheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <FiXCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        {report.user?.name || 'Student'} - {report.exam?.title || 'Exam'}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-400 mt-1">
                        <span>{new Date(report.completedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{Math.floor(report.timeTaken / 60)}m {report.timeTaken % 60}s</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      report.passed ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {report.percentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
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
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="group p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-primary-500 hover:bg-gray-750 transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 mr-4 group-hover:bg-blue-500/20 transition-colors">
                <FiUsers className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Manage Users</h3>
                <p className="text-sm text-gray-400 mt-1">View all users</p>
              </div>
            </div>
            <div className="flex items-center text-primary-400 text-sm font-medium">
              Go to Users <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          <Link
            to="/exams/create"
            className="group p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-primary-500 hover:bg-gray-750 transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-green-500/10 text-green-400 mr-4 group-hover:bg-green-500/20 transition-colors">
                <FiBook className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Create Exam</h3>
                <p className="text-sm text-gray-400 mt-1">New exam setup</p>
              </div>
            </div>
            <div className="flex items-center text-primary-400 text-sm font-medium">
              Create New <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          <Link
            to="/admin/analytics"
            className="group p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-primary-500 hover:bg-gray-750 transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 mr-4 group-hover:bg-purple-500/20 transition-colors">
                <FiBarChart2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Analytics</h3>
                <p className="text-sm text-gray-400 mt-1">View reports</p>
              </div>
            </div>
            <div className="flex items-center text-primary-400 text-sm font-medium">
              View Insights <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          <Link
            to="/admin/settings"
            className="group p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-primary-500 hover:bg-gray-750 transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-gray-700 text-gray-400 mr-4 group-hover:bg-gray-600 group-hover:text-white transition-colors">
                <FiSettings className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Settings</h3>
                <p className="text-sm text-gray-400 mt-1">System config</p>
              </div>
            </div>
            <div className="flex items-center text-primary-400 text-sm font-medium">
              Configure <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;