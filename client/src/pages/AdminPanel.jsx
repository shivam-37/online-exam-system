import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examAPI, reportAPI, settingsAPI } from '../services/api';
import { 
  FiUsers, 
  FiBook, 
  FiBarChart2, 
  FiSettings,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiPieChart
} from 'react-icons/fi';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalAttempts: 0,
    passRate: 0,
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

      const totalExams = examsRes.data.length;
      const totalAttempts = reportsRes.data.length;
      const passedAttempts = reportsRes.data.filter(r => r.passed).length;
      const passRate = totalAttempts > 0 ? (passedAttempts / totalAttempts * 100) : 0;

      setStats({
        totalUsers: 150, // Mock data - replace with actual API call
        totalExams,
        totalAttempts,
        passRate,
      });

      setRecentExams(examsRes.data.slice(0, 5));
      setRecentReports(reportsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simplified chart data for mock display
  const performanceData = [65, 70, 75, 72, 78, 80];
  const examDistribution = [12, 8, 5, 7, 10];
  const subjects = ['Math', 'Science', 'History', 'English', 'Computer'];
  const passRateData = { passed: 75, failed: 25 };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System overview and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiUsers className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/users" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all users →
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBook className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalExams}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/exams" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Manage exams →
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBarChart2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalAttempts}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/reports" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View reports →
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiTrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.passRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/analytics" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View analytics →
              </Link>
            </div>
          </div>
        </div>

        {/* Charts Section - Simplified */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trend */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Performance Trend</h2>
              <FiActivity className="h-6 w-6 text-primary-600" />
            </div>
            <div className="h-64 flex items-end space-x-2 p-4">
              {performanceData.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary-500 rounded-t-lg"
                    style={{ height: `${value}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}</span>
                  <span className="text-xs font-medium">{value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Distribution */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Exam Distribution</h2>
              <FiPieChart className="h-6 w-6 text-green-600" />
            </div>
            <div className="h-64">
              <div className="flex items-center justify-center h-full">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-900">{stats.totalExams}</span>
                      <p className="text-sm text-gray-600">Total Exams</p>
                    </div>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Simplified pie chart using SVG */}
                    {examDistribution.reduce((acc, value, index) => {
                      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                      const percentage = (value / stats.totalExams) * 100;
                      const startAngle = acc;
                      const endAngle = startAngle + (percentage * 3.6);
                      
                      const startRad = (startAngle - 90) * Math.PI / 180;
                      const endRad = (endAngle - 90) * Math.PI / 180;
                      
                      const x1 = 50 + 40 * Math.cos(startRad);
                      const y1 = 50 + 40 * Math.sin(startRad);
                      const x2 = 50 + 40 * Math.cos(endRad);
                      const y2 = 50 + 40 * Math.sin(endRad);
                      
                      const largeArc = percentage > 50 ? 1 : 0;
                      
                      return (
                        <React.Fragment key={index}>
                          <path
                            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={colors[index]}
                            stroke="white"
                            strokeWidth="2"
                          />
                        </React.Fragment>
                      );
                    }, 0)}
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {subjects.map((subject, index) => (
                  <div key={subject} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index]
                      }}
                    ></div>
                    <span className="text-sm text-gray-600">{subject}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Data Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Exams */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Exams</h2>
              <Link to="/exams" className="text-primary-600 hover:text-primary-700 font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentExams.map((exam) => (
                <div key={exam._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <FiBook className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 truncate max-w-[200px]">{exam.title}</h3>
                      <p className="text-sm text-gray-600">{exam.subject}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    exam.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {exam.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Attempts</h2>
              <Link to="/reports" className="text-primary-600 hover:text-primary-700 font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      report.passed ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {report.passed ? (
                        <FiCheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <FiXCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 truncate max-w-[180px]">
                        {report.user?.name || 'User'} - {report.exam?.title || 'Exam'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>Score: {report.percentage.toFixed(1)}%</span>
                        <span className="flex items-center">
                          <FiClock className="mr-1" />
                          {Math.floor(report.timeTaken / 60)}m {report.timeTaken % 60}s
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      report.passed ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {report.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="card hover:shadow-lg transition-shadow duration-200 text-center group"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <FiUsers className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600 mt-1">View and manage all users</p>
            </Link>
            
            <Link
              to="/exams/create"
              className="card hover:shadow-lg transition-shadow duration-200 text-center group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <FiBook className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Create Exam</h3>
              <p className="text-sm text-gray-600 mt-1">Create a new exam</p>
            </Link>
            
            <Link
              to="/admin/analytics"
              className="card hover:shadow-lg transition-shadow duration-200 text-center group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <FiBarChart2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">View detailed analytics</p>
            </Link>
            
            <Link
              to="/admin/settings"
              className="card hover:shadow-lg transition-shadow duration-200 text-center group"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <FiSettings className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Settings</h3>
              <p className="text-sm text-gray-600 mt-1">System configuration</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;