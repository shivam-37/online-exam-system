import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { reportAPI, examAPI } from '../services/api';
import { getUserRole } from '../utils/auth';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBarChart2,
  FiDownload,
  FiPrinter,
  FiCalendar,
  FiUser,
  FiBook,
  FiAward,
  FiAlertCircle,
  FiTarget
} from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const userRole = getUserRole();

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      const reportResponse = await reportAPI.getReport(id);
      setReport(reportResponse.data);

      if (reportResponse.data.exam) {
        try {
          const examId = reportResponse.data.exam._id || reportResponse.data.exam;
          const examResponse = await examAPI.getExam(examId);
          setExam(examResponse.data);
        } catch (examErr) {
          console.error('Could not load exam details:', examErr);
          // Exam might have been deleted — use populated data from report
          if (reportResponse.data.exam?.title) {
            setExam(reportResponse.data.exam);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to load report details');
      console.error(error);
      navigate('/reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-300 font-medium">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Report not found</h2>
          <Link to="/reports" className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg transition-all">
            <FiArrowLeft className="inline mr-2" />
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  const percentage = report.percentage || 0;
  const isPassed = report.passed;
  const correctAnswers = report.answers?.filter(a => a.isCorrect).length || 0;
  const totalQuestions = report.answers?.length || 0;
  const timeTakenMin = Math.floor((report.timeTaken || 0) / 60);
  const timeTakenSec = (report.timeTaken || 0) % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white print:bg-white print:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 print:hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <Link to="/reports" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors">
                <FiArrowLeft className="mr-2" />
                Back to Reports
              </Link>
              <h1 className="text-3xl font-bold text-white">Exam Report</h1>
              <p className="text-gray-400 mt-2">Detailed analysis of your exam attempt</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => window.print()}
                className="flex items-center px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 border border-gray-700 transition-all"
              >
                <FiPrinter className="mr-2" />
                Print
              </button>
            </div>
          </div>
        </motion.div>

        {/* Score Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 print:shadow-none"
        >
          <div className={`relative overflow-hidden rounded-3xl p-8 border ${isPassed
              ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-green-500/30'
              : 'bg-gradient-to-br from-red-900/30 to-pink-900/20 border-red-500/30'
            }`}>
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full filter blur-[100px] opacity-20 ${isPassed ? 'bg-green-500' : 'bg-red-500'
              }`}></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {/* Score */}
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
                  {percentage.toFixed(1)}%
                </div>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${isPassed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                  {isPassed ? (
                    <><FiCheckCircle className="mr-2" />Passed</>
                  ) : (
                    <><FiXCircle className="mr-2" />Failed</>
                  )}
                </div>
              </div>

              {/* Marks */}
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {report.score} / {report.totalMarks}
                </div>
                <p className="text-gray-400 text-sm">Marks Obtained</p>
                <p className="text-gray-500 text-xs mt-1">Passing: {exam?.passingMarks || '--'}</p>
              </div>

              {/* Correct Answers */}
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {correctAnswers} / {totalQuestions}
                </div>
                <p className="text-gray-400 text-sm">Correct Answers</p>
                <p className="text-gray-500 text-xs mt-1">
                  Accuracy: {totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0}%
                </p>
              </div>

              {/* Time Taken */}
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {timeTakenMin}:{String(timeTakenSec).padStart(2, '0')}
                </div>
                <p className="text-gray-400 text-sm">Time Taken</p>
                <p className="text-gray-500 text-xs mt-1">Total: {exam?.duration || '--'} minutes</p>
              </div>
            </div>

            {/* Exam Info Bar */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <FiBook className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Exam</p>
                    <p className="font-medium text-gray-200">{exam?.title || report.exam?.title || 'Unknown Exam'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiUser className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Candidate</p>
                    <p className="font-medium text-gray-200">{report.user?.name || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Completed On</p>
                    <p className="font-medium text-gray-200">
                      {report.completedAt ? format(new Date(report.completedAt), 'PPpp') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 print:hidden">
          <div className="flex space-x-2 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
            {[
              { id: 'overview', label: 'Overview', icon: FiBarChart2 },
              { id: 'questions', label: 'Question Analysis', icon: FiTarget },
              { id: 'comparison', label: 'Performance', icon: FiTrendingUp },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Breakdown */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-6">Performance Breakdown</h3>
                <div className="space-y-5">
                  {[
                    { label: 'Score Progress', value: percentage, color: isPassed ? 'from-green-500 to-emerald-400' : 'from-red-500 to-pink-400' },
                    { label: 'Time Used', value: exam?.duration ? Math.min(100, ((report.timeTaken || 0) / (exam.duration * 60)) * 100) : 50, color: 'from-blue-500 to-cyan-400' },
                    { label: 'Accuracy Rate', value: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0, color: 'from-purple-500 to-violet-400' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="font-medium text-white">{item.value.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-6">
                  {isPassed ? '🎉 Congratulations!' : '📚 Areas for Improvement'}
                </h3>

                {isPassed ? (
                  <div className="space-y-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <h4 className="font-medium text-green-400 mb-2">Strengths</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-green-300 text-sm">
                          <FiCheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                          Score: {percentage.toFixed(1)}% — {percentage >= 90 ? 'Outstanding!' : percentage >= 80 ? 'Excellent!' : 'Well done!'}
                        </li>
                        <li className="flex items-center text-green-300 text-sm">
                          <FiCheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                          {correctAnswers} correct out of {totalQuestions} questions
                        </li>
                        <li className="flex items-center text-green-300 text-sm">
                          <FiCheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                          Completed in {timeTakenMin}m {timeTakenSec}s
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                      <h4 className="font-medium text-yellow-400 mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-yellow-300 text-sm">
                          <FiClock className="mr-2 h-4 w-4 flex-shrink-0" />
                          Practice time management — used {timeTakenMin}m {timeTakenSec}s
                        </li>
                        <li className="flex items-center text-yellow-300 text-sm">
                          <FiBook className="mr-2 h-4 w-4 flex-shrink-0" />
                          Review topics where you got answers wrong
                        </li>
                        <li className="flex items-center text-yellow-300 text-sm">
                          <FiTarget className="mr-2 h-4 w-4 flex-shrink-0" />
                          Take more practice tests to build confidence
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-700 flex space-x-3">
                  <Link
                    to={`/exam/${report.exam?._id || report.exam || ''}`}
                    className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm"
                  >
                    View Exam Details
                  </Link>
                  <Link
                    to="/exams"
                    className="flex-1 text-center px-4 py-3 bg-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-600 transition-all text-sm"
                  >
                    Browse More Exams
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-6">Question-wise Analysis</h3>

              <div className="space-y-4">
                {report.answers?.map((answer, index) => {
                  const question = exam?.questions?.[index];
                  const isCorrect = answer.isCorrect;

                  return (
                    <div key={index} className={`rounded-xl p-5 border transition-all ${isCorrect
                        ? 'bg-green-500/5 border-green-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                      }`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                            }`}>
                            {isCorrect ? (
                              <FiCheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <FiXCircle className="h-5 w-5 text-red-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Question {index + 1}</h4>
                            <p className="text-xs text-gray-500">{question?.points || 1} point(s)</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      <p className="text-gray-300 mb-4">{question?.questionText || 'Question text unavailable'}</p>

                      {/* Options */}
                      {question?.options && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          {question.options.map((option, optIndex) => {
                            const isUserChoice = optIndex === answer.selectedOption;
                            const isCorrectOption = option.isCorrect;

                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border text-sm ${isUserChoice && isCorrectOption
                                    ? 'border-green-500/50 bg-green-500/10 text-green-300'
                                    : isUserChoice && !isCorrectOption
                                      ? 'border-red-500/50 bg-red-500/10 text-red-300'
                                      : isCorrectOption
                                        ? 'border-green-500/30 bg-green-500/5 text-green-400'
                                        : 'border-gray-700 text-gray-400'
                                  }`}
                              >
                                <div className="flex items-center">
                                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 text-xs flex-shrink-0 ${isUserChoice
                                      ? isCorrectOption ? 'border-green-500 bg-green-500 text-white' : 'border-red-500 bg-red-500 text-white'
                                      : isCorrectOption ? 'border-green-500 text-green-400' : 'border-gray-600 text-gray-500'
                                    }`}>
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  <span>{option.text}</span>
                                  {isUserChoice && <span className="ml-auto text-xs opacity-60">(Your answer)</span>}
                                  {isCorrectOption && !isUserChoice && <span className="ml-auto text-xs text-green-400 opacity-60">(Correct)</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Distribution */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-6">Score Distribution</h3>
                <div className="space-y-4">
                  {['90-100', '80-89', '70-79', '60-69', '0-59'].map((range) => {
                    const isCurrentRange =
                      (range === '90-100' && percentage >= 90) ||
                      (range === '80-89' && percentage >= 80 && percentage < 90) ||
                      (range === '70-79' && percentage >= 70 && percentage < 80) ||
                      (range === '60-69' && percentage >= 60 && percentage < 70) ||
                      (range === '0-59' && percentage < 60);

                    return (
                      <div key={range} className="flex items-center">
                        <span className="w-16 text-sm text-gray-400 font-mono">{range}%</span>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${isCurrentRange
                                  ? isPassed ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-red-500 to-pink-400'
                                  : 'bg-gray-600'
                                }`}
                              style={{ width: isCurrentRange ? '100%' : '15%' }}
                            ></div>
                          </div>
                        </div>
                        <span className={`text-xs w-20 text-right ${isCurrentRange ? 'text-white font-bold' : 'text-gray-500'}`}>
                          {isCurrentRange ? '← You' : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time Analysis */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-6">Time & Speed</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Time Used</p>
                    <p className="text-2xl font-bold text-white">{timeTakenMin}m {timeTakenSec}s</p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Allotted Time</p>
                    <p className="text-2xl font-bold text-white">{exam?.duration || '--'}m</p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Questions/min</p>
                    <p className="text-2xl font-bold text-white">
                      {report.timeTaken > 0 ? (totalQuestions / (report.timeTaken / 60)).toFixed(1) : '--'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Accuracy</p>
                    <p className="text-2xl font-bold text-white">
                      {totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ReportDetail;