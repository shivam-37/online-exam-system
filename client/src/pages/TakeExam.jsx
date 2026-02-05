import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI } from '../services/api';
import { FiClock, FiAlertCircle, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startExam();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && exam) {
      handleSubmit();
    }
  }, [timeLeft]);

  const startExam = async () => {
    try {
      const response = await examAPI.startExam(id);
      setExam(response.data.exam);
      setTimeLeft(response.data.duration * 60); // Convert minutes to seconds
      
      // Initialize answers array
      const initialAnswers = response.data.exam.questions.map(() => ({
        selectedOption: null,
        timeTaken: 0,
      }));
      setAnswers(initialAnswers);
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

  const handleSubmit = async () => {
    const timeTaken = (exam.duration * 60) - timeLeft;
    
    try {
      await examAPI.submitExam(id, { answers, timeTaken });
      toast.success('Exam submitted successfully!');
      navigate(`/exam/${id}`);
    } catch (error) {
      toast.error('Failed to submit exam');
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
          <h2 className="text-2xl font-bold text-gray-900">Exam not available</h2>
        </div>
      </div>
    );
  }

  const currentQ = exam.questions[currentQuestion];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Timer Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {exam.questions.length}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-4 py-2 rounded-lg ${
                timeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <FiClock className="mr-2" />
                <span className="font-mono font-bold">
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </span>
              </div>
              
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Questions Navigator */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="grid grid-cols-4 lg:grid-cols-3 gap-2">
                {exam.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium ${
                      currentQuestion === index
                        ? 'bg-primary-600 text-white'
                        : answers[index]?.selectedOption !== null
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Current</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 border border-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-200 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Unanswered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Area */}
          <div className="lg:col-span-3">
            <div className="card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Question {currentQuestion + 1}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {currentQ.questionType === 'multiple-choice' ? 'Multiple Choice' : 
                     currentQ.questionType === 'true-false' ? 'True/False' : 'Short Answer'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  {currentQ.points} point{currentQ.points !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="mb-8">
                <p className="text-lg text-gray-800">{currentQ.questionText}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      answers[currentQuestion]?.selectedOption === index
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        answers[currentQuestion]?.selectedOption === index
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestion]?.selectedOption === index && (
                          <FiCheck className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="text-gray-800">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestion === 0}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    currentQuestion === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={currentQuestion === exam.questions.length - 1}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    currentQuestion === exam.questions.length - 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  Next Question
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;