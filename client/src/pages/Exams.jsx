import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examAPI } from '../services/api';
import { getUserRole } from '../utils/auth';
import { 
  FiSearch, 
  FiPlus, 
  FiClock, 
  FiCalendar, 
  FiBook, 
  FiChevronDown,
  FiFilter,
  FiTrendingUp,
  FiAward,
  FiBarChart2
} from 'react-icons/fi';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const userRole = getUserRole();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examAPI.getExams();
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);
    
    let matchesFilter = true;
    if (filter === 'upcoming') {
      matchesFilter = startDate > now;
    } else if (filter === 'ongoing') {
      matchesFilter = startDate <= now && endDate >= now;
    } else if (filter === 'completed') {
      matchesFilter = endDate < now;
    }
    
    return matchesSearch && matchesFilter;
  });

  const getExamStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > now) return 'upcoming';
    if (start <= now && end >= now) return 'ongoing';
    return 'completed';
  };

  const statusConfig = {
    upcoming: {
      label: 'Upcoming',
      gradient: 'from-blue-500 to-indigo-500',
      lightBg: 'bg-blue-500/10',
      icon: FiCalendar
    },
    ongoing: {
      label: 'Live Now',
      gradient: 'from-green-500 to-emerald-500',
      lightBg: 'bg-green-500/10',
      icon: FiTrendingUp
    },
    completed: {
      label: 'Completed',
      gradient: 'from-gray-500 to-gray-600',
      lightBg: 'bg-gray-500/10',
      icon: FiAward
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-100">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with glass morphism */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Exam Dashboard
              </h1>
              <p className="text-gray-400 mt-2">Browse and participate in available examinations</p>
            </div>
            
            {userRole === 'admin' || userRole === 'teacher' ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/exams/create"
                  className="group relative inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <FiPlus className="mr-2 relative z-10" />
                  <span className="relative z-10">Create Exam</span>
                </Link>
              </motion.div>
            ) : null}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Exams', value: exams.length, icon: FiBook, color: 'from-indigo-500 to-indigo-600' },
            { label: 'Available Now', value: exams.filter(e => getExamStatus(e.startDate, e.endDate) === 'ongoing').length, icon: FiTrendingUp, color: 'from-green-500 to-green-600' },
            { label: 'Upcoming', value: exams.filter(e => getExamStatus(e.startDate, e.endDate) === 'upcoming').length, icon: FiCalendar, color: 'from-blue-500 to-blue-600' },
            { label: 'Completed', value: exams.filter(e => getExamStatus(e.startDate, e.endDate) === 'completed').length, icon: FiAward, color: 'from-purple-500 to-purple-600' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-6"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full filter blur-3xl opacity-20`}></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Main search bar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
                <FiSearch className="absolute left-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exams by title or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent pl-12 pr-4 py-4 text-gray-100 placeholder-gray-500 focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`mr-2 p-2 rounded-xl transition-colors ${
                    showFilters ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <FiFilter className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Advanced filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-2 p-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl"
                >
                  <div className="flex gap-2">
                    {[
                      { value: 'all', label: 'All', icon: FiBarChart2 },
                      { value: 'upcoming', label: 'Upcoming', icon: FiCalendar },
                      { value: 'ongoing', label: 'Ongoing', icon: FiTrendingUp },
                      { value: 'completed', label: 'Completed', icon: FiAward }
                    ].map((filterOption) => (
                      <motion.button
                        key={filterOption.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFilter(filterOption.value)}
                        className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                          filter === filterOption.value
                            ? `bg-gradient-to-r ${statusConfig[filterOption.value]?.gradient || 'from-indigo-500 to-purple-500'} text-white`
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }`}
                      >
                        <filterOption.icon className="w-4 h-4 mr-2" />
                        {filterOption.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Exams Grid */}
        <AnimatePresence mode="wait">
          {filteredExams.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredExams.map((exam, index) => {
                const status = getExamStatus(exam.startDate, exam.endDate);
                const StatusIcon = statusConfig[status].icon;
                const startDate = new Date(exam.startDate);
                const endDate = new Date(exam.endDate);

                return (
                  <motion.div
                    key={exam._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="group relative"
                  >
                    {/* Card background with gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    
                    <div className="relative h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
                      {/* Status bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusConfig[status].gradient}`}></div>
                      
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-1">{exam.title}</h3>
                            <p className="text-sm text-indigo-400">{exam.subject}</p>
                          </div>
                          <div className={`flex items-center px-3 py-1 rounded-full ${statusConfig[status].lightBg}`}>
                            <StatusIcon className={`w-4 h-4 mr-1 text-${statusConfig[status].gradient.split(' ')[0]}`} />
                            <span className={`text-xs font-medium text-${statusConfig[status].gradient.split(' ')[0]}`}>
                              {statusConfig[status].label}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{exam.description}</p>

                        {/* Details grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="flex items-center text-sm text-gray-400">
                            <FiClock className="mr-2 text-indigo-400" />
                            <span>{exam.duration} min</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <FiBook className="mr-2 text-indigo-400" />
                            <span>{exam.questions?.length || 0} questions</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <FiAward className="mr-2 text-indigo-400" />
                            <span>{exam.totalMarks} marks</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <FiCalendar className="mr-2 text-indigo-400" />
                            <span>{format(startDate, 'MMM dd')}</span>
                          </div>
                        </div>

                        {/* Action button */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Link
                            to={`/exam/${exam._id}`}
                            className={`block w-full py-3 px-4 rounded-xl text-center font-medium transition-all ${
                              status === 'ongoing' && userRole === 'student'
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                                : userRole === 'admin' || userRole === 'teacher'
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                                : 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-700'
                            }`}
                            onClick={(e) => {
                              if (status !== 'ongoing' && userRole === 'student') {
                                e.preventDefault();
                              }
                            }}
                          >
                            {userRole === 'admin' || userRole === 'teacher' ? 'Manage Exam' : 
                             status === 'upcoming' ? 'Coming Soon' : 
                             status === 'ongoing' ? 'Start Exam' : 'View Results'}
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20"></div>
                <FiBook className="relative w-20 h-20 text-gray-600 mx-auto" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-white">No exams found</h3>
              <p className="mt-2 text-gray-400">
                {searchTerm ? 'Try adjusting your search terms' : 'No exams available at the moment'}
              </p>
              {searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium"
                >
                  Clear Search
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Exams;