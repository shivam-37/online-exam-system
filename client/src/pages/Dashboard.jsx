import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { examAPI, reportAPI, userAPI } from '../services/api';
import { getUser } from '../utils/auth';
import { 
  FiBook, FiBarChart2, FiCheckCircle,
  FiAlertTriangle, FiAward, FiUsers, FiFileText,
  FiVideo, FiBell, FiGrid, FiActivity,
  FiZap, FiPlay, FiChevronRight,
  FiSearch, FiFilter, FiDownload, FiEye,
  FiRefreshCw, FiRotateCw, FiTarget
} from 'react-icons/fi';
import { 
  HiOutlineSparkles, 
  HiOutlineFire, 
  HiOutlineAcademicCap,
  HiOutlineDocumentReport,
  HiOutlineCalendar,
  HiOutlineClock
} from 'react-icons/hi';
import { MdOutlineLeaderboard } from 'react-icons/md';
import { VscGraph } from 'react-icons/vsc';

// Import Feature Components
import LiveProctoringTab from '../components/dashboard/LiveProctoringTab';
import AIInsightsTab from '../components/dashboard/AIInsightsTab';
import PracticeTestsTab from '../components/dashboard/PracticeTestsTab';
import LeaderboardTab from '../components/dashboard/LeaderboardTab';
import ExamSimulatorTab from '../components/dashboard/ExamSimulatorTab';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(getUser());
  const [exams, setExams] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('week');

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
    focusTime: 0,
    productivity: 0,
    completionRate: 0,
  });

  // Role-based dashboard tabs
  const getTabsByRole = () => {
    const role = user?.role || 'student';
    
    const tabConfig = {
      student: [
        { id: 'overview', label: 'Overview', icon: FiGrid, color: 'from-blue-500 to-cyan-400' },
        { id: 'proctoring', label: 'Live Proctoring', icon: FiVideo, badge: 'LIVE', color: 'from-purple-500 to-pink-500' },
        { id: 'insights', label: 'AI Insights', icon: HiOutlineSparkles, badge: 'AI', color: 'from-amber-500 to-orange-400' },
        { id: 'practice', label: 'Practice Tests', icon: FiTarget, color: 'from-emerald-500 to-green-400' },
        { id: 'leaderboard', label: 'Leaderboard', icon: MdOutlineLeaderboard, color: 'from-violet-500 to-purple-400' },
        { id: 'simulator', label: 'Exam Simulator', icon: FiZap, badge: 'BETA', color: 'from-rose-500 to-pink-400' },
      ],
      teacher: [
        { id: 'overview', label: 'Overview', icon: FiGrid, color: 'from-emerald-500 to-green-400' },
        { id: 'exams', label: 'My Exams', icon: FiBook, color: 'from-blue-500 to-cyan-400' },
        { id: 'proctoring', label: 'Proctoring', icon: FiVideo, badge: 'LIVE', color: 'from-purple-500 to-pink-500' },
        { id: 'students', label: 'Students', icon: FiUsers, color: 'from-amber-500 to-orange-400' },
        { id: 'analytics', label: 'Analytics', icon: VscGraph, color: 'from-violet-500 to-purple-400' },
      ],
      admin: [
        { id: 'overview', label: 'Overview', icon: FiGrid, color: 'from-purple-500 to-pink-400' },
        { id: 'users', label: 'Users', icon: FiUsers, color: 'from-blue-500 to-cyan-400' },
        { id: 'exams', label: 'Exams', icon: FiBook, color: 'from-emerald-500 to-green-400' },
        { id: 'proctoring', label: 'Proctoring', icon: FiVideo, badge: 'LIVE', color: 'from-amber-500 to-orange-400' },
        { id: 'reports', label: 'Reports', icon: FiBarChart2, color: 'from-violet-500 to-purple-400' },
        { id: 'settings', label: 'Settings', icon: FiGrid, color: 'from-gray-500 to-gray-400' },
      ]
    };

    return tabConfig[role] || tabConfig.student;
  };

  const tabs = getTabsByRole();
  const userRole = user?.role || 'student';

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [examsRes, reportsRes, notificationsRes] = await Promise.all([
        examAPI.getExams(),
        reportAPI.getMyReports(),
        userAPI.getNotifications(),
      ]);

      setExams(examsRes.data);
      setReports(reportsRes.data);
      setNotifications(notificationsRes.data);

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
      const focusTime = Math.floor(timeSpent * 0.85);
      const productivity = Math.min(accuracy * 1.5, 100);
      const completionRate = reportsRes.data.length > 0 ? (attemptedExams / examsRes.data.length) * 100 : 0;
      
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
        focusTime,
        productivity,
        completionRate,
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'proctoring':
        return <LiveProctoringTab userId={user?._id} role={userRole} />;
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
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">
                  Welcome back, {user?.name}! 👋
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userRole === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                  userRole === 'teacher' ? 'bg-emerald-500/20 text-emerald-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              </div>
              <p className="text-gray-300 mt-2">
                {userRole === 'admin' ? 'Manage your platform, users, and exams' :
                 userRole === 'teacher' ? 'Monitor your students and create exams' :
                 'Here\'s your learning progress and upcoming activities'}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {userRole === 'student' && (
                  <>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                      🎯 {stats.accuracy.toFixed(1)}% Accuracy
                    </span>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                      🔥 {stats.streak} Day Streak
                    </span>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                      ⚡ {stats.productivity.toFixed(0)}% Productivity
                    </span>
                  </>
                )}
                {userRole === 'teacher' && (
                  <>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                      👥 {Math.floor(Math.random() * 50) + 20} Active Students
                    </span>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                      📝 {exams.length} Created Exams
                    </span>
                  </>
                )}
                {userRole === 'admin' && (
                  <>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                      👥 {Math.floor(Math.random() * 500) + 200} Total Users
                    </span>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                      📊 {exams.length} Active Exams
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <button 
                onClick={() => {
                  if (userRole === 'student') navigate('/practice');
                  else if (userRole === 'teacher') navigate('/teacher/exams/create');
                  else navigate('/admin/exams');
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center"
              >
                <FiPlay className="mr-2" />
                {userRole === 'student' ? 'Start Practice' :
                 userRole === 'teacher' ? 'Create Exam' :
                 'Manage Exams'}
              </button>
            </div>
          </div>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid - Role Based */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userRole === 'student' && (
          <>
            {/* Student Stats */}
            <StatCard
              title="Average Score"
              value={`${stats.averageScore.toFixed(1)}%`}
              trend="+12.5%"
              icon={FiBarChart2}
              color="blue"
              progress={stats.percentile}
            />
            <StatCard
              title="Accuracy Rate"
              value={`${stats.accuracy.toFixed(1)}%`}
              badge={stats.accuracy >= 80 ? 'Excellent' : stats.accuracy >= 60 ? 'Good' : 'Needs Work'}
              icon={FiTarget}
              color="emerald"
              progress={stats.accuracy}
              target={90}
            />
            <StatCard
              title="Study Time"
              value={`${Math.floor(stats.timeSpent / 60)}h ${stats.timeSpent % 60}m`}
              badge={stats.focusTime > 120 ? 'High Focus' : 'Medium Focus'}
              icon={HiOutlineClock}
              color="amber"
              progress={(stats.focusTime / stats.timeSpent) * 100}
              subValue={`${Math.floor(stats.focusTime / 60)}h ${stats.focusTime % 60}m focus`}
            />
            <StatCard
              title="Global Rank"
              value={`#${stats.rank}`}
              badge={`Top ${stats.percentile}%`}
              icon={FiAward}
              color="purple"
              progress={100 - stats.rank}
              subValue={`↑ #${stats.rank + 5} last week`}
            />
          </>
        )}

        {userRole === 'teacher' && (
          <>
            {/* Teacher Stats */}
            <StatCard
              title="Total Students"
              value={Math.floor(Math.random() * 50) + 20}
              trend="+12%"
              icon={FiUsers}
              color="emerald"
              progress={75}
            />
            <StatCard
              title="Active Exams"
              value={exams.length}
              badge={`${exams.filter(e => e.status === 'active').length} active`}
              icon={FiBook}
              color="blue"
              progress={65}
            />
            <StatCard
              title="Avg. Score"
              value="78.5%"
              trend="+5.2%"
              icon={FiBarChart2}
              color="amber"
              progress={78.5}
            />
            <StatCard
              title="Completion Rate"
              value="82%"
              badge="Good"
              icon={FiCheckCircle}
              color="purple"
              progress={82}
            />
          </>
        )}

        {userRole === 'admin' && (
          <>
            {/* Admin Stats */}
            <StatCard
              title="Total Users"
              value="1,234"
              trend="+56"
              icon={FiUsers}
              color="purple"
              progress={65}
            />
            <StatCard
              title="Active Exams"
              value="45"
              badge="12 today"
              icon={FiBook}
              color="blue"
              progress={45}
            />
            <StatCard
              title="Revenue"
              value="$12.5k"
              trend="+8.2%"
              icon={FiBarChart2}
              color="emerald"
              progress={75}
            />
            <StatCard
              title="System Health"
              value="98%"
              badge="Stable"
              icon={FiActivity}
              color="amber"
              progress={98}
            />
          </>
        )}
      </div>

      {/* Main Content Grid - Role Based */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {userRole === 'student' && (
            <>
              {/* Student: Upcoming Exams */}
              <UpcomingExams exams={getUpcomingExams()} />
              {/* Student: Performance Analytics */}
              <PerformanceAnalytics 
                timeFilter={timeFilter} 
                setTimeFilter={setTimeFilter}
                stats={stats}
              />
            </>
          )}

          {userRole === 'teacher' && (
            <>
              {/* Teacher: Recent Activity */}
              <TeacherActivity />
              {/* Teacher: Student Performance */}
              <StudentPerformance />
            </>
          )}

          {userRole === 'admin' && (
            <>
              {/* Admin: System Overview */}
              <SystemOverview />
              {/* Admin: Recent Users */}
              <RecentUsers />
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {userRole === 'student' && (
            <>
              <QuickStats stats={stats} />
              <QuickActions role={userRole} />
              <RecentActivity reports={getRecentReports()} />
            </>
          )}

          {userRole === 'teacher' && (
            <>
              <TeacherQuickActions />
              <PendingReviews />
              <UpcomingProctorSessions />
            </>
          )}

          {userRole === 'admin' && (
            <>
              <AdminQuickActions />
              <SystemAlerts />
              <RecentRegistrations />
            </>
          )}
        </div>
      </div>

      {/* Recent Exams Table - Student Only */}
      {userRole === 'student' && (
        <RecentExamsTable 
          reports={getRecentReports()} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-1">Preparing your personalized insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto pb-1 space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center px-4 py-2.5 rounded-t-lg font-medium text-sm whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-sm`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
              {tab.badge && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-700'
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
  );
};

// Sub-components
const StatCard = ({ title, value, trend, badge, icon: Icon, color, progress, target, subValue }) => (
  <div className={`bg-white rounded-2xl p-6 border border-gray-100 hover:border-${color}-200 transition-all duration-300 hover:shadow-lg hover:shadow-${color}-100/50`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-50`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
      {trend && (
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-600">
          {trend}
        </span>
      )}
      {badge && !trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${color}-50 text-${color}-600`}>
          {badge}
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    <p className="text-gray-600 text-sm mt-1">{title}</p>
    {progress !== undefined && (
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>{target ? `Target: ${target}%` : 'Progress'}</span>
          <span className="text-gray-700">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div 
            className={`bg-gradient-to-r from-${color}-500 to-${color}-400 h-2 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {subValue && (
          <p className="text-xs text-gray-500 mt-2">{subValue}</p>
        )}
      </div>
    )}
  </div>
);

const UpcomingExams = ({ exams }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Upcoming Exams</h2>
        <p className="text-gray-600 text-sm mt-1">Your scheduled attempts</p>
      </div>
      <Link 
        to="/exams" 
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center transition-colors"
      >
        View All <FiChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
    
    <div className="space-y-4">
      {exams.length > 0 ? exams.map((exam) => (
        <div key={exam._id} className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${
                exam.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                exam.difficulty === 'Hard' ? 'bg-rose-100 text-rose-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                <HiOutlineAcademicCap className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {exam.title}
                </h3>
                <div className="flex items-center mt-1 space-x-3">
                  <span className="text-sm text-gray-600">{exam.subject}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{exam.duration || 60} min</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700 mb-2">
                {new Date(exam.startDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg text-sm font-medium transition-all duration-300">
                Prepare Now
              </button>
            </div>
          </div>
        </div>
      )) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No upcoming exams</p>
          <Link to="/practice" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
            Start practicing →
          </Link>
        </div>
      )}
    </div>
  </div>
);

const PerformanceAnalytics = ({ timeFilter, setTimeFilter, stats }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Performance Analytics</h2>
        <p className="text-gray-600 text-sm mt-1">Your progress over time</p>
      </div>
      <select 
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="week">Last 7 days</option>
        <option value="month">Last 30 days</option>
        <option value="quarter">Last 3 months</option>
        <option value="year">Last year</option>
      </select>
    </div>
    
    <div className="h-72 flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4">
      <div className="w-full h-48 flex items-end justify-center space-x-4 mb-6">
        {[65, 72, 68, 85, 78, 82, 90].map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="w-8 rounded-t-lg bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-300 hover:opacity-80 cursor-pointer"
              style={{ height: `${value}%` }}
              title={`Score: ${value}%`}
            ></div>
            <span className="text-xs text-gray-600 mt-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mr-2"></div>
          <span className="text-sm text-gray-600">Score Trend</span>
        </div>
      </div>
    </div>
  </div>
);

const QuickStats = ({ stats }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
    <div className="space-y-4">
      {[
        { icon: FiBook, label: 'Total Exams', value: stats.totalExams, color: 'blue', progress: stats.completionRate },
        { icon: FiCheckCircle, label: 'Passed', value: stats.passedExams, color: 'emerald', progress: (stats.passedExams / stats.attemptedExams) * 100 },
        { icon: HiOutlineFire, label: 'Streak', value: stats.streak, color: 'amber', progress: Math.min(stats.streak * 10, 100) },
        { icon: FiAward, label: 'Rank', value: `#${stats.rank}`, color: 'purple', progress: stats.percentile },
      ].map((stat, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 bg-${stat.color}-100`}>
              <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
          <div className="w-16">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-400 h-1.5 rounded-full`}
                style={{ width: `${stat.progress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuickActions = ({ role }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
    <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
    <div className="grid grid-cols-2 gap-3">
      <button className="group p-4 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-105 border border-gray-100">
        <FiPlay className="h-6 w-6 text-blue-600 mx-auto mb-2 group-hover:text-blue-700" />
        <span className="text-xs text-gray-700 group-hover:text-gray-900">Start Test</span>
      </button>
      <Link to="/reports" className="group p-4 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-105 text-center border border-gray-100">
        <HiOutlineDocumentReport className="h-6 w-6 text-emerald-600 mx-auto mb-2 group-hover:text-emerald-700" />
        <span className="text-xs text-gray-700 group-hover:text-gray-900">View Reports</span>
      </Link>
      <Link to="/practice" className="group p-4 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-105 text-center border border-gray-100">
        <FiTarget className="h-6 w-6 text-amber-600 mx-auto mb-2 group-hover:text-amber-700" />
        <span className="text-xs text-gray-700 group-hover:text-gray-900">Practice</span>
      </Link>
      <Link to="/leaderboard" className="group p-4 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-105 text-center border border-gray-100">
        <MdOutlineLeaderboard className="h-6 w-6 text-purple-600 mx-auto mb-2 group-hover:text-purple-700" />
        <span className="text-xs text-gray-700 group-hover:text-gray-900">Leaderboard</span>
      </Link>
    </div>
  </div>
);

const RecentActivity = ({ reports }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-gray-900">Recent Activity</h3>
      <FiBell className="text-gray-500" />
    </div>
    <div className="space-y-3">
      {reports.length > 0 ? reports.map((report, index) => (
        <div key={index} className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
          <div className={`p-2 rounded-lg mr-3 ${
            report.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {report.passed ? <FiCheckCircle /> : <FiAlertTriangle />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {report.exam?.title}
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-600">
                Score: <span className={report.passed ? 'text-emerald-600' : 'text-rose-600'}>
                  {report.percentage?.toFixed(1)}%
                </span>
              </p>
              <p className="text-xs text-gray-500">
                {new Date(report.completedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )) : (
        <p className="text-center text-gray-500 py-4">No recent activity</p>
      )}
    </div>
  </div>
);

const RecentExamsTable = ({ reports, searchQuery, setSearchQuery }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Recent Exams</h2>
        <p className="text-gray-600 text-sm mt-1">Your latest attempts and results</p>
      </div>
      <div className="flex space-x-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Search exams..."
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <FiFilter className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 text-sm font-medium text-gray-600">Exam</th>
            <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
            <th className="text-left py-3 text-sm font-medium text-gray-600">Score</th>
            <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
            <th className="text-left py-3 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? reports.map((report) => (
            <tr key={report._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    report.percentage >= 70 ? 'bg-emerald-100' :
                    report.percentage >= 50 ? 'bg-amber-100' : 'bg-rose-100'
                  }`}>
                    <FiFileText className={`${
                      report.percentage >= 70 ? 'text-emerald-700' :
                      report.percentage >= 50 ? 'text-amber-700' : 'text-rose-700'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.exam?.title}</p>
                    <p className="text-sm text-gray-600">{report.exam?.subject}</p>
                  </div>
                </div>
              </td>
              <td className="py-4">
                <p className="text-sm text-gray-700">
                  {new Date(report.completedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(report.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </td>
              <td className="py-4">
                <div className={`text-lg font-bold ${
                  report.percentage >= 70 ? 'text-emerald-700' :
                  report.percentage >= 50 ? 'text-amber-700' : 'text-rose-700'
                }`}>
                  {report.percentage?.toFixed(1)}%
                </div>
              </td>
              <td className="py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  report.passed 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {report.passed ? 'Passed' : 'Failed'}
                </span>
              </td>
              <td className="py-4">
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="View Details">
                    <FiEye className="h-4 w-4 text-gray-600 hover:text-gray-900" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Download Report">
                    <FiDownload className="h-4 w-4 text-gray-600 hover:text-gray-900" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Retake Exam">
                    <FiRotateCw className="h-4 w-4 text-gray-600 hover:text-gray-900" />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="py-8 text-center text-gray-500">
                No exam attempts yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// Teacher-specific components
const TeacherActivity = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Student Activity</h2>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-700 font-semibold">S{i}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Student {i}</p>
              <p className="text-xs text-gray-600">Completed: Mathematics Exam</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">2 min ago</span>
        </div>
      ))}
    </div>
  </div>
);

const StudentPerformance = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Class Performance</h2>
    <div className="space-y-3">
      {['Mathematics', 'Physics', 'Chemistry'].map((subject) => (
        <div key={subject} className="flex items-center justify-between">
          <span className="text-sm text-gray-700">{subject}</span>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-900">78%</span>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TeacherQuickActions = () => (
  <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100">
    <h3 className="font-bold text-gray-900 mb-4">Teacher Actions</h3>
    <div className="grid grid-cols-2 gap-3">
      <Link to="/teacher/exams/create" className="group p-4 bg-white hover:bg-emerald-50 rounded-xl transition-all border border-emerald-100">
        <FiFileText className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
        <span className="text-xs text-gray-700">Create Exam</span>
      </Link>
      <Link to="/teacher/proctoring" className="group p-4 bg-white hover:bg-emerald-50 rounded-xl transition-all border border-emerald-100">
        <FiVideo className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
        <span className="text-xs text-gray-700">Proctoring</span>
      </Link>
      <Link to="/teacher/students" className="group p-4 bg-white hover:bg-emerald-50 rounded-xl transition-all border border-emerald-100">
        <FiUsers className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
        <span className="text-xs text-gray-700">Students</span>
      </Link>
      <Link to="/teacher/analytics" className="group p-4 bg-white hover:bg-emerald-50 rounded-xl transition-all border border-emerald-100">
        <VscGraph className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
        <span className="text-xs text-gray-700">Analytics</span>
      </Link>
    </div>
  </div>
);

const PendingReviews = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-gray-900">Pending Reviews</h3>
      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">3</span>
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">Exam Review #{i}</p>
            <p className="text-xs text-gray-600">Submitted 5 min ago</p>
          </div>
          <button className="text-xs text-emerald-600 hover:text-emerald-700">Review</button>
        </div>
      ))}
    </div>
  </div>
);

const UpcomingProctorSessions = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <h3 className="font-bold text-gray-900 mb-4">Upcoming Proctoring</h3>
    <div className="space-y-3">
      <div className="p-3 bg-purple-50 rounded-lg">
        <p className="text-sm font-medium text-gray-900">Mathematics Final</p>
        <p className="text-xs text-gray-600 mt-1">Today, 2:00 PM • 15 students</p>
      </div>
      <div className="p-3 bg-purple-50 rounded-lg">
        <p className="text-sm font-medium text-gray-900">Physics Mid-term</p>
        <p className="text-xs text-gray-600 mt-1">Tomorrow, 10:00 AM • 12 students</p>
      </div>
    </div>
  </div>
);

// Admin-specific components
const SystemOverview = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <h2 className="text-xl font-bold text-gray-900 mb-4">System Overview</h2>
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-purple-50 rounded-xl">
        <p className="text-2xl font-bold text-purple-700">98%</p>
        <p className="text-xs text-gray-600 mt-1">Uptime</p>
      </div>
      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="text-2xl font-bold text-blue-700">45</p>
        <p className="text-xs text-gray-600 mt-1">Active Exams</p>
      </div>
      <div className="p-4 bg-emerald-50 rounded-xl">
        <p className="text-2xl font-bold text-emerald-700">1.2k</p>
        <p className="text-xs text-gray-600 mt-1">Today's Users</p>
      </div>
      <div className="p-4 bg-amber-50 rounded-xl">
        <p className="text-2xl font-bold text-amber-700">12</p>
        <p className="text-xs text-gray-600 mt-1">Support Tickets</p>
      </div>
    </div>
  </div>
);

const RecentUsers = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Registrations</h2>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-700 text-sm">U{i}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">User {i}</p>
              <p className="text-xs text-gray-600">user{i}@example.com</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">2 min ago</span>
        </div>
      ))}
    </div>
  </div>
);

const AdminQuickActions = () => (
  <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
    <h3 className="font-bold text-gray-900 mb-4">Admin Actions</h3>
    <div className="grid grid-cols-2 gap-3">
      <Link to="/admin/users" className="group p-4 bg-white hover:bg-purple-50 rounded-xl transition-all border border-purple-100">
        <FiUsers className="h-6 w-6 text-purple-600 mx-auto mb-2" />
        <span className="text-xs text-gray-700">Manage Users</span>
      </Link>
      <Link to="/admin/exams" className="group p-4 bg-white hover:bg-purple-50 rounded-xl transition-all border border-purple-100">
        <FiBook className="h-6 w-6 text-purple-600 mx-auto mb-2" />
        <span className="text-xs text-gray-700">Manage Exams</span>
      </Link>
      <Link to="/admin/reports" className="group p-4 bg-white hover:bg-purple-50 rounded-xl transition-all border border-purple-100">
        <FiBarChart2 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
        <span className="text-xs text-gray-700">Reports</span>
      </Link>
      <Link to="/admin/settings" className="group p-4 bg-white hover:bg-purple-50 rounded-xl transition-all border border-purple-100">
        <FiSettings className="h-6 w-6 text-purple-600 mx-auto mb-2" />
        <span className="text-xs text-gray-700">Settings</span>
      </Link>
    </div>
  </div>
);

const SystemAlerts = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <h3 className="font-bold text-gray-900 mb-4">System Alerts</h3>
    <div className="space-y-2">
      <div className="p-3 bg-amber-50 text-amber-700 rounded-lg text-sm">
        ⚠️ Server load high (78%)
      </div>
      <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
        ✅ Backup completed successfully
      </div>
    </div>
  </div>
);

const RecentRegistrations = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <h3 className="font-bold text-gray-900 mb-4">New Registrations</h3>
    <div className="space-y-2">
      <p className="text-sm text-gray-600">+24 users today</p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
      </div>
      <p className="text-xs text-gray-500">12% increase from yesterday</p>
    </div>
  </div>
);

export default Dashboard;