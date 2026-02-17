import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI } from '../services/api';
import { 
  FiArrowLeft, FiPlus, FiTrash2, FiSave, FiCopy, FiClock, 
  FiCalendar, FiEdit, FiEye, FiChevronRight, FiUpload,
  FiCheckCircle, FiAlertCircle, FiHelpCircle, FiSettings,
  FiZap, FiSmartphone, FiFilter, FiRefreshCw, FiTarget,
  FiMessageSquare, FiAward, FiTrendingUp, FiHash,
  FiBook, FiLock, FiGlobe, FiUsers, FiPieChart
} from 'react-icons/fi';
import { 
  HiOutlineQuestionMarkCircle, 
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineCalculator,
  HiOutlineChartBar,
  HiOutlineLockClosed,
  HiOutlineGlobe,
  HiOutlineUsers,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlinePuzzle,
  HiOutlineChartPie,
  HiOutlineAdjustments,
  HiOutlineDuplicate,
  HiOutlineTag
} from 'react-icons/hi';
import { MdOutlineLeaderboard, MdOutlineSimCardDownload } from 'react-icons/md';
import toast from 'react-hot-toast';

const CreateExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: 'medium',
    duration: 60,
    totalMarks: 100,
    passingMarks: 40,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    maxAttempts: 1,
    instructions: [
      'Read all questions carefully before answering',
      'Ensure you have a stable internet connection',
      'No external resources allowed unless specified',
      'Submit before the time expires'
    ],
    questions: [],
    isActive: true,
    isProctored: false,
    showResults: true,
    allowNavigation: true,
    randomizeQuestions: false,
    timePerQuestion: false,
    negativeMarking: false,
    negativeMarkingValue: 0.25,
    tags: [],
    category: 'General',
    passingPercentage: 60,
    reviewDuration: 5,
    showTimer: true,
    allowReview: true,
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    questionType: 'multiple-choice',
    points: 1,
    timeLimit: 60,
    difficulty: 'medium',
    explanation: '',
    tags: [],
    options: [
      { text: '', isCorrect: false, imageUrl: '' },
      { text: '', isCorrect: false, imageUrl: '' },
      { text: '', isCorrect: true, imageUrl: '' },
      { text: '', isCorrect: false, imageUrl: '' },
    ],
  });

  const tabs = [
    { id: 'details', label: 'Exam Details', icon: HiOutlineDocumentText, color: 'from-blue-500 to-cyan-400' },
    { id: 'questions', label: 'Questions', icon: HiOutlineQuestionMarkCircle, color: 'from-emerald-500 to-green-400' },
    { id: 'settings', label: 'Advanced', icon: FiSettings, color: 'from-purple-500 to-pink-500' },
    { id: 'preview', label: 'Preview', icon: FiEye, color: 'from-amber-500 to-orange-400' },
  ];

  useEffect(() => {
    if (id) {
      fetchExamForEdit();
    }
  }, [id]);

  const fetchExamForEdit = async () => {
    try {
      setLoading(true);
      const response = await examAPI.getExam(id);
      const exam = response.data;
      
      setFormData({
        ...formData,
        ...exam,
        startDate: new Date(exam.startDate).toISOString().slice(0, 16),
        endDate: new Date(exam.endDate).toISOString().slice(0, 16),
      });
      
      setIsEditing(true);
      toast.success('Exam loaded for editing');
    } catch (error) {
      toast.error('Failed to load exam for editing');
      navigate('/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value,
    });
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index][field] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  const handleCorrectAnswerChange = (index) => {
    const newOptions = currentQuestion.options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  const addQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      toast.error('Please enter question text');
      return;
    }

    if (currentQuestion.options.filter(opt => opt.text.trim()).length < 2) {
      toast.error('Please add at least 2 options');
      return;
    }

    if (!currentQuestion.options.some(opt => opt.isCorrect)) {
      toast.error('Please select a correct answer');
      return;
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, { 
        ...currentQuestion, 
        id: Date.now() + Math.random() 
      }],
    });

    // Reset current question
    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple-choice',
      points: 1,
      timeLimit: 60,
      difficulty: 'medium',
      explanation: '',
      tags: [],
      options: [
        { text: '', isCorrect: false, imageUrl: '' },
        { text: '', isCorrect: false, imageUrl: '' },
        { text: '', isCorrect: true, imageUrl: '' },
        { text: '', isCorrect: false, imageUrl: '' },
      ],
    });

    toast.success('Question added successfully');
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      questions: newQuestions,
    });
    toast.success('Question removed');
  };

  const addOption = () => {
    if (currentQuestion.options.length >= 6) {
      toast.error('Maximum 6 options allowed');
      return;
    }
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { text: '', isCorrect: false, imageUrl: '' }],
    });
  };

  const removeOption = (index) => {
    if (currentQuestion.options.length <= 2) {
      toast.error('Minimum 2 options required');
      return;
    }
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter exam title');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter exam description');
      return;
    }

    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    if (formData.totalMarks <= 0) {
      toast.error('Total marks must be greater than 0');
      return;
    }

    if (formData.passingMarks > formData.totalMarks) {
      toast.error('Passing marks cannot exceed total marks');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    setLoading(true);

    try {
      const examData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        duration: parseInt(formData.duration),
        totalMarks: parseInt(formData.totalMarks),
        passingMarks: parseInt(formData.passingMarks),
        maxAttempts: parseInt(formData.maxAttempts),
      };

      if (isEditing) {
        await examAPI.updateExam(id, examData);
        toast.success('Exam updated successfully!');
      } else {
        await examAPI.createExam(examData);
        toast.success('Exam created successfully!');
      }
      
      navigate('/exams');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  const calculateExamStats = () => {
    const totalQuestions = formData.questions.length;
    const totalPoints = formData.questions.reduce((sum, q) => sum + parseInt(q.points || 1), 0);
    const avgDifficulty = formData.questions.length > 0 
      ? formData.questions.reduce((sum, q) => {
          const weight = { easy: 1, medium: 2, hard: 3 };
          return sum + (weight[q.difficulty] || 2);
        }, 0) / formData.questions.length
      : 2;
    
    const difficultyText = avgDifficulty < 1.5 ? 'Easy' : avgDifficulty < 2.5 ? 'Medium' : 'Hard';
    
    return {
      totalQuestions,
      totalPoints,
      avgDifficulty: difficultyText,
      passingPercentage: ((formData.passingMarks / formData.totalMarks) * 100).toFixed(1),
      estimatedTime: Math.max(30, Math.ceil(totalQuestions * 1.5)),
    };
  };

  const stats = calculateExamStats();

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-300 font-medium">Loading exam editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/exams')}
                className="mr-4 text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {isEditing ? 'Edit Exam' : 'Create New Exam'}
                </h1>
                <p className="text-xs text-gray-400">
                  {isEditing ? 'Update exam details and questions' : 'Design your perfect assessment'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/exams')}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <FiSave className="mr-2" />
                {loading ? 'Saving...' : isEditing ? 'Update Exam' : 'Create Exam'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto space-x-2 pb-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {activeTab === 'details' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <HiOutlineDocumentText className="mr-3 h-6 w-6 text-blue-400" />
                    Exam Details
                  </h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                    Required Fields
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> Exam Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        required
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="e.g., Mathematics Midterm Exam"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> Subject
                      </label>
                      <div className="relative">
                        <HiOutlineAcademicCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleFormChange}
                          required
                          className="w-full pl-10 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="e.g., Mathematics, Physics, etc."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        required
                        rows="4"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Brief description of the exam"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Difficulty Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['easy', 'medium', 'hard'].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setFormData({ ...formData, difficulty: level })}
                            className={`py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                              formData.difficulty === level
                                ? level === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                  level === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                  'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:bg-gray-700'
                            }`}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <span className="text-red-400">*</span> Duration (min)
                        </label>
                        <div className="relative">
                          <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleFormChange}
                            min="1"
                            required
                            className="w-full pl-10 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Max Attempts
                        </label>
                        <div className="relative">
                          <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="number"
                            name="maxAttempts"
                            value={formData.maxAttempts}
                            onChange={handleFormChange}
                            min="1"
                            className="w-full pl-10 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <span className="text-red-400">*</span> Total Marks
                        </label>
                        <div className="relative">
                          <HiOutlineCalculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="number"
                            name="totalMarks"
                            value={formData.totalMarks}
                            onChange={handleFormChange}
                            min="1"
                            required
                            className="w-full pl-10 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <span className="text-red-400">*</span> Passing Marks
                        </label>
                        <div className="relative">
                          <FiTarget className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="number"
                            name="passingMarks"
                            value={formData.passingMarks}
                            onChange={handleFormChange}
                            min="0"
                            max={formData.totalMarks}
                            required
                            className="w-full pl-10 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> Start Date & Time
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="datetime-local"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleFormChange}
                          required
                          className="w-full pl-10 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> End Date & Time
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="datetime-local"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleFormChange}
                          required
                          className="w-full pl-10 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions Section */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white flex items-center">
                      <FiMessageSquare className="mr-2 h-5 w-5 text-blue-400" />
                      Instructions
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          instructions: [...formData.instructions, ''],
                        });
                      }}
                      className="flex items-center text-sm text-blue-400 hover:text-blue-300"
                    >
                      <FiPlus className="mr-1" />
                      Add Instruction
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-center group">
                        <div className="w-2 h-2 rounded-full bg-blue-400 mr-3 flex-shrink-0"></div>
                        <input
                          type="text"
                          value={instruction}
                          onChange={(e) => {
                            const newInstructions = [...formData.instructions];
                            newInstructions[index] = e.target.value;
                            setFormData({
                              ...formData,
                              instructions: newInstructions,
                            });
                          }}
                          className="flex-1 bg-gray-700/30 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter instruction..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newInstructions = formData.instructions.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              instructions: newInstructions,
                            });
                          }}
                          className="ml-3 p-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <HiOutlineQuestionMarkCircle className="mr-3 h-6 w-6 text-emerald-400" />
                    Questions ({formData.questions.length})
                    <span className="ml-3 text-sm font-normal text-gray-400">
                      Total Points: {stats.totalPoints}
                    </span>
                  </h2>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-400">
                      Difficulty: <span className="font-medium text-white">{stats.avgDifficulty}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('details')}
                      className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-300 flex items-center transition-colors"
                    >
                      Back to Details
                    </button>
                  </div>
                </div>
                
                {/* Add Question Form */}
                <div className="mb-8 p-6 border border-gray-700 rounded-xl bg-gray-900/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Add New Question</h3>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        currentQuestion.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                        currentQuestion.difficulty === 'hard' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {currentQuestion.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                        {currentQuestion.points} points
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-400">*</span> Question Text
                      </label>
                      <textarea
                        name="questionText"
                        value={currentQuestion.questionText}
                        onChange={handleQuestionChange}
                        rows="3"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your question here..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Question Type
                        </label>
                        <select
                          name="questionType"
                          value={currentQuestion.questionType}
                          onChange={handleQuestionChange}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                          <option value="short-answer">Short Answer</option>
                          <option value="essay">Essay</option>
                          <option value="coding">Coding</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Points
                        </label>
                        <div className="relative">
                          <HiOutlineCalculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="number"
                            name="points"
                            value={currentQuestion.points}
                            onChange={handleQuestionChange}
                            min="1"
                            className="w-full pl-10 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Difficulty
                        </label>
                        <select
                          name="difficulty"
                          value={currentQuestion.difficulty}
                          onChange={handleQuestionChange}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    {/* Options */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-300">
                          <span className="text-red-400">*</span> Options
                        </label>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-gray-400">
                            {currentQuestion.options.filter(opt => opt.text.trim()).length} filled
                          </span>
                          <button
                            type="button"
                            onClick={addOption}
                            className="flex items-center text-sm text-blue-400 hover:text-blue-300"
                          >
                            <FiPlus className="mr-1" />
                            Add Option
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3 group">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="correctAnswer"
                                checked={option.isCorrect}
                                onChange={() => handleCorrectAnswerChange(index)}
                                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 bg-gray-700 border-gray-600"
                              />
                            </div>
                            
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                placeholder={`Option ${index + 1}`}
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                {index + 1}.
                              </span>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="p-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={currentQuestion.options.length <= 2}
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-400">
                        Click the radio button to mark correct answer
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                      >
                        <FiPlus className="mr-2" />
                        Add Question to Exam
                      </button>
                    </div>
                  </div>
                </div>

                {/* Questions List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">
                      Added Questions
                    </h3>
                    <div className="text-sm text-gray-400">
                      {formData.questions.length} of {formData.questions.length} questions
                    </div>
                  </div>
                  
                  {formData.questions.length > 0 ? (
                    <div className="space-y-4">
                      {formData.questions.map((question, index) => (
                        <div 
                          key={question.id || index} 
                          className="bg-gray-700/30 border border-gray-600 rounded-xl p-5 hover:border-emerald-500/50 transition-all duration-300 group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mr-4">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-400/20 flex items-center justify-center">
                                    <span className="text-emerald-400 font-bold">{index + 1}</span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-white mb-2">
                                    {question.questionText}
                                  </h4>
                                  <div className="flex items-center flex-wrap gap-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      question.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                      question.difficulty === 'hard' ? 'bg-rose-500/20 text-rose-400' :
                                      'bg-amber-500/20 text-amber-400'
                                    }`}>
                                      {question.difficulty}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                                      {question.points} points
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                                      {question.questionType}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-300">
                                      {question.options?.filter(opt => opt.text?.trim()).length || 0} options
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete question"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                          
                          {question.explanation && (
                            <div className="ml-12 mt-3 p-3 bg-gray-800/50 rounded-lg border-l-2 border-emerald-500">
                              <p className="text-sm text-gray-300">
                                <span className="font-medium text-emerald-400">Explanation:</span> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-xl">
                      <HiOutlineQuestionMarkCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No questions added yet</p>
                      <p className="text-sm text-gray-500 mt-1">Add your first question above</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <FiSettings className="mr-3 h-6 w-6 text-purple-400" />
                  Advanced Settings
                </h2>
                
                <div className="space-y-8">
                  {/* Exam Behavior */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <HiOutlineAdjustments className="mr-2 h-5 w-5 text-blue-400" />
                      Exam Behavior
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'isProctored', label: 'Enable Proctoring', icon: FiSmartphone, description: 'Monitor students during exam' },
                        { id: 'randomizeQuestions', label: 'Randomize Questions', icon: FiRefreshCw, description: 'Shuffle question order' },
                        { id: 'showResults', label: 'Show Results Immediately', icon: FiEye, description: 'Display scores after submission' },
                        { id: 'allowNavigation', label: 'Allow Navigation', icon: FiChevronRight, description: 'Move between questions' },
                        { id: 'timePerQuestion', label: 'Time Per Question', icon: FiClock, description: 'Individual time limits' },
                        { id: 'showTimer', label: 'Show Timer', icon: FiClock, description: 'Display countdown timer' },
                        { id: 'allowReview', label: 'Allow Review', icon: FiBook, description: 'Review answers before submit' },
                        { id: 'negativeMarking', label: 'Negative Marking', icon: FiAlertCircle, description: 'Deduct marks for wrong answers' },
                      ].map((setting) => (
                        <div key={setting.id} className="flex items-start p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                          <div className="flex-shrink-0 mt-0.5">
                            <input
                              type="checkbox"
                              id={setting.id}
                              checked={formData[setting.id]}
                              onChange={(e) => setFormData({ ...formData, [setting.id]: e.target.checked })}
                              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center">
                              <setting.icon className="h-4 w-4 text-gray-400 mr-2" />
                              <label htmlFor={setting.id} className="text-sm font-medium text-white">
                                {setting.label}
                              </label>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{setting.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <HiOutlineLockClosed className="mr-2 h-5 w-5 text-rose-400" />
                      Security Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">IP Restriction</p>
                            <p className="text-xs text-gray-400">Restrict exam to specific IP ranges</p>
                          </div>
                          <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors">
                            Configure
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">Browser Lock</p>
                            <p className="text-xs text-gray-400">Prevent switching tabs/windows</p>
                          </div>
                          <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors">
                            Enable
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">Access Control</p>
                            <p className="text-xs text-gray-400">Limit exam to specific users/groups</p>
                          </div>
                          <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors">
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <FiEye className="mr-3 h-6 w-6 text-amber-400" />
                  Exam Preview
                </h2>
                
                <div className="space-y-6">
                  {/* Exam Header Preview */}
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{formData.title || 'Exam Title'}</h3>
                        <p className="text-gray-400 mt-1">{formData.subject || 'Subject'}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Total Marks</div>
                        <div className="text-2xl font-bold text-white">{formData.totalMarks}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="text-sm text-gray-400">Duration</div>
                        <div className="text-lg font-bold text-white">{formData.duration} min</div>
                      </div>
                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="text-sm text-gray-400">Questions</div>
                        <div className="text-lg font-bold text-white">{formData.questions.length}</div>
                      </div>
                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="text-sm text-gray-400">Passing Marks</div>
                        <div className="text-lg font-bold text-white">{formData.passingMarks}</div>
                      </div>
                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="text-sm text-gray-400">Attempts</div>
                        <div className="text-lg font-bold text-white">{formData.maxAttempts}</div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions Preview */}
                  {formData.instructions.length > 0 && (
                    <div className="bg-gray-700/30 rounded-xl p-6">
                      <h4 className="text-lg font-medium text-white mb-4">Instructions</h4>
                      <ul className="space-y-2">
                        {formData.instructions.map((instruction, index) => (
                          <li key={index} className="flex items-start text-gray-300">
                            <span className="text-blue-400 mr-2">•</span>
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Questions Preview */}
                  <div className="bg-gray-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-medium text-white mb-4">Questions Preview</h4>
                    {formData.questions.length > 0 ? (
                      <div className="space-y-4">
                        {formData.questions.slice(0, 3).map((question, index) => (
                          <div key={index} className="border-l-2 border-emerald-500 pl-4 py-2">
                            <div className="text-sm text-gray-400 mb-1">Question {index + 1}</div>
                            <p className="text-white">{question.questionText}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-300">
                                {question.points} points
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-300">
                                {question.difficulty}
                              </span>
                            </div>
                          </div>
                        ))}
                        {formData.questions.length > 3 && (
                          <div className="text-center text-gray-400 italic">
                            + {formData.questions.length - 3} more questions
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        No questions added yet
                      </div>
                    )}
                  </div>

                  {/* Exam Settings Preview */}
                  <div className="bg-gray-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-medium text-white mb-4">Exam Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Proctoring</p>
                        <p className="text-white">{formData.isProctored ? 'Enabled' : 'Disabled'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Question Order</p>
                        <p className="text-white">{formData.randomizeQuestions ? 'Randomized' : 'Fixed'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Results Display</p>
                        <p className="text-white">{formData.showResults ? 'Immediate' : 'Delayed'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Navigation</p>
                        <p className="text-white">{formData.allowNavigation ? 'Allowed' : 'Restricted'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-8">
            {/* Exam Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="font-bold text-white mb-6 flex items-center">
                <HiOutlineChartPie className="mr-2 h-5 w-5 text-blue-400" />
                Exam Statistics
              </h3>
              
              <div className="space-y-6">
                {/* Progress Bars */}
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Questions Added</span>
                    <span>{stats.totalQuestions}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.totalQuestions / 20) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stats.totalQuestions >= 10 ? 'Good coverage' : 'Add more questions'}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Total Points</span>
                    <span>{stats.totalPoints}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full"
                      style={{ width: `${Math.min((stats.totalPoints / formData.totalMarks) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Difficulty Distribution */}
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-3">Difficulty Distribution</p>
                  <div className="space-y-2">
                    {['easy', 'medium', 'hard'].map((level) => {
                      const count = formData.questions.filter(q => q.difficulty === level).length;
                      const percentage = formData.questions.length > 0 ? (count / formData.questions.length) * 100 : 0;
                      return (
                        <div key={level}>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span className="capitalize">{level}</span>
                            <span>{count} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                level === 'easy' ? 'bg-emerald-500' :
                                level === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Avg. Difficulty</p>
                    <p className="text-lg font-bold text-white">{stats.avgDifficulty}</p>
                  </div>
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Pass %</p>
                    <p className="text-lg font-bold text-white">{stats.passingPercentage}%</p>
                  </div>
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Est. Time</p>
                    <p className="text-lg font-bold text-white">{stats.estimatedTime}m</p>
                  </div>
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Max Attempts</p>
                    <p className="text-lg font-bold text-white">{formData.maxAttempts}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      title: `${formData.title} (Copy)`,
                      startDate: new Date().toISOString().slice(0, 16),
                      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                    });
                    toast.success('Exam duplicated for editing');
                  }}
                  className="flex flex-col items-center p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-105 group"
                >
                  <HiOutlineDuplicate className="h-6 w-6 text-blue-400 mb-2 group-hover:text-blue-300" />
                  <span className="text-sm text-gray-300 group-hover:text-white">Duplicate</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('preview')}
                  className="flex flex-col items-center p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-105 group"
                >
                  <FiEye className="h-6 w-6 text-emerald-400 mb-2 group-hover:text-emerald-300" />
                  <span className="text-sm text-gray-300 group-hover:text-white">Preview</span>
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="flex flex-col items-center p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-105 group"
                >
                  <HiOutlineDocumentText className="h-6 w-6 text-amber-400 mb-2 group-hover:text-amber-300" />
                  <span className="text-sm text-gray-300 group-hover:text-white">Print</span>
                </button>
                
                <button
                  onClick={() => toast.success('Export feature coming soon')}
                  className="flex flex-col items-center p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-105 group"
                >
                  <FiUpload className="h-6 w-6 text-purple-400 mb-2 group-hover:text-purple-300" />
                  <span className="text-sm text-gray-300 group-hover:text-white">Export</span>
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={() => {
                    // Clear form
                    setFormData({
                      title: '',
                      description: '',
                      subject: '',
                      difficulty: 'medium',
                      duration: 60,
                      totalMarks: 100,
                      passingMarks: 40,
                      startDate: new Date().toISOString().slice(0, 16),
                      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                      maxAttempts: 1,
                      instructions: [],
                      questions: [],
                      isActive: true,
                      isProctored: false,
                      showResults: true,
                      allowNavigation: true,
                      randomizeQuestions: false,
                      timePerQuestion: false,
                      negativeMarking: false,
                      negativeMarkingValue: 0.25,
                      tags: [],
                      category: 'General',
                    });
                    setCurrentQuestion({
                      questionText: '',
                      questionType: 'multiple-choice',
                      points: 1,
                      timeLimit: 60,
                      difficulty: 'medium',
                      explanation: '',
                      tags: [],
                      options: [
                        { text: '', isCorrect: false, imageUrl: '' },
                        { text: '', isCorrect: false, imageUrl: '' },
                        { text: '', isCorrect: true, imageUrl: '' },
                        { text: '', isCorrect: false, imageUrl: '' },
                      ],
                    });
                    toast.success('Form cleared for new exam');
                  }}
                  className="w-full py-2 bg-gray-700/30 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Clear Form
                </button>
              </div>
            </div>

            {/* Status & Tips */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-start mb-4">
                <HiOutlineSparkles className="h-6 w-6 text-blue-400 mr-3" />
                <div>
                  <h3 className="font-bold text-white">Status</h3>
                  <p className="text-xs text-blue-200/80">Exam readiness checklist</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  {formData.title.trim() ? (
                    <FiCheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-500 mr-2"></div>
                  )}
                  <span className={`text-sm ${formData.title.trim() ? 'text-white' : 'text-gray-400'}`}>
                    Title and description
                  </span>
                </div>
                
                <div className="flex items-center">
                  {formData.questions.length > 0 ? (
                    <FiCheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-500 mr-2"></div>
                  )}
                  <span className={`text-sm ${formData.questions.length > 0 ? 'text-white' : 'text-gray-400'}`}>
                    At least 1 question
                  </span>
                </div>
                
                <div className="flex items-center">
                  {formData.questions.length >= 5 ? (
                    <FiCheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-500 mr-2"></div>
                  )}
                  <span className={`text-sm ${formData.questions.length >= 5 ? 'text-white' : 'text-gray-400'}`}>
                    Recommended: 5+ questions
                  </span>
                </div>
                
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full border-2 border-gray-500 mr-2"></div>
                  <span className="text-sm text-gray-400">
                    Set dates and time limits
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-blue-500/20">
                <div className="text-xs text-blue-200/60">
                  <p className="font-medium mb-1">💡 Tip</p>
                  <p>Add clear instructions and set appropriate time limits for best results.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExam;