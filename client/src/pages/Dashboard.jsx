import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examAPI, reportAPI, userAPI } from '../services/api'; // Removed analyticsAPI
import { getUser } from '../utils/auth';
import { 
  FiClock, 
  FiBook, 
  FiBarChart2, 
  FiCalendar,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiAward,
  FiUsers,
  FiFileText,
  FiVideo,
  FiShield,
  FiBell,
  FiStar,
  FiGrid,
  FiActivity,
  FiTarget,
  FiZap,
  FiPlay,
  FiPieChart
} from 'react-icons/fi';

// Import Feature Components
import LiveProctoringTab from '../components/dashboard/LiveProctoringTab.jsx';
import AIInsightsTab from '../components/dashboard/AIInsightsTab.jsx';
import PracticeTestsTab from '../components/dashboard/PracticeTestsTab.jsx';
import LeaderboardTab from '../components/dashboard/LeaderboardTab.jsx';
import ExamSimulatorTab from '../components/dashboard/ExamSimulatorTab.jsx';

const Dashboard = () => {
  const [user] = useState(getUser());
  const [exams, setExams] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalExams: 0,
    attemptedExams: 0,
    averageScore: 0,
    passedExams: 0,
    rank: 0,
    totalQuestions: 0,
    accuracy: 0,
    streak: 0,
    timeSpent: 0,
    percentile: 0,
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'proctoring', label: 'Live Proctoring', icon: FiVideo, badge: 'NEW' },
    { id: 'insights', label: 'AI Insights', icon: FiActivity, badge: 'AI' },
    { id: 'practice', label: 'Practice Tests', icon: FiTarget },
    { id: 'leaderboard', label: 'Leaderboard', icon: FiUsers },
    { id: 'simulator', label: 'Exam Simulator', icon: FiZap, badge: 'BETA' },
  ];

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [examsRes, reportsRes, notificationsRes] = await Promise.all([
        examAPI.getExams(),
        reportAPI.getMyReports(),
        userAPI.getNotifications(),
      ]);

      setExams(examsRes.data);
      setReports(reportsRes.data);
      setNotifications(notificationsRes.data);

      // Calculate comprehensive stats
      const attemptedExams = new Set(reportsRes.data.map(r => r.exam?._id)).size;
      const totalQuestions = reportsRes.data.reduce((acc, r) => acc + (r.totalQuestions || 0), 0);
      const correctQuestions = reportsRes.data.reduce((acc, r) => acc + (r.correctAnswers || 0), 0);
      const accuracy = totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0;
      const averageScore = reportsRes.data.length > 0 
        ? reportsRes.data.reduce((acc, r) => acc + (r.percentage || 0), 0) / reportsRes.data.length 
        : 0;
      
      // Get streak from localStorage or API
      const streak = localStorage.getItem('studyStreak') || 0;
      
      // Calculate time spent (in minutes)
      const timeSpent = reportsRes.data.reduce((acc, r) => acc + (r.timeTaken || 0), 0);
      
      // Mock rank and percentile for demo
      const rank = Math.floor(Math.random() * 100) + 1;
      const percentile = Math.floor(Math.random() * 30) + 70;
      
      setStats({
        totalExams: examsRes.data.length,
        attemptedExams,
        averageScore,
        passedExams: reportsRes.data.filter(r => r.passed).length,
        rank,
        totalQuestions,
        accuracy,
        streak,
        timeSpent,
        percentile,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingExams = () => {
    const now = new Date();
    return exams
      .filter(exam => new Date(exam.startDate) > now && new Date(exam.endDate) > now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 4);
  };

  const getRecentReports = () => {
    return reports
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5);
  };

  const getPendingExams = () => {
    return exams.filter(exam => 
      reports.find(r => r.exam?._id === exam._id) === undefined
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'proctoring':
        return <LiveProctoringTab userId={user?._id} />;
      case 'insights':
        return <AIInsightsTab reports={reports} userId={user?._id} />;
      case 'practice':
        return <PracticeTestsTab exams={exams} />;
      case 'leaderboard':
        return <LeaderboardTab />;
      case 'simulator':
        return <ExamSimulatorTab />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Exams Available</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalExams}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm ${getPendingExams().length > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                  {getPendingExams().length} pending
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50">
              <FiBook className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageScore.toFixed(1)}%</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm ${stats.averageScore >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.averageScore >= 70 ? 'Above Average' : 'Needs Improvement'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-50">
              <FiBarChart2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.accuracy.toFixed(1)}%</p>
              <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
                    style={{ width: `${Math.min(stats.accuracy, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50">
              <FiTarget className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Streak</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.streak} days</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-amber-500">
                  {stats.streak > 7 ? '🔥 Amazing!' : 'Keep it going!'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50">
              <FiTrendingUp className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Exams */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upcoming Exams</h2>
                <p className="text-sm text-gray-600 mt-1">Schedule your next attempts</p>
              </div>
              <Link to="/exams" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                View All <FiClock className="ml-2" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {getUpcomingExams().length > 0 ? (
                getUpcomingExams().map((exam) => (
                  <div key={exam._id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {exam.difficulty || 'Medium'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{exam.subject || 'General'} • {exam.totalQuestions || 20} questions</p>
                        <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <FiClock className="mr-1" />
                            {exam.duration || 60} mins
                          </span>
                          <span className="flex items-center">
                            <FiCalendar className="mr-1" />
                            {new Date(exam.startDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {exam.isProctored && (
                            <span className="flex items-center text-amber-600">
                              <FiVideo className="mr-1" />
                              Proctored
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/exam/${exam._id}`}
                        className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                      >
                        Prepare
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiCalendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No upcoming exams scheduled</p>
                  <Link to="/exams" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
                    Browse available exams
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats & Notifications */}
        <div className="space-y-6">
          {/* Performance Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Global Rank</span>
                  <span className="font-semibold text-gray-900">#{stats.rank || '--'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Percentile</span>
                  <span className="font-semibold text-gray-900">{stats.percentile || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full" style={{ width: `${stats.percentile}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Time Spent</span>
                  <span className="font-semibold text-gray-900">{Math.floor(stats.timeSpent / 60)}h {stats.timeSpent % 60}m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <FiBell className="text-gray-400" />
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification, index) => (
                <div key={notification._id || index} className="flex items-start p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                  <div className={`p-2 rounded-lg mr-3 ${
                    notification.type === 'exam' ? 'bg-blue-100 text-blue-600' :
                    notification.type === 'result' ? 'bg-green-100 text-green-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {notification.type === 'exam' ? <FiBook /> :
                     notification.type === 'result' ? <FiCheckCircle /> :
                     <FiAlertTriangle />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.title || 'New Notification'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No notifications</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Performance & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Performance</h2>
                <p className="text-sm text-gray-600 mt-1">Your latest exam results</p>
              </div>
              <Link to="/reports" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                View All <FiBarChart2 className="ml-2" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getRecentReports().map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${
                            report.percentage >= 70 ? 'bg-green-100' :
                            report.percentage >= 50 ? 'bg-amber-100' : 'bg-red-100'
                          }`}>
                            <FiFileText className={`${
                              report.percentage >= 70 ? 'text-green-600' :
                              report.percentage >= 50 ? 'text-amber-600' : 'text-red-600'
                            }`} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {report.exam?.title || 'Exam'}
                            </div>
                            <div className="text-sm text-gray-500">{report.exam?.subject || 'General'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-lg font-semibold text-gray-900">{report.percentage?.toFixed(1) || 0}%</div>
                        <div className="text-xs text-gray-500">{report.correctAnswers || 0}/{report.totalQuestions || 0} correct</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{report.timeTaken || 0}m</div>
                        <div className="text-xs text-gray-500">
                          {new Date(report.completedAt || Date.now()).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.passed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {report.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/report/${report._id}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {reports.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiFileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No exam reports available</p>
                  <Link to="/exams" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
                    Take your first exam
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/exams"
                className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 mr-4">
                  <FiBook className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Take New Exam</h3>
                  <p className="text-sm text-gray-600">Browse available tests</p>
                </div>
              </Link>
              
              <Link
                to="/practice"
                className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all duration-200"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-100 to-green-50 mr-4">
                  <FiTarget className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Practice Tests</h3>
                  <p className="text-sm text-gray-600">Improve your skills</p>
                </div>
              </Link>
              
              <Link
                to="/analytics"
                className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 mr-4">
                  <FiActivity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Analytics</h3>
                  <p className="text-sm text-gray-600">Detailed insights</p>
                </div>
              </Link>
              
              <Link
                to="/profile/settings"
                className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-amber-300 hover:shadow-md transition-all duration-200"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 mr-4">
                  <FiShield className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Security Settings</h3>
                  <p className="text-sm text-gray-600">Manage your account</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with User Greeting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Here's your learning progress and upcoming activities
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold mr-3">
                {user?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.role || 'Student'}</p>
                <p className="text-xs text-gray-500">Student ID: {user?.studentId || '--'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className={`h-5 w-5 mr-2 ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-400'
                }`} />
                {tab.label}
                {tab.badge && (
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;