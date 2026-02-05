import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examAPI } from '../services/api';
import { getUserRole } from '../utils/auth';
import { FiSearch, FiFilter, FiPlus, FiClock, FiCalendar, FiBook } from 'react-icons/fi';
import { format } from 'date-fns';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const userRole = getUserRole();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examAPI.getExams();
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);
    
    let matchesFilter = true;
    if (filter === 'upcoming') {
      matchesFilter = startDate > now;
    } else if (filter === 'ongoing') {
      matchesFilter = startDate <= now && endDate >= now;
    } else if (filter === 'completed') {
      matchesFilter = endDate < now;
    }
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
              <p className="text-gray-600 mt-2">Browse and take available exams</p>
            </div>
            
            {userRole === 'admin' || userRole === 'teacher' ? (
              <Link
                to="/exams/create"
                className="btn-primary flex items-center"
              >
                <FiPlus className="mr-2" />
                Create Exam
              </Link>
            ) : null}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exams by title or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-field"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'upcoming'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('ongoing')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'ongoing'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'completed'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Exams Grid */}
        {filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => {
              const now = new Date();
              const startDate = new Date(exam.startDate);
              const endDate = new Date(exam.endDate);
              const isUpcoming = startDate > now;
              const isOngoing = startDate <= now && endDate >= now;
              const isCompleted = endDate < now;

              return (
                <div key={exam._id} className="card hover:shadow-lg transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{exam.subject}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      isUpcoming ? 'bg-blue-100 text-blue-800' :
                      isOngoing ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {isUpcoming ? 'Upcoming' : isOngoing ? 'Ongoing' : 'Completed'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{exam.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-2" />
                      <span>Duration: {exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-2" />
                      <span>Starts: {format(startDate, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiBook className="mr-2" />
                      <span>Marks: {exam.totalMarks}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-600">
                        Questions: {exam.questions?.length || 0}
                      </span>
                    </div>
                    <Link
                      to={`/exam/${exam._id}`}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        !isOngoing && userRole === 'student'
                          ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                      onClick={(e) => {
                        if (!isOngoing && userRole === 'student') {
                          e.preventDefault();
                        }
                      }}
                    >
                      {userRole === 'admin' || userRole === 'teacher' ? 'Manage' : 
                       isUpcoming ? 'Coming Soon' : 
                       isOngoing ? 'Take Exam' : 'View Results'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiBook className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No exams found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No exams available at the moment'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;