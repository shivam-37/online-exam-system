import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { examAPI, reportAPI } from '../services/api';
import { getUserRole, isAuthenticated } from '../utils/auth';
import { 
  FiClock, 
  FiCalendar, 
  FiBook, 
  FiCheckCircle, 
  FiArrowLeft,
  FiAlertCircle,
  FiUsers,
  FiBarChart2
} from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAttempts, setUserAttempts] = useState([]);
  const [stats, setStats] = useState(null);
  const userRole = getUserRole();

  useEffect(() => {
    fetchExamDetails();
    if (userRole === 'student') {
      fetchUserAttempts();
    }
    if (userRole === 'admin' || userRole === 'teacher') {
      fetchExamStats();
    }
  }, [id]);

  const fetchExamDetails = async () => {
    try {
      const response = await examAPI.getExam(id);
      setExam(response.data);
    } catch (error) {
      toast.error('Failed to load exam details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAttempts = async () => {
    try {
      const response = await reportAPI.getMyReports();
      const attempts = response.data.filter(report => report.exam?._id === id);
      setUserAttempts(attempts);
    } catch (error) {
      console.error('Error fetching attempts:', error);
    }
  };

  const fetchExamStats = async () => {
    try {
      const response = await reportAPI.getExamStats(id);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStartExam = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to start the exam');
      navigate('/login');
      return;
    }

    try {
      await examAPI.startExam(id);
      navigate(`/exam/${id}/take`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start exam');
    }
  };

  const handleDeleteExam = async () => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;

    try {
      await examAPI.deleteExam(id);
      toast.success('Exam deleted successfully');
      navigate('/exams');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete exam');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Exam not found</h2>
          <p className="text-gray-600 mt-2">The exam you're looking for doesn't exist.</p>
          <Link to="/exams" className="mt-4 inline-block btn-primary">
            <FiArrowLeft className="inline mr-2" />
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  const now = new Date();
  const startDate = new Date(exam.startDate);
  const endDate = new Date(exam.endDate);
  const isUpcoming = startDate > now;
  const isOngoing = startDate <= now && endDate >= now;
  const isCompleted = endDate < now;
  const canTakeExam = userRole === 'student' && isOngoing && exam.isActive;
  const attemptsLeft = exam.maxAttempts - userAttempts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Link to="/exams" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <FiArrowLeft className="mr-2" />
            Back to Exams
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-gray-600 mt-2">{exam.description}</p>
            </div>
            
            {(userRole === 'admin' || userRole === 'teacher') && (
              <div className="flex space-x-3">
                <Link
                  to={`/exam/${id}/edit`}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                >
                  Edit Exam
                </Link>
                <button
                  onClick={handleDeleteExam}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                >
                  Delete Exam
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Exam Details */}
          <div className="lg:col-span-2">
            {/* Exam Status Card */}
            <div className="card mb-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    isUpcoming ? 'bg-blue-500' :
                    isOngoing ? 'bg-green-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className={`font-medium ${
                    isUpcoming ? 'text-blue-600' :
                    isOngoing ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {isUpcoming ? 'Upcoming' : isOngoing ? 'Ongoing' : 'Completed'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <FiBook className="mr-2 text-gray-500" />
                  <span className="text-gray-600">{exam.subject}</span>
                </div>
                
                <div className="flex items-center">
                  <FiClock className="mr-2 text-gray-500" />
                  <span className="text-gray-600">{exam.duration} minutes</span>
                </div>
              </div>

              {/* Timelines */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiCalendar className="inline mr-2" />
                    Exam Period
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Starts</p>
                        <p className="font-medium">{format(startDate, 'PPpp')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ends</p>
                        <p className="font-medium">{format(endDate, 'PPpp')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
                <ul className="space-y-2">
                  {exam.instructions?.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Question Preview */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Preview</h3>
              <div className="space-y-4">
                {exam.questions?.slice(0, 3).map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                      <span className="text-sm text-gray-500">{question.points} point{question.points !== 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{question.questionText}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {question.options?.slice(0, 2).map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center">
                          <div className={`w-4 h-4 rounded border mr-2 ${
                            option.isCorrect ? 'border-green-500 bg-green-100' : 'border-gray-300'
                          }`}></div>
                          <span className="text-sm text-gray-600">{option.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {exam.questions?.length > 3 && (
                  <p className="text-center text-gray-500">
                    ... and {exam.questions.length - 3} more questions
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Stats */}
          <div>
            {/* Action Card */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Details</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Marks</span>
                  <span className="font-medium">{exam.totalMarks}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Passing Marks</span>
                  <span className="font-medium">{exam.passingMarks}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions</span>
                  <span className="font-medium">{exam.questions?.length || 0}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Attempts</span>
                  <span className="font-medium">{exam.maxAttempts}</span>
                </div>
                
                {userRole === 'student' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Attempts</span>
                    <span className="font-medium">{userAttempts.length} / {exam.maxAttempts}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6">
                {userRole === 'student' ? (
                  canTakeExam ? (
                    <button
                      onClick={handleStartExam}
                      disabled={attemptsLeft <= 0}
                      className={`w-full py-3 rounded-lg font-semibold ${
                        attemptsLeft > 0
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {attemptsLeft > 0
                        ? `Start Exam (${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} left)`
                        : 'No attempts remaining'}
                    </button>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600">
                        {isUpcoming ? 'Exam starts soon' : 'Exam period has ended'}
                      </p>
                    </div>
                  )
                ) : (
                  <Link
                    to={`/exam/${id}/results`}
                    className="block w-full py-3 bg-primary-600 text-white rounded-lg font-semibold text-center hover:bg-primary-700"
                  >
                    View Results
                  </Link>
                )}
              </div>
            </div>

            {/* User Attempts */}
            {userRole === 'student' && userAttempts.length > 0 && (
              <div className="card mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Attempts</h3>
                <div className="space-y-3">
                  {userAttempts.map((attempt, index) => (
                    <Link
                      key={attempt._id}
                      to={`/report/${attempt._id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Attempt {index + 1}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(attempt.completedAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {attempt.percentage.toFixed(1)}%
                          </p>
                          <p className="text-sm text-gray-500">
                            {attempt.passed ? 'Passed' : 'Failed'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Stats for Admin/Teacher */}
            {(userRole === 'admin' || userRole === 'teacher') && stats && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiUsers className="mr-2 text-gray-500" />
                      <span className="text-gray-600">Total Attempts</span>
                    </div>
                    <span className="font-medium">{stats.totalAttempts}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiBarChart2 className="mr-2 text-gray-500" />
                      <span className="text-gray-600">Average Score</span>
                    </div>
                    <span className="font-medium">{stats.averageScore?.toFixed(1) || '0'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pass Rate</span>
                    <span className="font-medium">{stats.passRate?.toFixed(1) || '0'}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;