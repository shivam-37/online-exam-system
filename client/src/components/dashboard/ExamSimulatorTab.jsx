import React, { useState } from 'react';
import { FiZap, FiClock, FiPlay, FiPause, FiCheck, FiX, FiSettings, FiHelpCircle, FiRefreshCw } from 'react-icons/fi';

const ExamSimulatorTab = () => {
  const [simulationMode, setSimulationMode] = useState('standard');
  const [isSimulating, setIsSimulating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [showReview, setShowReview] = useState(false);

  const totalQuestions = 50;
  const questionTime = 72; // seconds per question on average

  const simulationModes = [
    { id: 'standard', name: 'Standard Exam', time: 60, questions: 50, difficulty: 'Mixed' },
    { id: 'timed', name: 'Timed Challenge', time: 30, questions: 25, difficulty: 'Challenging' },
    { id: 'adaptive', name: 'Adaptive Test', time: 45, questions: 35, difficulty: 'Adaptive' },
    { id: 'practice', name: 'Practice Mode', time: null, questions: 25, difficulty: 'Easy' },
  ];

  const examSettings = {
    enableProctoring: true,
    showTimer: true,
    allowReview: true,
    fullScreen: false,
    questionNavigation: true,
    autoSave: true,
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setTimeLeft(3600);
    setCurrentQuestion(1);
    setAnswers({});
    setShowReview(false);
    
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSimulating(false);
          setShowReview(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    return (currentQuestion / totalQuestions) * 100;
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const sampleQuestion = {
    id: 1,
    text: "Which of the following best describes the primary purpose of the 'useEffect' hook in React?",
    options: [
      "To handle component lifecycle methods",
      "To perform side effects in functional components",
      "To manage component state",
      "To optimize rendering performance"
    ],
    correctAnswer: 1,
    explanation: "The useEffect hook lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes."
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Exam Simulator</h2>
            <p className="opacity-90 mt-2">Real exam experience with full simulation</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">BETA</span>
            <FiZap className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Simulation Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {simulationModes.map((mode) => (
          <div 
            key={mode.id}
            onClick={() => setSimulationMode(mode.id)}
            className={`bg-white rounded-2xl p-6 shadow-lg border cursor-pointer transition-all duration-200 ${
              simulationMode === mode.id
                ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                : 'border-gray-100 hover:shadow-xl'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                simulationMode === mode.id
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <FiZap />
              </div>
              {simulationMode === mode.id && (
                <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full text-xs font-medium">
                  Selected
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900">{mode.name}</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium text-gray-900">{mode.time || 'Unlimited'} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Questions</span>
                <span className="font-medium text-gray-900">{mode.questions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Difficulty</span>
                <span className="font-medium text-gray-900">{mode.difficulty}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Simulation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulation Controls */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            {!isSimulating ? (
              // Ready to start
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                  <FiPlay className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Start Simulation?</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Experience a real exam environment with timed questions, proctoring simulation, and detailed feedback.
                </p>
                <button
                  onClick={startSimulation}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 flex items-center justify-center mx-auto"
                >
                  <FiPlay className="mr-2" />
                  Start Exam Simulation
                </button>
              </div>
            ) : (
              // Active simulation
              <div>
                {/* Timer and Progress */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Exam Simulation Active</h3>
                    <p className="text-gray-600">Question {currentQuestion} of {totalQuestions}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{formatTime(timeLeft)}</div>
                      <div className="text-sm text-gray-600">Time Remaining</div>
                    </div>
                    <div className="w-32">
                      <div className="text-sm text-gray-600 mb-1">Progress</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${calculateProgress()}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 text-right mt-1">
                        {Math.round(calculateProgress())}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Display */}
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Question {currentQuestion}
                      </span>
                      <span className="text-sm text-gray-600">{questionTime} seconds recommended</span>
                    </div>
                    <p className="text-lg text-gray-900 mb-6">{sampleQuestion.text}</p>
                    
                    <div className="space-y-3">
                      {sampleQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(currentQuestion, index)}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                            answers[currentQuestion] === index
                              ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              answers[currentQuestion] === index
                                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-gray-900">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentQuestion(prev => Math.max(1, prev - 1))}
                      disabled={currentQuestion === 1}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous Question
                    </button>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
                      >
                        Mark for Review
                      </button>
                      <button
                        onClick={() => {
                          if (currentQuestion < totalQuestions) {
                            setCurrentQuestion(prev => prev + 1);
                          } else {
                            setIsSimulating(false);
                            setShowReview(true);
                          }
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
                      >
                        {currentQuestion < totalQuestions ? 'Next Question' : 'Submit Exam'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Settings Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <FiSettings className="mr-2 text-gray-600" /> Simulation Settings
            </h3>
            <div className="space-y-4">
              {Object.entries(examSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={value} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-purple-600 to-pink-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Question Navigator */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentQuestion(num)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    currentQuestion === num
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                      : answers[num] !== undefined
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-100 mr-1"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-100 mr-1"></div>
                <span>Unanswered</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <FiHelpCircle className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">View Instructions</span>
                </div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <FiPause className="h-5 w-5 text-amber-600 mr-3" />
                  <span className="font-medium text-gray-900">Pause Exam</span>
                </div>
              </button>
              
              <button 
                onClick={() => setIsSimulating(false)}
                className="w-full flex items-center justify-between p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiX className="h-5 w-5 text-red-600 mr-3" />
                  <span className="font-medium text-gray-900">End Simulation</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      {showReview && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Simulation Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="text-4xl font-bold text-gray-900 mb-2">78%</div>
              <p className="text-gray-600">Your Score</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <div className="text-4xl font-bold text-gray-900 mb-2">42/50</div>
              <p className="text-gray-600">Correct Answers</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <div className="text-4xl font-bold text-gray-900 mb-2">58:24</div>
              <p className="text-gray-600">Time Taken</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200">
              <FiCheck className="inline mr-2" />
              View Detailed Report
            </button>
            <button 
              onClick={startSimulation}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
            >
              <FiRefreshCw className="inline mr-2" />
              Retake Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSimulatorTab;