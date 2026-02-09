import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examAPI, reportAPI, userAPI } from '../services/api';
import { getUser } from '../utils/auth';
import { 
  FiClock, FiBook, FiBarChart2, FiCalendar, FiCheckCircle,
  FiAlertTriangle, FiTrendingUp, FiAward, FiUsers, FiFileText,
  FiVideo, FiShield, FiBell, FiStar, FiGrid, FiActivity,
  FiTarget, FiZap, FiPlay, FiPieChart, FiChevronRight,
  FiSearch, FiFilter, FiMoreVertical, FiDownload, FiEye,
  FiRefreshCw, FiSettings, FiLogOut, FiHelpCircle
} from 'react-icons/fi';
import { 
  HiOutlineSparkles, 
  HiOutlineFire, 
  HiOutlineAcademicCap 
} from 'react-icons/hi';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    weeklyProgress: 25,
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'proctoring', label: 'Proctoring', icon: FiVideo, badge: 'LIVE' },
    { id: 'insights', label: 'Insights', icon: HiOutlineSparkles, badge: 'AI' },
    { id: 'practice', label: 'Practice', icon: FiTarget },
    { id: 'leaderboard', label: 'Rankings', icon: FiUsers },
    { id: 'simulator', label: 'Simulator', icon: FiZap, badge: 'BETA' },
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
      
      const streak = localStorage.getItem('studyStreak') || 0;
      const timeSpent = reportsRes.data.reduce((acc, r) => acc + (r.timeTaken || 0), 0);
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
        weeklyProgress: 25 + Math.floor(Math.random() * 30),
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
      .slice(0, 3);
  };

  const getRecentReports = () => {
    return reports
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 4);
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
      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Exams</p>
              <p className="text-2xl font-bold mt-1">{stats.totalExams}</p>
              <div className="text-xs opacity-75 mt-2">
                <span className="flex items-center">
                  <FiChevronRight className="h-3 w-3 mr-1" />
                  {getPendingExams().length} pending
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/20">
              <FiBook className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-green-400 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg. Score</p>
              <p className="text-2xl font-bold mt-1">{stats.averageScore.toFixed(1)}%</p>
              <div className="text-xs opacity-75 mt-2">
                <span className={`flex items-center ${stats.averageScore >= 70 ? 'text-white' : 'text-yellow-200'}`}>
                  {stats.averageScore >= 70 ? '✓ On track' : '⚠ Needs work'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/20">
              <FiBarChart2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-purple-400 rounded-2xl p-5 text-white shadow-lg shadow-violet-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Accuracy</p>
              <p className="text-2xl font-bold mt-1">{stats.accuracy.toFixed(1)}%</p>
              <div className="w-full bg-white/30 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-white h-1.5 rounded-full"
                  style={{ width: `${Math.min(stats.accuracy, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/20">
              <FiTarget className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl p-5 text-white shadow-lg shadow-amber-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Streak</p>
              <p className="text-2xl font-bold mt-1">{stats.streak} days</p>
              <div className="text-xs opacity-75 mt-2 flex items-center">
                <HiOutlineFire className="h-3 w-3 mr-1" />
                {stats.streak > 7 ? '🔥 Hot streak!' : 'Keep going!'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/20">
              <FiTrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-pink-400 rounded-2xl p-5 text-white shadow-lg shadow-rose-500/25">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Rank</p>
              <p className="text-2xl font-bold mt-1">#{stats.rank}</p>
              <div className="text-xs opacity-75 mt-2">
                Top {stats.percentile}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/20">
              <FiAward className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Exams */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upcoming Exams</h2>
                <p className="text-sm text-gray-600 mt-1">Your scheduled attempts</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiCalendar className="h-5 w-5 text-gray-600" />
                </button>
                <Link to="/exams" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center">
                  View All <FiChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              {getUpcomingExams().map((exam) => (
                <div key={exam._id} className="group border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-xl mr-4 ${
                        exam.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                        exam.difficulty === 'Hard' ? 'bg-rose-100 text-rose-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        <HiOutlineAcademicCap className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{exam.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{exam.subject} • {exam.duration || 60} min</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        {new Date(exam.startDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </div>
                      <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">
                        Prepare
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Performance Trend</h2>
                <p className="text-sm text-gray-600 mt-1">Your progress over time</p>
              </div>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            
            <div className="h-64 flex items-center justify-center">
              {/* Placeholder for chart */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                  <FiActivity className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-gray-500">Performance data visualization</p>
                <p className="text-sm text-gray-400 mt-1">Connect to analytics service</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Learning Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <FiClock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Spent</p>
                    <p className="font-semibold text-gray-900">{Math.floor(stats.timeSpent / 60)}h {stats.timeSpent % 60}m</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <FiCheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Passed Exams</p>
                    <p className="font-semibold text-gray-900">{stats.passedExams}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <FiPieChart className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Weekly Progress</p>
                    <p className="font-semibold text-gray-900">{stats.weeklyProgress}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Recent Activity</h3>
              <FiBell className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {getRecentReports().slice(0, 3).map((report, index) => (
                <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className={`p-2 rounded-lg mr-3 ${
                    report.passed ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {report.passed ? <FiCheckCircle /> : <FiAlertTriangle />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {report.exam?.title?.substring(0, 30)}...
                    </p>
                    <p className="text-xs text-gray-500">
                      Score: {report.percentage?.toFixed(1)}% • {new Date(report.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <FiPlay className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Start Test</span>
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <FiDownload className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Reports</span>
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <FiSettings className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Settings</span>
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <FiHelpCircle className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Help</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Exams Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Exams</h2>
            <p className="text-sm text-gray-600 mt-1">Your latest attempts and results</p>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search exams..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg">
              <FiFilter className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-500">Exam</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Score</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getRecentReports().map((report) => (
                <tr key={report._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        report.percentage >= 70 ? 'bg-green-100' :
                        report.percentage >= 50 ? 'bg-amber-100' : 'bg-rose-100'
                      }`}>
                        <FiFileText className={`${
                          report.percentage >= 70 ? 'text-green-600' :
                          report.percentage >= 50 ? 'text-amber-600' : 'text-rose-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{report.exam?.title}</p>
                        <p className="text-sm text-gray-500">{report.exam?.subject}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-gray-900">
                      {new Date(report.completedAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="text-lg font-bold text-gray-900">{report.percentage?.toFixed(1)}%</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.passed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {report.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <FiEye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <FiDownload className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
          <p className="text-sm text-gray-400 mt-1">Preparing your learning insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 mr-3">
                  <HiOutlineAcademicCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ExamPro</h1>
                  <p className="text-xs text-gray-500">Learning Platform</p>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex ml-12 space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
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
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 w-64 focus:w-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <FiBell className="h-5 w-5 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Refresh */}
              <button 
                onClick={fetchDashboardData}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiRefreshCw className="h-5 w-5 text-gray-600" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.role || 'Student'}</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {sidebarOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FiSettings className="h-4 w-4 mr-3 text-gray-400" />
                        Profile Settings
                      </Link>
                      <Link to="/analytics" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FiActivity className="h-4 w-4 mr-3 text-gray-400" />
                        Analytics
                      </Link>
                      <Link to="/help" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FiHelpCircle className="h-4 w-4 mr-3 text-gray-400" />
                        Help & Support
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 pt-2">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        <FiLogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
                <p className="text-blue-100 mt-2 max-w-2xl">
                  You've spent {Math.floor(stats.timeSpent / 60)} hours learning this month. 
                  Keep up the momentum to achieve your goals!
                </p>
                <div className="flex items-center mt-4 space-x-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    🎯 {stats.accuracy.toFixed(1)}% Accuracy
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    🔥 {stats.streak} Day Streak
                  </span>
                </div>
              </div>
              <button className="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                Start New Session
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mb-6">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </main>

      {/* Floating Action Button (Mobile) */}
      <button className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-lg flex items-center justify-center">
        <FiPlay className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Dashboard;