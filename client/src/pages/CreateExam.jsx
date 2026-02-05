import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI } from '../services/api';
import { FiArrowLeft, FiPlus, FiTrash2, FiSave, FiCopy, FiClock, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreateExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    duration: 60,
    totalMarks: 100,
    passingMarks: 40,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    maxAttempts: 1,
    instructions: ['Read all questions carefully', 'No cheating allowed'],
    questions: [],
    isActive: true,
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    questionType: 'multiple-choice',
    points: 1,
    timeLimit: 60,
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
    ],
  });

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
        title: exam.title,
        description: exam.description,
        subject: exam.subject,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        startDate: new Date(exam.startDate).toISOString().slice(0, 16),
        endDate: new Date(exam.endDate).toISOString().slice(0, 16),
        maxAttempts: exam.maxAttempts,
        instructions: exam.instructions,
        questions: exam.questions,
        isActive: exam.isActive,
      });
      
      setIsEditing(true);
    } catch (error) {
      toast.error('Failed to load exam for editing');
      navigate('/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      questions: [...formData.questions, currentQuestion],
    });

    // Reset current question
    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple-choice',
      points: 1,
      timeLimit: 60,
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
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
      options: [...currentQuestion.options, { text: '', isCorrect: false }],
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

    if (!formData.subject.trim()) {
      toast.error('Please enter subject');
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

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/exams')}
                  className="mr-4 text-primary-600 hover:text-primary-700"
                >
                  <FiArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Edit Exam' : 'Create New Exam'}
                </h1>
              </div>
              <p className="text-gray-600 mt-2">
                {isEditing ? 'Update exam details and questions' : 'Fill in exam details and add questions'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Exam Details Card */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Exam Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    className="input-field"
                    placeholder="e.g., Mathematics Midterm Exam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    required
                    className="input-field"
                    placeholder="e.g., Mathematics, Physics, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    required
                    rows="3"
                    className="input-field"
                    placeholder="Brief description of the exam"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleFormChange}
                        min="1"
                        required
                        className="pl-10 input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Attempts
                    </label>
                    <input
                      type="number"
                      name="maxAttempts"
                      value={formData.maxAttempts}
                      onChange={handleFormChange}
                      min="1"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Marks *
                    </label>
                    <input
                      type="number"
                      name="totalMarks"
                      value={formData.totalMarks}
                      onChange={handleFormChange}
                      min="1"
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passing Marks *
                    </label>
                    <input
                      type="number"
                      name="passingMarks"
                      value={formData.passingMarks}
                      onChange={handleFormChange}
                      min="0"
                      max={formData.totalMarks}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      required
                      className="pl-10 input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time *
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleFormChange}
                      required
                      className="pl-10 input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <div className="space-y-2">
                    {formData.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-center">
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
                          className="flex-1 input-field"
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
                          className="ml-2 p-2 text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          instructions: [...formData.instructions, ''],
                        });
                      }}
                      className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
                    >
                      <FiPlus className="mr-1" />
                      Add Instruction
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Activate exam immediately
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Add Questions Card */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add Questions</h2>
            
            {/* Current Question Form */}
            <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Question</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text *
                  </label>
                  <textarea
                    name="questionText"
                    value={currentQuestion.questionText}
                    onChange={handleQuestionChange}
                    rows="3"
                    className="input-field"
                    placeholder="Enter your question here..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type
                    </label>
                    <select
                      name="questionType"
                      value={currentQuestion.questionType}
                      onChange={handleQuestionChange}
                      className="input-field"
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points
                    </label>
                    <input
                      type="number"
                      name="points"
                      value={currentQuestion.points}
                      onChange={handleQuestionChange}
                      min="1"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Options */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Options *
                    </label>
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <FiPlus className="mr-1" />
                      Add Option
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={option.isCorrect}
                            onChange={() => handleCorrectAnswerChange(index)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                        
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                          className="flex-1 input-field"
                          placeholder={`Option ${index + 1}`}
                        />
                        
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-600 hover:text-red-700"
                          disabled={currentQuestion.options.length <= 2}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <FiPlus className="mr-2" />
                    Add Question to Exam
                  </button>
                </div>
              </div>
            </div>

            {/* Added Questions List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Added Questions ({formData.questions.length})
              </h3>
              
              {formData.questions.length > 0 ? (
                <div className="space-y-4">
                  {formData.questions.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Question {index + 1}: {question.questionText.substring(0, 100)}
                            {question.questionText.length > 100 ? '...' : ''}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span>Type: {question.questionType}</span>
                            <span>Points: {question.points}</span>
                            <span>Options: {question.options.filter(opt => opt.text.trim()).length}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No questions added yet. Add your first question above.</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary Card */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Exam Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{formData.questions.length}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formData.questions.reduce((sum, q) => sum + parseInt(q.points), 0)}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-2xl font-bold text-gray-900">{formData.duration} min</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Pass Percentage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((formData.passingMarks / formData.totalMarks) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/exams')}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    // Clone current exam data for new exam
                    toast.success('Exam data copied for new exam');
                    if (!isEditing) {
                      setFormData({
                        ...formData,
                        title: `${formData.title} (Copy)`,
                        startDate: new Date().toISOString().slice(0, 16),
                        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                      });
                    }
                  }}
                  className="flex items-center px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                >
                  <FiCopy className="mr-2" />
                  Save as Copy
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSave className="mr-2" />
                  {loading ? 'Saving...' : isEditing ? 'Update Exam' : 'Create Exam'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;