import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { reportAPI, examAPI } from '../services/api';
import { getUserRole } from '../utils/auth';
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
  FiAlertCircle
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
      
      // Fetch exam details if not included in report
      if (reportResponse.data.exam) {
        const examResponse = await examAPI.getExam(reportResponse.data.exam._id);
        setExam(examResponse.data);
      }
    } catch (error) {
      toast.error('Failed to load report details');
      console.error(error);
      navigate('/reports');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success('Download feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Report not found</h2>
          <Link to="/reports" className="mt-4 inline-block btn-primary">
            <FiArrowLeft className="inline mr-2" />
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  const percentage = report.percentage;
  const isPassed = report.passed;
  const correctAnswers = report.answers?.filter(a => a.isCorrect).length || 0;
  const totalQuestions = report.answers?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex justify-between items-start">
            <div>
              <Link to="/reports" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
                <FiArrowLeft className="mr-2" />
                Back to Reports
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Exam Report</h1>
              <p className="text-gray-600 mt-2">
                Detailed analysis of your exam attempt
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                <FiDownload className="mr-2" />
                Download
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <FiPrinter className="mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="card mb-8 print:shadow-none print:border print:border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Score */}
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                isPassed ? 'text-green-600' : 'text-red-600'
              }`}>
                {percentage.toFixed(1)}%
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isPassed ? (
                  <>
                    <FiCheckCircle className="mr-1" />
                    Passed
                  </>
                ) : (
                  <>
                    <FiXCircle className="mr-1" />
                    Failed
                  </>
                )}
              </div>
            </div>

            {/* Marks */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {report.score} / {report.totalMarks}
              </div>
              <p className="text-gray-600">Marks Obtained</p>
              <div className="text-sm text-gray-500 mt-1">
                Passing: {exam?.passingMarks || 0}
              </div>
            </div>

            {/* Correct Answers */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {correctAnswers} / {totalQuestions}
              </div>
              <p className="text-gray-600">Correct Answers</p>
              <div className="text-sm text-gray-500 mt-1">
                Accuracy: {totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0}%
              </div>
            </div>

            {/* Time Taken */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.floor(report.timeTaken / 60)}:{String(report.timeTaken % 60).padStart(2, '0')}
              </div>
              <p className="text-gray-600">Time Taken</p>
              <div className="text-sm text-gray-500 mt-1">
                Total: {exam?.duration || 0} minutes
              </div>
            </div>
          </div>

          {/* Exam Info */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <FiBook className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Exam</p>
                  <p className="font-medium">{exam?.title || report.exam?.title || 'Unknown Exam'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiUser className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Candidate</p>
                  <p className="font-medium">{report.user?.name || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Completed On</p>
                  <p className="font-medium">
                    {format(new Date(report.completedAt), 'PPpp')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 print:hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiBarChart2 className="inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'questions'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Question Analysis
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'comparison'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Performance Insights
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="print:block">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
                <div className="space-y-4">
                  {/* Score Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Score Progress</span>
                      <span className="font-medium">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          isPassed ? 'bg-green-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Time Management */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Time Management</span>
                      <span className="font-medium">
                        {Math.floor(report.timeTaken / 60)}:{String(report.timeTaken % 60).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-600"
                        style={{ 
                          width: `${Math.min(100, (report.timeTaken / (exam?.duration * 60 || 1)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Accuracy */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Accuracy Rate</span>
                      <span className="font-medium">
                        {totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-purple-600"
                        style={{ 
                          width: `${totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Attempt Number</p>
                    <p className="text-xl font-bold text-gray-900">{report.attemptNumber || 1}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Question Type</p>
                    <p className="text-xl font-bold text-gray-900">MCQ</p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {isPassed ? 'Congratulations!' : 'Areas for Improvement'}
                </h3>
                
                {isPassed ? (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FiAward className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Excellent Performance!</h4>
                        <p className="text-gray-600 mt-1">
                          You have successfully passed the exam with a score of {percentage.toFixed(1)}%.
                          Your performance demonstrates strong understanding of the subject matter.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        <li className="flex items-center text-green-700">
                          <FiCheckCircle className="mr-2 h-4 w-4" />
                          High accuracy rate ({((correctAnswers / totalQuestions) * 100).toFixed(1)}%)
                        </li>
                        <li className="flex items-center text-green-700">
                          <FiCheckCircle className="mr-2 h-4 w-4" />
                          Good time management
                        </li>
                        <li className="flex items-center text-green-700">
                          <FiCheckCircle className="mr-2 h-4 w-4" />
                          Consistent performance across sections
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FiAlertCircle className="h-6 w-6 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Keep Practicing</h4>
                        <p className="text-gray-600 mt-1">
                          You scored {percentage.toFixed(1)}% which is below the passing mark of 
                          {exam?.passingMarks ? ` ${(exam.passingMarks / exam.totalMarks * 100).toFixed(1)}%` : ''}.
                          Focus on the following areas to improve your score.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-yellow-700">
                          <FiClock className="mr-2 h-4 w-4" />
                          Practice time management - you used {Math.floor(report.timeTaken / 60)} minutes
                        </li>
                        <li className="flex items-center text-yellow-700">
                          <FiBook className="mr-2 h-4 w-4" />
                          Review topics with low accuracy
                        </li>
                        <li className="flex items-center text-yellow-700">
                          <FiBarChart2 className="mr-2 h-4 w-4" />
                          Take more practice tests to build confidence
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Next Steps</h4>
                  <div className="flex space-x-3">
                    <Link
                      to={`/exam/${report.exam?._id || ''}`}
                      className="flex-1 text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      View Exam Details
                    </Link>
                    <Link
                      to="/exams"
                      className="flex-1 text-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      Browse More Exams
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && exam && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Question-wise Analysis</h3>
              
              <div className="space-y-6">
                {report.answers?.map((answer, index) => {
                  const question = exam.questions[index];
                  const isCorrect = answer.isCorrect;
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            isCorrect ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {isCorrect ? (
                              <FiCheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <FiXCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                            <p className="text-sm text-gray-600">
                              {question?.points || 1} point{question?.points !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-800">{question?.questionText}</p>
                      </div>
                      
                      {/* Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                        {question?.options?.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg border ${
                              optIndex === answer.selectedOption
                                ? option.isCorrect
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-red-500 bg-red-50'
                                : option.isCorrect
                                ? 'border-green-200 bg-green-25'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full border mr-3 ${
                                optIndex === answer.selectedOption
                                  ? option.isCorrect
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-red-500 bg-red-500'
                                  : option.isCorrect
                                  ? 'border-green-500'
                                  : 'border-gray-300'
                              }`}>
                                {optIndex === answer.selectedOption && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                              <span className="text-gray-800">{option.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Explanation */}
                      <div className="text-sm">
                        <p className="text-gray-600">
                          Your answer: <span className={`font-medium ${
                            isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                            Option {answer.selectedOption !== null ? answer.selectedOption + 1 : 'Not attempted'}
                          </span>
                        </p>
                        <p className="text-gray-600 mt-1">
                          Correct answer: <span className="font-medium text-green-600">
                            Option {question?.options?.findIndex(opt => opt.isCorrect) + 1}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Performance Comparison */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Score Distribution</h4>
                  <div className="space-y-4">
                    {['90-100', '80-89', '70-79', '60-69', '0-59'].map((range, index) => {
                      const isCurrentRange = 
                        (range === '90-100' && percentage >= 90) ||
                        (range === '80-89' && percentage >= 80 && percentage < 90) ||
                        (range === '70-79' && percentage >= 70 && percentage < 80) ||
                        (range === '60-69' && percentage >= 60 && percentage < 70) ||
                        (range === '0-59' && percentage < 60);
                      
                      return (
                        <div key={range} className="flex items-center">
                          <span className="w-16 text-sm text-gray-600">{range}%</span>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  isCurrentRange
                                    ? isPassed ? 'bg-green-600' : 'bg-red-600'
                                    : 'bg-gray-300'
                                }`}
                                style={{ 
                                  width: isCurrentRange ? '100%' : `${20 + Math.random() * 30}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {isCurrentRange ? 'Your Score' : 'Avg: 25%'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Time Analysis */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Time Analysis</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Your Time</span>
                        <span className="font-medium">
                          {Math.floor(report.timeTaken / 60)}m {report.timeTaken % 60}s
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${(report.timeTaken / (exam?.duration * 60 || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Average Time</span>
                        <span className="font-medium">45m 30s</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gray-400"
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Speed Metrics */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Questions/min</p>
                      <p className="text-xl font-bold text-gray-900">
                        {totalQuestions > 0 ? (totalQuestions / (report.timeTaken / 60)).toFixed(1) : 0}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Accuracy Rate</p>
                      <p className="text-xl font-bold text-gray-900">
                        {totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Print-only section */}
        <div className="hidden print:block mt-8">
          <div className="border-t border-gray-300 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Official Report</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>This is an official report generated by Online Exam System.</p>
              <p>Report ID: {report._id}</p>
              <p>Generated on: {format(new Date(), 'PPPPpp')}</p>
              <p className="mt-4">Signature: _________________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;