import React, { useState } from 'react';
import { FiTarget, FiClock, FiTrendingUp, FiBarChart2, FiFilter, FiPlay, FiBookOpen, FiCheckCircle } from 'react-icons/fi';

const PracticeTestsTab = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Tests', count: 24 },
    { id: 'math', name: 'Mathematics', count: 8 },
    { id: 'science', name: 'Science', count: 6 },
    { id: 'english', name: 'English', count: 5 },
    { id: 'programming', name: 'Programming', count: 5 },
  ];

  const practiceTests = [
    {
      id: 1,
      title: 'Algebra Fundamentals',
      category: 'math',
      questions: 20,
      duration: 30,
      difficulty: 'Beginner',
      completed: true,
      bestScore: 85,
      attempts: 3,
      lastAttempt: '2024-01-15',
    },
    {
      id: 2,
      title: 'Physics Basics',
      category: 'science',
      questions: 25,
      duration: 40,
      difficulty: 'Beginner',
      completed: true,
      bestScore: 78,
      attempts: 2,
      lastAttempt: '2024-01-14',
    },
    {
      id: 3,
      title: 'Advanced Calculus',
      category: 'math',
      questions: 30,
      duration: 45,
      difficulty: 'Advanced',
      completed: false,
      bestScore: 0,
      attempts: 0,
      lastAttempt: null,
    },
    {
      id: 4,
      title: 'Grammar Mastery',
      category: 'english',
      questions: 15,
      duration: 20,
      difficulty: 'Intermediate',
      completed: true,
      bestScore: 92,
      attempts: 1,
      lastAttempt: '2024-01-13',
    },
    {
      id: 5,
      title: 'Data Structures',
      category: 'programming',
      questions: 35,
      duration: 60,
      difficulty: 'Advanced',
      completed: false,
      bestScore: 0,
      attempts: 0,
      lastAttempt: null,
    },
    {
      id: 6,
      title: 'Chemistry Fundamentals',
      category: 'science',
      questions: 22,
      duration: 35,
      difficulty: 'Beginner',
      completed: false,
      bestScore: 0,
      attempts: 0,
      lastAttempt: null,
    },
  ];

  const filteredTests = activeCategory === 'all' 
    ? practiceTests 
    : practiceTests.filter(test => test.category === activeCategory);

  const stats = {
    totalTests: 24,
    completed: 12,
    averageScore: 78,
    totalTime: 450,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Practice Tests</h2>
            <p className="opacity-90 mt-2">Sharpen your skills with topic-wise practice</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <FiTarget className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTests}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50">
              <FiBookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
              <div className="text-sm text-green-600 mt-1">
                {Math.round((stats.completed / stats.totalTests) * 100)}% progress
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-50">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageScore}%</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50">
              <FiBarChart2 className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Time Spent</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTime}m</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50">
              <FiClock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900">Filter by Category</h3>
          <FiFilter className="text-gray-400" />
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-500/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              <span className="ml-2 text-sm opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Practice Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div key={test.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-900">{test.title}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full mt-2 inline-block ${
                  test.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                  test.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {test.difficulty}
                </span>
              </div>
              {test.completed && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Completed
                </span>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Questions</span>
                <span className="font-medium text-gray-900">{test.questions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium text-gray-900">{test.duration} mins</span>
              </div>
              {test.completed && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Best Score</span>
                    <span className="font-medium text-green-600">{test.bestScore}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Attempts</span>
                    <span className="font-medium text-gray-900">{test.attempts}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-3">
              <button className={`flex-1 py-2 px-4 rounded-xl font-medium flex items-center justify-center ${
                test.completed
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
                  : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30'
              } transition-all duration-200`}>
                <FiPlay className="mr-2" />
                {test.completed ? 'Retake Test' : 'Start Test'}
              </button>
              {test.completed && (
                <button className="py-2 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  View Report
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Adaptive Learning */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-gray-900">Adaptive Learning Path</h3>
            <p className="text-gray-600 mt-1">Tests adjust based on your performance</p>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200">
            Generate Custom Test
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-3">
                <FiTrendingUp />
              </div>
              <div>
                <p className="font-medium text-gray-900">Weak Areas</p>
                <p className="text-sm text-gray-600">Targeted practice</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-3">
                <FiTarget />
              </div>
              <div>
                <p className="font-medium text-gray-900">Progress Tracking</p>
                <p className="text-sm text-gray-600">Monitor improvement</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-3">
                <FiBarChart2 />
              </div>
              <div>
                <p className="font-medium text-gray-900">Smart Recommendations</p>
                <p className="text-sm text-gray-600">AI-powered suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeTestsTab;