import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI } from '../services/api';
import { FiClock, FiAlertCircle, FiCheck, FiMaximize, FiAlertTriangle, FiChevronLeft, FiChevronRight, FiSend, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const MAX_TAB_SWITCHES = 3;

  // Start exam on mount
  useEffect(() => {
    startExam();
    return () => {
      exitFullscreen();
    };
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && exam && !submitting) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && exam && !submitting) {
      toast.error('Time is up! Submitting automatically...');
      handleSubmit(true);
    }
  }, [timeLeft, exam, submitting]);

  // Tab switch detection
  useEffect(() => {
    if (!exam) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          if (newCount >= MAX_TAB_SWITCHES) {
            toast.error('Maximum tab switches reached! Auto-submitting exam.');
            handleSubmit(true);
          } else {
            setShowTabWarning(true);
            toast.error(`Warning: Tab switch detected! (${newCount}/${MAX_TAB_SWITCHES})`);
          }
          return newCount;
        });
      }
    };

    const handleBlur = () => {
      // Additional blur detection for window focus loss
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.error('Right-click is disabled during exam');
    };

    const handleKeyDown = (e) => {
      // Prevent copy/paste
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 'u')) {
        e.preventDefault();
        toast.error('Copy/Paste is disabled during exam');
      }
      // Prevent print screen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        toast.error('Screenshots are disabled during exam');
      }
      // Prevent F12 dev tools
      if (e.key === 'F12') {
        e.preventDefault();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [exam, submitting]);

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterFullscreen = async () => {
    try {
      if (containerRef.current) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.error('Fullscreen request failed:', err);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    }
  };

  const startExam = async () => {
    try {
      const response = await examAPI.startExam(id);
      setExam(response.data.exam);
      setTimeLeft(response.data.duration * 60);

      const initialAnswers = response.data.exam.questions.map(() => ({
        selectedOption: null,
        timeTaken: 0,
      }));
      setAnswers(initialAnswers);

      // Auto-enter fullscreen after exam loads
      setTimeout(() => {
        enterFullscreen();
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start exam');
      navigate(`/exam/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      ...newAnswers[currentQuestion],
      selectedOption: optionIndex,
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (force = false) => {
    if (!force && !showConfirmSubmit) {
      setShowConfirmSubmit(true);
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    const timeTaken = (exam.duration * 60) - timeLeft;

    try {
      exitFullscreen();
      const response = await examAPI.submitExam(id, { answers, timeTaken });
      toast.success(`Exam submitted! Score: ${response.data.score}/${response.data.totalMarks} (${response.data.percentage.toFixed(1)}%)`);
      navigate(`/reports`);
    } catch (error) {
      toast.error('Failed to submit exam');
      setSubmitting(false);
    }
  };

  const answeredCount = answers.filter(a => a.selectedOption !== null).length;
  const unansweredCount = answers.length - answeredCount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-300 font-medium">Starting exam...</p>
          <p className="text-gray-500 text-sm mt-2">Preparing fullscreen mode</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Exam not available</h2>
          <p className="text-gray-400 mt-2">This exam may have expired or been removed.</p>
          <button
            onClick={() => navigate('/exams')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  const currentQ = exam.questions[currentQuestion];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timePercentage = (timeLeft / (exam.duration * 60)) * 100;
  const isLowTime = timeLeft < 300; // Less than 5 minutes

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white select-none">
      {/* Tab Switch Warning Modal */}
      {showTabWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-800 border border-red-500/50 rounded-2xl p-8 max-w-md mx-4 shadow-2xl shadow-red-500/20">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20">
              <FiAlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Tab Switch Detected!</h3>
            <p className="text-gray-400 text-center mb-4">
              You have switched tabs <span className="text-red-400 font-bold">{tabSwitchCount}</span> time(s).
              After <span className="text-red-400 font-bold">{MAX_TAB_SWITCHES}</span> switches, your exam will be auto-submitted.
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all"
                style={{ width: `${(tabSwitchCount / MAX_TAB_SWITCHES) * 100}%` }}
              ></div>
            </div>
            <button
              onClick={() => {
                setShowTabWarning(false);
                enterFullscreen();
              }}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              I Understand, Continue Exam
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20">
              <FiSend className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Submit Exam?</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm bg-gray-700/50 rounded-lg p-3">
                <span className="text-gray-400">Answered</span>
                <span className="text-green-400 font-medium">{answeredCount} / {answers.length}</span>
              </div>
              <div className="flex justify-between text-sm bg-gray-700/50 rounded-lg p-3">
                <span className="text-gray-400">Unanswered</span>
                <span className={`font-medium ${unansweredCount > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {unansweredCount}
                </span>
              </div>
              <div className="flex justify-between text-sm bg-gray-700/50 rounded-lg p-3">
                <span className="text-gray-400">Time Remaining</span>
                <span className="text-blue-400 font-medium">{minutes}:{seconds.toString().padStart(2, '0')}</span>
              </div>
            </div>
            {unansweredCount > 0 && (
              <p className="text-yellow-400 text-sm text-center mb-4">
                ⚠️ You have {unansweredCount} unanswered question(s)
              </p>
            )}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-600 transition-all"
              >
                Continue Exam
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={submitting}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Exam Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiShield className="h-5 w-5 text-green-400" />
                <span className="text-xs text-green-400 font-medium">PROCTORED</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-sm font-bold text-white truncate max-w-[200px]">{exam.title}</h1>
                <p className="text-xs text-gray-400">Q {currentQuestion + 1} of {exam.questions.length}</p>
              </div>
            </div>

            {/* Center: Timer */}
            <div className={`flex items-center px-5 py-2 rounded-xl font-mono text-lg transition-all ${isLowTime
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                : 'bg-gray-800 text-white border border-gray-700'
              }`}>
              <FiClock className="mr-2 h-5 w-5" />
              <span className="font-bold tracking-wider">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              {tabSwitchCount > 0 && (
                <div className="hidden md:flex items-center px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                  <FiAlertTriangle className="mr-1 h-3 w-3" />
                  {tabSwitchCount}/{MAX_TAB_SWITCHES}
                </div>
              )}
              {!isFullscreen && (
                <button
                  onClick={enterFullscreen}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Enter Fullscreen"
                >
                  <FiMaximize className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50"
              >
                <FiSend className="inline mr-1 h-4 w-4" />
                Submit
              </button>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="h-1 bg-gray-800 -mx-4 sm:-mx-6 lg:-mx-8">
            <div
              className={`h-full transition-all duration-1000 ${isLowTime ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                }`}
              style={{ width: `${timePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator - Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 sticky top-24">
              <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                {exam.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium text-sm transition-all duration-200 ${currentQuestion === index
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25 scale-110'
                        : answers[index]?.selectedOption !== null
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:border-gray-500 hover:text-white'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-5 pt-4 border-t border-gray-700 space-y-2">
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-cyan-400 mr-2"></div>
                  <span className="text-gray-400">Current</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30 mr-2"></div>
                  <span className="text-gray-400">Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded bg-gray-700/50 border border-gray-600 mr-2"></div>
                  <span className="text-gray-400">Unanswered ({unansweredCount})</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round((answeredCount / answers.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${(answeredCount / answers.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Area */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                      Question {currentQuestion + 1}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                      {currentQ.questionType === 'multiple-choice' ? 'MCQ' :
                        currentQ.questionType === 'true-false' ? 'True/False' : 'Short Answer'}
                    </span>
                  </div>
                </div>
                <span className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-xl font-bold text-sm border border-amber-500/20 mt-2 sm:mt-0">
                  {currentQ.points} {currentQ.points === 1 ? 'Point' : 'Points'}
                </span>
              </div>

              {/* Question Text */}
              <div className="mb-8 py-4 px-1">
                <p className="text-lg md:text-xl text-white leading-relaxed">{currentQ.questionText}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options?.map((option, index) => {
                  const isSelected = answers[currentQuestion]?.selectedOption === index;
                  const optionLabel = String.fromCharCode(65 + index); // A, B, C, D...

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 group ${isSelected
                          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                          : 'border-gray-700 hover:border-gray-500 hover:bg-gray-700/30'
                        }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 font-bold text-sm transition-all ${isSelected
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                            : 'bg-gray-700 text-gray-400 group-hover:bg-gray-600 group-hover:text-white'
                          }`}>
                          {isSelected ? <FiCheck className="h-5 w-5" /> : optionLabel}
                        </div>
                        <span className={`text-base ${isSelected ? 'text-white font-medium' : 'text-gray-300'}`}>
                          {option.text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestion === 0}
                  className={`flex items-center px-5 py-3 rounded-xl font-medium transition-all ${currentQuestion === 0
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                >
                  <FiChevronLeft className="mr-2 h-5 w-5" />
                  Previous
                </button>

                <span className="text-gray-500 text-sm hidden md:block">
                  {currentQuestion + 1} / {exam.questions.length}
                </span>

                {currentQuestion === exam.questions.length - 1 ? (
                  <button
                    onClick={() => handleSubmit(false)}
                    className="flex items-center px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
                  >
                    Submit Exam
                    <FiSend className="ml-2 h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                  >
                    Next
                    <FiChevronRight className="ml-2 h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;