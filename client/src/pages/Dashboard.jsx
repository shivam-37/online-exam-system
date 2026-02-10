import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examAPI, reportAPI, userAPI } from '../services/api';
import { getUser } from '../utils/auth';
import { 
  FiClock, FiBook, FiBarChart2, FiCalendar, FiCheckCircle,
  FiAlertTriangle, FiTrendingUp, FiAward, FiUsers, FiFileText,
  FiVideo, FiShield, FiBell, FiStar, FiGrid, FiActivity,
  FiZap, FiPlay, FiPieChart, FiChevronRight,
  FiSearch, FiFilter, FiMoreVertical, FiDownload, FiEye,
  FiRefreshCw, FiSettings, FiLogOut, FiHelpCircle, FiArrowUpRight,
  FiEyeOff, FiRotateCw, FiTarget, FiUserCheck
} from 'react-icons/fi';
import { 
  HiOutlineSparkles, 
  HiOutlineFire, 
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineChartPie,
  HiOutlineUserGroup,
  HiOutlineDocumentReport,
  HiOutlineCalendar,
  HiOutlineClock
} from 'react-icons/hi';
import { 
  TbChartLine, 
  TbChartArcs, 
  TbChartArea,
  TbChartInfographic,
  TbChartCandle,
  TbChartBubble
} from 'react-icons/tb';
import { MdOutlineLeaderboard, MdOutlineSimCardDownload } from 'react-icons/md';
import { VscGraph } from 'react-icons/vsc';

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiGrid, color: 'from-blue-500 to-cyan-400' },
    { id: 'proctoring', label: 'Live Proctoring', icon: FiVideo, badge: 'LIVE', color: 'from-purple-500 to-pink-500' },
    { id: 'insights', label: 'AI Insights', icon: HiOutlineSparkles, badge: 'AI', color: 'from-amber-500 to-orange-400' },
    { id: 'practice', label: 'Practice Tests', icon: FiTarget, color: 'from-emerald-500 to-green-400' },
    { id: 'leaderboard', label: 'Leaderboard', icon: MdOutlineLeaderboard, color: 'from-violet-500 to-purple-400' },
    { id: 'simulator', label: 'Exam Simulator', icon: FiZap, badge: 'BETA', color: 'from-rose-500 to-pink-400' },
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
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}! 👋</h1>
              <p className="text-gray-300 mt-2">
                Here's your learning progress and upcoming activities for today
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                  🎯 {stats.accuracy.toFixed(1)}% Accuracy
                </span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                  🔥 {stats.streak} Day Streak
                </span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white">
                  ⚡ {stats.productivity.toFixed(0)}% Productivity
                </span>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center">
                <FiPlay className="mr-2" />
                Start New Session
              </button>
            </div>
          </div>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Performance Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20">
              <FiBarChart2 className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400">
              +12.5%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.averageScore.toFixed(1)}%</h3>
          <p className="text-gray-400 text-sm mt-1">Average Score</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span>
              <span>{stats.percentile}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentile}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-400/20">
              <FiTarget className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
              {stats.accuracy >= 80 ? 'Excellent' : stats.accuracy >= 60 ? 'Good' : 'Needs Work'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.accuracy.toFixed(1)}%</h3>
          <p className="text-gray-400 text-sm mt-1">Accuracy Rate</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Target: 90%</span>
              <span>{Math.max(0, 90 - stats.accuracy).toFixed(1)}% to go</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full"
                style={{ width: `${stats.accuracy}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Time Investment Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-400/20">
              <HiOutlineClock className="h-6 w-6 text-amber-400" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/10 text-amber-400">
              {stats.focusTime > 120 ? 'High Focus' : 'Medium Focus'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white">{Math.floor(stats.timeSpent / 60)}h {stats.timeSpent % 60}m</h3>
          <p className="text-gray-400 text-sm mt-1">Total Study Time</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Focus Time</span>
              <span>{Math.floor(stats.focusTime / 60)}h {stats.focusTime % 60}m</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-400 h-2 rounded-full"
                style={{ width: `${(stats.focusTime / stats.timeSpent) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Ranking Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-400/20">
              <FiAward className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">
              Top {stats.percentile}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white">#{stats.rank}</h3>
          <p className="text-gray-400 text-sm mt-1">Global Rank</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Last Week</span>
              <span className="text-green-400">↑ #{stats.rank + 5}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full"
                style={{ width: `${100 - stats.rank}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upcoming Exams & Performance */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Exams */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Upcoming Exams</h2>
                <p className="text-gray-400 text-sm mt-1">Your scheduled attempts</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                  <HiOutlineCalendar className="h-5 w-5 text-gray-400" />
                </button>
                <Link 
                  to="/exams" 
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-300 flex items-center transition-colors"
                >
                  View All <FiChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              {getUpcomingExams().map((exam, index) => (
                <div 
                  key={exam._id} 
                  className="group bg-gray-700/30 hover:bg-gray-700/50 rounded-xl p-4 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className={`p-3 rounded-xl ${
                          exam.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                          exam.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          <HiOutlineAcademicCap className="h-6 w-6" />
                        </div>
                        {exam.isProctored && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <FiEye className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {exam.title}
                        </h3>
                        <div className="flex items-center mt-1 space-x-3">
                          <span className="text-sm text-gray-400">{exam.subject}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-400">{exam.duration || 60} min</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            exam.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                            exam.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400' :
                            'bg-amber-500/10 text-amber-400'
                          }`}>
                            {exam.difficulty || 'Medium'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-300 mb-2">
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
              ))}
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Performance Analytics</h2>
                <p className="text-gray-400 text-sm mt-1">Your progress over time</p>
              </div>
              <div className="flex items-center space-x-2">
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="quarter">Last 3 months</option>
                  <option value="year">Last year</option>
                </select>
              </div>
            </div>
            
            <div className="h-72 flex flex-col items-center justify-center bg-gray-900/30 rounded-xl p-4">
              <div className="w-full h-48 flex items-end justify-center space-x-4 mb-6">
                {/* Mock chart bars */}
                {[65, 72, 68, 85, 78, 82, 90].map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-8 rounded-t-lg bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-300 hover:opacity-80 cursor-pointer"
                      style={{ height: `${value}%` }}
                      title={`Score: ${value}%`}
                    ></div>
                    <span className="text-xs text-gray-400 mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mr-2"></div>
                  <span className="text-sm text-gray-400">Score Trend</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 mr-2"></div>
                  <span className="text-sm text-gray-400">Accuracy</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 mr-2"></div>
                  <span className="text-sm text-gray-400">Time Spent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Stats & Actions */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {[
                { icon: FiBook, label: 'Total Exams', value: stats.totalExams, color: 'blue', progress: stats.completionRate },
                { icon: FiCheckCircle, label: 'Passed', value: stats.passedExams, color: 'emerald', progress: (stats.passedExams / stats.attemptedExams) * 100 },
                { icon: HiOutlineFire, label: 'Streak', value: stats.streak, color: 'amber', progress: Math.min(stats.streak * 10, 100) },
                { icon: FiUsers, label: 'Rank', value: `#${stats.rank}`, color: 'purple', progress: stats.percentile },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 bg-${stat.color}-500/20`}>
                      <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="font-semibold text-white">{stat.value}</p>
                    </div>
                  </div>
                  <div className="w-16">
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className={`bg-gradient-to-r from-${stat.color}-500 to-${stat.color === 'blue' ? 'cyan-400' : stat.color === 'emerald' ? 'green-400' : stat.color === 'amber' ? 'orange-400' : 'pink-400'} h-1.5 rounded-full`}
                        style={{ width: `${stat.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50">
            <h3 className="font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="group p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-105">
                <FiPlay className="h-6 w-6 text-blue-400 mx-auto mb-2 group-hover:text-blue-300" />
                <span className="text-xs text-gray-300 group-hover:text-white">Start Test</span>
              </button>
              <Link to="/reports" className="group p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-105 text-center">
                <HiOutlineDocumentReport className="h-6 w-6 text-emerald-400 mx-auto mb-2 group-hover:text-emerald-300" />
                <span className="text-xs text-gray-300 group-hover:text-white">View Reports</span>
              </Link>
              <button className="group p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-105">
                <FiDownload className="h-6 w-6 text-amber-400 mx-auto mb-2 group-hover:text-amber-300" />
                <span className="text-xs text-gray-300 group-hover:text-white">Download</span>
              </button>
              <Link to="/analytics" className="group p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-105 text-center">
                <VscGraph className="h-6 w-6 text-purple-400 mx-auto mb-2 group-hover:text-purple-300" />
                <span className="text-xs text-gray-300 group-hover:text-white">Analytics</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Recent Activity</h3>
              <FiBell className="text-gray-400" />
            </div>
            <div className="space-y-3">
              {getRecentReports().slice(0, 3).map((report, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
                  <div className={`p-2 rounded-lg mr-3 ${
                    report.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {report.passed ? <FiCheckCircle /> : <FiAlertTriangle />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {report.exam?.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-400">
                        Score: <span className={report.passed ? 'text-emerald-400' : 'text-rose-400'}>
                          {report.percentage?.toFixed(1)}%
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Exams Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Recent Exams</h2>
            <p className="text-gray-400 text-sm mt-1">Your latest attempts and results</p>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search exams..."
                className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 text-sm font-medium text-gray-400">Exam</th>
                <th className="text-left py-3 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-3 text-sm font-medium text-gray-400">Score</th>
                <th className="text-left py-3 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getRecentReports().map((report) => (
                <tr key={report._id} className="border-b border-gray-800 hover:bg-gray-700/30 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        report.percentage >= 70 ? 'bg-emerald-500/20' :
                        report.percentage >= 50 ? 'bg-amber-500/20' : 'bg-rose-500/20'
                      }`}>
                        <FiFileText className={`${
                          report.percentage >= 70 ? 'text-emerald-400' :
                          report.percentage >= 50 ? 'text-amber-400' : 'text-rose-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{report.exam?.title}</p>
                        <p className="text-sm text-gray-400">{report.exam?.subject}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-gray-300">
                      {new Date(report.completedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(report.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className={`text-lg font-bold ${
                        report.percentage >= 70 ? 'text-emerald-400' :
                        report.percentage >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {report.percentage?.toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.passed 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {report.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="View Details">
                        <FiEye className="h-4 w-4 text-gray-400 hover:text-white" />
                      </button>
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Download Report">
                        <FiDownload className="h-4 w-4 text-gray-400 hover:text-white" />
                      </button>
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Retake Exam">
                        <FiRotateCw className="h-4 w-4 text-gray-400 hover:text-white" />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-300 font-medium">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-1">Preparing your learning insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
                  <HiOutlineAcademicCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">SageExam</h1>
                  <p className="text-xs text-gray-400">Intelligent Learning Platform</p>
                </div>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex ml-12 space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                    {tab.badge && (
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-500/10 text-blue-400'
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
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 w-64 focus:w-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <FiBell className="h-5 w-5 text-gray-400 hover:text-white" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Refresh */}
              <button 
                onClick={fetchDashboardData}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Refresh Dashboard"
              >
                <FiRefreshCw className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-400 capitalize">{user?.role || 'Student'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Navigation */}
        <div className="md:hidden mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
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
      <Link 
        to="/exams" 
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all duration-300"
      >
        <FiPlay className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default Dashboard;