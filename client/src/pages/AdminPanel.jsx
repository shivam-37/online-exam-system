// pages/AdminPanel.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useExams, useAllReports, useUsers } from '../hooks/useApi';
import {
  FiChevronRight, FiEye, FiCheckCircle, FiXCircle,
  FiUsers, FiBook, FiBarChart2, FiSettings,
  FiAlertCircle, FiFileText, FiUserCheck, FiPercent
} from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, subtitle, color, link }) => {
  const colorMap = {
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'hover:border-purple-500/50' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'hover:border-blue-500/50' },
    green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'hover:border-emerald-500/50' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'hover:border-amber-500/50' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'hover:border-red-500/50' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'hover:border-pink-500/50' },
  };
  const c = colorMap[color] || colorMap.purple;

  const Wrapper = link ? Link : 'div';
  const wrapperProps = link ? { to: link } : {};

  return (
    <Wrapper {...wrapperProps} className={`bg-gray-900 rounded-xl p-6 border border-gray-800 ${c.border} transition-all group`}>
      <div className="flex justify-between items-start mb-3">
        <div className={`p-3 rounded-lg ${c.bg} ${c.text} group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6" />
        </div>
        {link && <FiChevronRight className="text-gray-600 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <p className="text-gray-400 font-medium">{label}</p>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </Wrapper>
  );
};

const AdminPanel = () => {
  const { exams = [], loading: examsLoading, error: examsError } = useExams();
  const { reports = [], loading: reportsLoading, error: reportsError } = useAllReports();
  const { users = [], loading: usersLoading, error: usersError } = useUsers();

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalExams = exams.length;
    const totalAttempts = reports.length;

    const students = users.filter(u => u.role === 'student').length;
    const teachers = users.filter(u => u.role === 'teacher').length;
    const admins = users.filter(u => u.role === 'admin').length;

    const activeExams = exams.filter(e => e.isActive).length;
    const passedReports = reports.filter(r => r.passed).length;
    const passRate = totalAttempts > 0 ? ((passedReports / totalAttempts) * 100).toFixed(1) : '0.0';
    const avgScore = totalAttempts > 0
      ? (reports.reduce((acc, r) => acc + (r.percentage || 0), 0) / totalAttempts).toFixed(1)
      : '0.0';

    const today = new Date().toDateString();
    const attemptsToday = reports.filter(r =>
      r.completedAt && new Date(r.completedAt).toDateString() === today
    ).length;

    return {
      totalUsers, totalExams, totalAttempts, students, teachers, admins,
      activeExams, passRate, avgScore, attemptsToday, passedReports
    };
  }, [exams, reports, users]);

  const loading = examsLoading || reportsLoading || usersLoading;
  const hasError = examsError || reportsError || usersError;

  if (loading) {
    return (
      <div className="bg-black min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Loading admin dashboard...</p>
          <p className="text-sm text-gray-600 mt-2">Fetching data from database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-[calc(100vh-4rem)] w-full">
      <div className="space-y-8">

        {/* Error Banner */}
        {hasError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3">
            <FiAlertCircle className="text-red-400 h-5 w-5 flex-shrink-0" />
            <p className="text-red-400 text-sm">
              Some data failed to load: {examsError || reportsError || usersError}
            </p>
          </div>
        )}

        {/* Primary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FiUsers} label="Total Users" value={stats.totalUsers} color="purple"
            subtitle={`${stats.students} students • ${stats.teachers} teachers • ${stats.admins} admins`}
            link="/admin/users"
          />
          <StatCard
            icon={FiBook} label="Total Exams" value={stats.totalExams} color="blue"
            subtitle={`${stats.activeExams} active • ${stats.totalExams - stats.activeExams} draft`}
            link="/exams"
          />
          <StatCard
            icon={FiFileText} label="Total Attempts" value={stats.totalAttempts} color="green"
            subtitle={`${stats.attemptsToday} today • ${stats.passedReports} passed`}
            link="/reports"
          />
          <StatCard
            icon={FiPercent} label="Pass Rate" value={`${stats.passRate}%`} color="amber"
            subtitle={`Avg score: ${stats.avgScore}%`}
          />
        </div>

        {/* Recent Exams & Recent Attempts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Exams */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Recent Exams</h2>
                  <p className="text-sm text-gray-500 mt-1">Latest exams in the system</p>
                </div>
                <Link to="/exams" className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center group">
                  View All <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              {exams.length === 0 ? (
                <div className="text-center py-8">
                  <FiBook className="h-10 w-10 mx-auto text-gray-700 mb-3" />
                  <p className="text-gray-500">No exams created yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exams.slice(0, 5).map(exam => (
                    <div key={exam._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all">
                      <div className="flex items-center min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center mr-3 border border-purple-500/20 flex-shrink-0">
                          <FiBook className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-white text-sm truncate">{exam.title}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {exam.subject || 'General'} • {exam.questions?.length || 0} questions • {exam.duration || 60} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-3 flex-shrink-0">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${exam.isActive
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-gray-800 text-gray-400 border-gray-700'
                          }`}>
                          {exam.isActive ? 'Active' : 'Draft'}
                        </span>
                        <Link to={`/exam/${exam._id}`} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg">
                          <FiEye className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                <Link to="/reports" className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center group">
                  View All <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              {reports.length === 0 ? (
                <div className="text-center py-8">
                  <FiFileText className="h-10 w-10 mx-auto text-gray-700 mb-3" />
                  <p className="text-gray-500">No exam attempts yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.slice(0, 5).map(report => (
                    <div key={report._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all">
                      <div className="flex items-center min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 border flex-shrink-0 ${report.passed
                            ? 'bg-green-500/10 border-green-500/20'
                            : 'bg-red-500/10 border-red-500/20'
                          }`}>
                          {report.passed
                            ? <FiCheckCircle className="h-5 w-5 text-green-400" />
                            : <FiXCircle className="h-5 w-5 text-red-400" />
                          }
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-white text-sm truncate">{report.user?.name || 'Anonymous'}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {report.exam?.title || 'Unknown Exam'} • {report.completedAt ? new Date(report.completedAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <div className={`text-lg font-bold ${report.passed ? 'text-green-400' : 'text-red-400'}`}>
                          {report.percentage?.toFixed(1) || 0}%
                        </div>
                        <div className={`text-xs font-medium ${report.passed ? 'text-green-500' : 'text-red-500'}`}>
                          {report.passed ? 'Passed' : 'Failed'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Breakdown Bar */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">User Distribution</h2>
          <div className="flex rounded-full overflow-hidden h-4 bg-gray-800">
            {stats.totalUsers > 0 && (
              <>
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
                  style={{ width: `${(stats.students / stats.totalUsers) * 100}%` }}
                  title={`Students: ${stats.students}`}
                />
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                  style={{ width: `${(stats.teachers / stats.totalUsers) * 100}%` }}
                  title={`Teachers: ${stats.teachers}`}
                />
                <div
                  className="bg-gradient-to-r from-red-500 to-rose-400 transition-all"
                  style={{ width: `${(stats.admins / stats.totalUsers) * 100}%` }}
                  title={`Admins: ${stats.admins}`}
                />
              </>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-400">Students ({stats.students})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-sm text-gray-400">Teachers ({stats.teachers})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm text-gray-400">Admins ({stats.admins})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/users" className="group p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-purple-500 transition-all">
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-4 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all">
                <FiUsers className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-1">Manage Users</h3>
              <p className="text-sm text-gray-500 mb-4">{stats.totalUsers} total users</p>
              <div className="flex items-center text-purple-400 text-sm font-medium">
                Go to Users <FiChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            <Link to="/exams/create" className="group p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-emerald-500 transition-all">
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-4 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                <FiBook className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-1">Create Exam</h3>
              <p className="text-sm text-gray-500 mb-4">{stats.totalExams} exams total</p>
              <div className="flex items-center text-emerald-400 text-sm font-medium">
                Create Now <FiChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            <Link to="/reports" className="group p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-blue-500 transition-all">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-4 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                <FiBarChart2 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-1">View Reports</h3>
              <p className="text-sm text-gray-500 mb-4">{stats.totalAttempts} total attempts</p>
              <div className="flex items-center text-blue-400 text-sm font-medium">
                View Reports <FiChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            <Link to="/admin/settings" className="group p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-pink-500 transition-all">
              <div className="p-3 rounded-lg bg-pink-500/10 text-pink-400 w-fit mb-4 group-hover:bg-pink-500/20 group-hover:scale-110 transition-all">
                <FiSettings className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-1">Settings</h3>
              <p className="text-sm text-gray-500 mb-4">Configure system</p>
              <div className="flex items-center text-pink-400 text-sm font-medium">
                Configure <FiChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;