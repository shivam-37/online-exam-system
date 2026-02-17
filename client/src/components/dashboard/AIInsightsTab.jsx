import React, { useState } from 'react';
import { FiTrendingUp, FiTarget, FiClock, FiZap, FiPieChart, FiBarChart2, FiCalendar, FiActivity } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AIInsightsTab = ({ reports, userId }) => {
  const [timeframe, setTimeframe] = useState('week');

  // Mock data for charts
  const performanceData = [
    { date: 'Mon', score: 65, avgScore: 72 },
    { date: 'Tue', score: 78, avgScore: 75 },
    { date: 'Wed', score: 82, avgScore: 74 },
    { date: 'Thu', score: 71, avgScore: 73 },
    { date: 'Fri', score: 85, avgScore: 76 },
    { date: 'Sat', score: 88, avgScore: 77 },
    { date: 'Sun', score: 90, avgScore: 78 },
  ];

  const subjectData = [
    { subject: 'Mathematics', score: 85, avgScore: 72 },
    { subject: 'Science', score: 78, avgScore: 70 },
    { subject: 'English', score: 65, avgScore: 75 },
    { subject: 'History', score: 92, avgScore: 68 },
    { subject: 'Computer Science', score: 88, avgScore: 80 },
  ];

  const difficultyData = [
    { name: 'Easy', value: 30, color: '#10B981' },
    { name: 'Medium', value: 50, color: '#3B82F6' },
    { name: 'Hard', value: 20, color: '#EF4444' },
  ];

  const insights = {
    strengths: [
      { subject: 'Mathematics', improvement: '+12%', trend: 'up' },
      { subject: 'Logical Reasoning', improvement: '+8%', trend: 'up' },
      { subject: 'Data Analysis', improvement: '+15%', trend: 'up' },
    ],
    weaknesses: [
      { subject: 'Vocabulary', improvement: '-5%', trend: 'down' },
      { subject: 'Time Management', improvement: '-8%', trend: 'down' },
      { subject: 'Reading Comprehension', improvement: '-3%', trend: 'down' },
    ],
    suggestions: [
      'Practice vocabulary exercises for 20 minutes daily',
      'Take timed practice tests to improve speed',
      'Focus on reading comprehension passages',
      'Review mathematical formulas regularly',
      'Attempt more mock tests in exam conditions',
    ],
    predictedScore: 85,
    studyHoursNeeded: 15,
    nextBestExam: 'Advanced Mathematics',
    readinessScore: 78,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
            <p className="opacity-90 mt-2">Personalized recommendations based on your performance patterns</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Powered by AI</span>
            <FiZap className="h-6 w-6 opacity-80" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Predicted Next Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{insights.predictedScore}%</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-50">
              <FiTrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Readiness Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{insights.readinessScore}/100</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50">
              <FiTarget className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Study Hours Needed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{insights.studyHoursNeeded}h</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50">
              <FiClock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Next Best Exam</p>
              <p className="text-lg font-bold text-gray-900 mt-2">{insights.nextBestExam}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50">
              <FiActivity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Performance Trend</h3>
            <div className="flex space-x-2">
              {['week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    timeframe === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Your Score"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#94A3B8" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name="Class Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Subject Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="subject" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="score" 
                  name="Your Score" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="avgScore" 
                  name="Average" 
                  fill="#94A3B8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <FiTrendingUp className="mr-2 text-green-600" /> Your Strengths
          </h3>
          <div className="space-y-4">
            {insights.strengths.map((strength, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{strength.subject}</span>
                    <div className="text-sm text-green-600 mt-1">
                      <span className="font-medium">{strength.improvement}</span> improvement
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Strong
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <FiTarget className="mr-2 text-amber-600" /> Areas to Improve
          </h3>
          <div className="space-y-4">
            {insights.weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="flex items-center">
                  <div className="p-2 bg-amber-100 rounded-lg mr-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{weakness.subject}</span>
                    <div className="text-sm text-amber-600 mt-1">
                      <span className="font-medium">{weakness.improvement}</span> from last test
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  Focus
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center">
          <FiZap className="mr-2 text-blue-600" /> AI Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.suggestions.map((suggestion, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <div className="flex items-start">
                <div className="p-2 bg-white rounded-lg mr-3 flex-shrink-0 shadow-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <p className="text-gray-700">{suggestion}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-900">Personalized Study Plan</h4>
              <p className="text-sm text-gray-600 mt-1">Based on your performance patterns</p>
            </div>
            <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200">
              Generate Study Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsTab;