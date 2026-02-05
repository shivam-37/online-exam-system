import React, { useState } from 'react';
import { FiAward, FiTrendingUp, FiStar, FiUsers, FiChevronUp, FiChevronDown } from 'react-icons/fi';
// Removed FiTrophy and using FiAward instead

const LeaderboardTab = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [category, setCategory] = useState('overall');

  const leaderboardData = [
    {
      rank: 1,
      name: 'Alex Johnson',
      score: 98.5,
      exams: 24,
      streak: 14,
      change: 'up',
      badge: 'top'
    },
    {
      rank: 2,
      name: 'Sarah Williams',
      score: 96.2,
      exams: 22,
      streak: 12,
      change: 'up',
      badge: 'rising'
    },
    {
      rank: 3,
      name: 'Michael Chen',
      score: 94.8,
      exams: 20,
      streak: 10,
      change: 'down',
      badge: null
    },
    {
      rank: 4,
      name: 'Emma Davis',
      score: 93.5,
      exams: 18,
      streak: 8,
      change: 'up',
      badge: 'rising'
    },
    {
      rank: 5,
      name: 'David Brown',
      score: 92.1,
      exams: 16,
      streak: 6,
      change: 'same',
      badge: null
    },
    {
      rank: 6,
      name: 'You',
      score: 88.7,
      exams: 15,
      streak: 5,
      change: 'up',
      badge: 'self'
    },
    {
      rank: 7,
      name: 'Lisa Wilson',
      score: 87.3,
      exams: 14,
      streak: 7,
      change: 'down',
      badge: null
    },
    {
      rank: 8,
      name: 'Robert Taylor',
      score: 85.9,
      exams: 13,
      streak: 4,
      change: 'up',
      badge: null
    },
    {
      rank: 9,
      name: 'Jennifer Lee',
      score: 84.2,
      exams: 12,
      streak: 9,
      change: 'same',
      badge: null
    },
    {
      rank: 10,
      name: 'James Miller',
      score: 82.7,
      exams: 11,
      streak: 3,
      change: 'down',
      badge: null
    },
  ];

  const categories = [
    { id: 'overall', name: 'Overall', icon: FiAward },
    { id: 'math', name: 'Mathematics', icon: FiTrendingUp },
    { id: 'science', name: 'Science', icon: FiStar },
    { id: 'english', name: 'English', icon: FiAward },
    { id: 'streak', name: 'Study Streak', icon: FiUsers },
  ];

  const userRank = leaderboardData.find(user => user.badge === 'self');
  const topThree = leaderboardData.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Leaderboard</h2>
            <p className="opacity-90 mt-2">Compete with peers and track your progress</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <FiAward className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Second Place */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-4">
            <span className="text-2xl font-bold text-gray-700">2</span>
          </div>
          {topThree[1] && (
            <>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                {topThree[1].name.charAt(0)}
              </div>
              <h3 className="font-bold text-gray-900">{topThree[1].name}</h3>
              <div className="text-3xl font-bold text-gray-900 my-3">{topThree[1].score}</div>
              <div className="flex items-center justify-center text-green-600">
                <FiChevronUp />
                <span className="text-sm font-medium">Rising</span>
              </div>
            </>
          )}
        </div>

        {/* First Place */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full">
              <FiAward className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full mb-4">
            <span className="text-2xl font-bold text-amber-700">1</span>
          </div>
          {topThree[0] && (
            <>
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center text-white font-bold text-xl">
                {topThree[0].name.charAt(0)}
              </div>
              <h3 className="font-bold text-gray-900">{topThree[0].name}</h3>
              <div className="text-4xl font-bold text-gray-900 my-3">{topThree[0].score}</div>
              <div className="flex items-center justify-center text-green-600">
                <FiChevronUp />
                <span className="text-sm font-medium">Top Performer</span>
              </div>
            </>
          )}
        </div>

        {/* Third Place */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full mb-4">
            <span className="text-2xl font-bold text-orange-700">3</span>
          </div>
          {topThree[2] && (
            <>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold">
                {topThree[2].name.charAt(0)}
              </div>
              <h3 className="font-bold text-gray-900">{topThree[2].name}</h3>
              <div className="text-3xl font-bold text-gray-900 my-3">{topThree[2].score}</div>
              <div className="flex items-center justify-center text-red-600">
                <FiChevronDown />
                <span className="text-sm font-medium">Falling</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Your Rank Card */}
      {userRank && (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <span className="text-2xl font-bold">#{userRank.rank}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Your Position</h3>
                <p className="opacity-90">You're in the top 10% of all students</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{userRank.score}</div>
              <div className="text-sm opacity-90">Average Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Categories & Timeframe */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900">Global Leaderboard</h3>
              <div className="flex space-x-2">
                {['daily', 'weekly', 'monthly', 'all'].map((period) => (
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

            {/* Leaderboard Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exams
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Streak
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboardData.map((user) => (
                    <tr 
                      key={user.rank} 
                      className={`hover:bg-gray-50 ${
                        user.badge === 'self' ? 'bg-gradient-to-r from-blue-50 to-cyan-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className={`font-bold ${
                            user.rank <= 3 ? 'text-amber-600' : 'text-gray-600'
                          }`}>
                            #{user.rank}
                          </span>
                          {user.badge === 'top' && (
                            <FiAward className="h-4 w-4 text-amber-500 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold mr-3">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name} {user.badge === 'self' && '(You)'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-lg font-semibold text-gray-900">{user.score}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{user.exams}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-xs font-medium">
                          {user.streak} days
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {user.change === 'up' ? (
                            <div className="flex items-center text-green-600">
                              <FiChevronUp className="mr-1" />
                              <span className="text-sm">Rising</span>
                            </div>
                          ) : user.change === 'down' ? (
                            <div className="flex items-center text-red-600">
                              <FiChevronDown className="mr-1" />
                              <span className="text-sm">Falling</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">Stable</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 ${
                      category === cat.id
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        category === cat.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon />
                      </div>
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </div>
                    <span className="text-gray-500">→</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Your Achievements</h3>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600 mr-3">
                  <FiAward />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Top 10 Ranking</p>
                  <p className="text-sm text-gray-600">In top 10% of students</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                  <FiTrendingUp />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Consistent Improver</p>
                  <p className="text-sm text-gray-600">Score increased by 15%</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                  <FiStar />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Study Streak</p>
                  <p className="text-sm text-gray-600">5+ days active streak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTab;