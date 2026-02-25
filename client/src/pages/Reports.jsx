import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportAPI } from '../services/api';
import { getUserRole } from '../utils/auth';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiEye,
  FiTrendingUp,
  FiCalendar,
  FiAward,
  FiBarChart2,
  FiCheckCircle,
  FiXCircle,
  FiClock
} from 'react-icons/fi';
import { format } from 'date-fns';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const userRole = getUserRole();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = userRole === 'student'
        ? await reportAPI.getMyReports()
        : await reportAPI.getAllReports();
      const data = response.data;
      // Handle both flat array and wrapped object responses
      const reportsArray = Array.isArray(data) ? data : data?.reports || data?.data || [];
      setReports(reportsArray);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch =
      (report.exam?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filter === 'passed') matchesFilter = report.passed;
    else if (filter === 'failed') matchesFilter = !report.passed;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: reports.length,
    passed: reports.filter(r => r.passed).length,
    failed: reports.filter(r => !r.passed).length,
    averageScore: reports.length > 0
      ? reports.reduce((acc, r) => acc + (r.percentage || 0), 0) / reports.length
      : 0,
    bestScore: reports.length > 0
      ? Math.max(...reports.map(r => r.percentage || 0))
      : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-300 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">
            <FiBarChart2 className="inline mr-3 text-blue-400" />
            Exam Reports
          </h1>
          <p className="text-gray-400 mt-2">
            {userRole === 'student'
              ? 'View your exam performance and history'
              : 'View all exam reports and analytics'}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          {[
            { label: 'Total Reports', value: stats.total, icon: FiCalendar, color: 'from-blue-500 to-cyan-400' },
            { label: 'Passed', value: stats.passed, icon: FiCheckCircle, color: 'from-green-500 to-emerald-400' },
            { label: 'Failed', value: stats.failed, icon: FiXCircle, color: 'from-red-500 to-pink-400' },
            { label: 'Avg Score', value: `${stats.averageScore.toFixed(1)}%`, icon: FiTrendingUp, color: 'from-purple-500 to-violet-400' },
            { label: 'Best Score', value: `${stats.bestScore.toFixed(1)}%`, icon: FiAward, color: 'from-amber-500 to-orange-400' },
          ].map((stat, index) => (
            <div key={index} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-5">
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} rounded-full filter blur-2xl opacity-20`}></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by exam or student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {['all', 'passed', 'failed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-3 rounded-xl font-medium text-sm transition-all ${filter === f
                    ? f === 'passed' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : f === 'failed' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FiBarChart2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300">No reports found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? 'Try adjusting your search' : 'No exam reports available yet. Take an exam to see your results here!'}
            </p>
            <Link
              to="/exams"
              className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Browse Exams
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {filteredReports.map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 rounded-2xl p-5 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Exam & Student Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Score Circle */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${report.passed
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-red-500/20 border border-red-500/30'
                      }`}>
                      <span className={`text-lg font-bold ${report.passed ? 'text-green-400' : 'text-red-400'}`}>
                        {(report.percentage || 0).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {report.exam?.title || 'Unknown Exam'}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        {userRole !== 'student' && report.user?.name && (
                          <span className="text-sm text-gray-400">
                            {report.user.name}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {report.exam?.subject || ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Stats */}
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-white font-medium">{report.score}/{report.totalMarks}</p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>

                    <div className="text-center">
                      <p className="text-white font-medium">
                        {report.timeTaken ? `${Math.floor(report.timeTaken / 60)}m` : '--'}
                      </p>
                      <p className="text-xs text-gray-500">Time</p>
                    </div>

                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${report.passed
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                        }`}>
                        {report.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>

                    <div className="text-center hidden sm:block">
                      <p className="text-sm text-gray-400">
                        {report.completedAt
                          ? format(new Date(report.completedAt), 'MMM dd, yyyy')
                          : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">Date</p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <Link
                    to={`/report/${report._id}`}
                    className="flex items-center justify-center px-4 py-2 bg-gray-700/50 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-xl transition-all border border-gray-700 hover:border-blue-500/30"
                  >
                    <FiEye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reports;