// hooks/useApi.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { examAPI, reportAPI, userAPI, authAPI, settingsAPI } from '../services/api';
import toast from 'react-hot-toast';

// ==================== GENERIC FETCH HOOK ====================
export const useFetch = (apiFunction, params = null, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const fetchCountRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    fetchCountRef.current += 1;
    const currentFetch = fetchCountRef.current;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiFunction(params);
        
        if (mountedRef.current && currentFetch === fetchCountRef.current) {
          // Handle different response structures
          if (response.data?.data) {
            setData(response.data.data);
          } else if (response.data?.exams) {
            setData(response.data.exams);
          } else if (response.data?.reports) {
            setData(response.data.reports);
          } else if (response.data?.users) {
            setData(response.data.users);
          } else {
            setData(response.data);
          }
          setError(null);
        }
      } catch (err) {
        if (mountedRef.current && currentFetch === fetchCountRef.current) {
          setError(err.response?.data?.message || err.message);
          // Don't show toast for 404s
          if (err.response?.status !== 404) {
            toast.error(err.response?.data?.message || 'Failed to fetch data');
          }
        }
      } finally {
        if (mountedRef.current && currentFetch === fetchCountRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, dependencies);

  return { data, loading, error, setData };
};

// ==================== MUTATION HOOK ====================
export const useMutation = (apiFunction, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(params);
      setData(response.data);
      
      if (options.onSuccess) {
        options.onSuccess(response.data);
      }
      
      if (options.showToast !== false) {
        toast.success(options.successMessage || 'Operation completed successfully');
      }
      
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      
      if (options.onError) {
        options.onError(err);
      }
      
      if (options.showToast !== false) {
        toast.error(message);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options]);

  return { mutate, loading, error, data };
};

// ==================== AUTH HOOKS ====================
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('sage_token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await authAPI.getMe();
        setUser(response.data.user || response.data);
      } catch (err) {
        console.error('Auth error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateProfile = useMutation(authAPI.updateProfile, {
    onSuccess: (data) => {
      setUser(data.user || data);
    }
  });

  const logout = useMutation(authAPI.logout, {
    onSuccess: () => {
      localStorage.removeItem('sage_token');
      localStorage.removeItem('sage_user');
      window.location.href = '/login';
    }
  });

  return { user, loading, error, updateProfile, logout, setUser };
};

// ==================== EXAM HOOKS ====================
export const useExams = (filters = {}) => {
  const { data, loading, error, setData } = useFetch(
    (params) => examAPI.getExams(params),
    filters,
    [JSON.stringify(filters)]
  );

  const createExam = useMutation(examAPI.createExam, {
    onSuccess: (data) => {
      setData(prev => ({
        ...prev,
        data: [data.exam || data, ...(prev?.data || [])]
      }));
    }
  });

  const updateExam = useMutation(({ id, ...data }) => examAPI.updateExam(id, data));
  const deleteExam = useMutation(examAPI.deleteExam);
  const startExam = useMutation(examAPI.startExam);
  const submitExam = useMutation(({ id, ...data }) => examAPI.submitExam(id, data));

  return {
    exams: Array.isArray(data) ? data : data?.data || [],
    total: data?.total || 0,
    loading,
    error,
    createExam,
    updateExam,
    deleteExam,
    startExam,
    submitExam,
    setExams: setData
  };
};

export const useExam = (id) => {
  const { data, loading, error, setData } = useFetch(
    () => examAPI.getExam(id),
    null,
    [id]
  );

  const updateExam = useMutation((examData) => examAPI.updateExam(id, examData), {
    onSuccess: (data) => {
      setData(data.exam || data);
    }
  });

  const deleteExam = useMutation(() => examAPI.deleteExam(id));
  const startExam = useMutation(() => examAPI.startExam(id));
  const submitExam = useMutation((examData) => examAPI.submitExam(id, examData));

  return {
    exam: data?.exam || data,
    loading,
    error,
    updateExam,
    deleteExam,
    startExam,
    submitExam,
    setExam: setData
  };
};

// ==================== REPORT HOOKS ====================
export const useReports = (filters = {}) => {
  const { data, loading, error } = useFetch(
    (params) => reportAPI.getMyReports(params),
    filters,
    [JSON.stringify(filters)]
  );

  return {
    reports: Array.isArray(data) ? data : data?.data || [],
    total: data?.total || 0,
    loading,
    error
  };
};

export const useAllReports = (filters = {}) => {
  const { data, loading, error } = useFetch(
    (params) => reportAPI.getAllReports(params),
    filters,
    [JSON.stringify(filters)]
  );

  return {
    reports: Array.isArray(data) ? data : data?.data || [],
    total: data?.total || 0,
    loading,
    error
  };
};

export const useReport = (id) => {
  const { data, loading, error } = useFetch(
    () => reportAPI.getReport(id),
    null,
    [id]
  );

  return {
    report: data?.report || data,
    loading,
    error
  };
};

// ==================== USER HOOKS ====================
export const useUsers = (filters = {}) => {
  const { data, loading, error, setData } = useFetch(
    (params) => userAPI.getUsers(params),
    filters,
    [JSON.stringify(filters)]
  );

  const createUser = useMutation(userAPI.createUser, {
    onSuccess: (data) => {
      setData(prev => ({
        ...prev,
        data: [data.user || data, ...(prev?.data || [])]
      }));
    }
  });

  const updateUser = useMutation(({ id, ...userData }) => userAPI.updateUser(id, userData));
  const deleteUser = useMutation(userAPI.deleteUser);

  return {
    users: Array.isArray(data) ? data : data?.data || [],
    total: data?.total || 0,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    setUsers: setData
  };
};

export const useProfile = () => {
  const { data, loading, error, setData } = useFetch(userAPI.getProfile, null, []);

  const updateProfile = useMutation(userAPI.updateProfile, {
    onSuccess: (data) => {
      setData(data.user || data);
      toast.success('Profile updated successfully');
    }
  });

  return {
    profile: data?.user || data,
    loading,
    error,
    updateProfile,
    setProfile: setData
  };
};

// ==================== DASHBOARD HOOK ====================
export const useDashboardData = () => {
  const [stats, setStats] = useState({
    totalExams: 0,
    attemptedExams: 0,
    averageScore: 0,
    passedExams: 0,
    rank: 0,
    totalQuestions: 0,
    accuracy: 0,
    streak: 0,
    timeSpent: 0,
    percentile: 0,
    weeklyProgress: 0,
    focusTime: 0,
    productivity: 0,
    completionRate: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { exams, loading: examsLoading } = useExams();
  const { reports, loading: reportsLoading } = useReports();
  const { profile, loading: profileLoading } = useProfile();

  useEffect(() => {
    if (!examsLoading && !reportsLoading && !profileLoading) {
      try {
        const attemptedExams = new Set(
          reports?.map(r => r.exam?._id).filter(Boolean) || []
        ).size;
        
        const totalQuestions = reports?.reduce((acc, r) => acc + (r.totalQuestions || 0), 0) || 0;
        const correctQuestions = reports?.reduce((acc, r) => acc + (r.correctAnswers || 0), 0) || 0;
        const accuracy = totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0;
        const averageScore = reports?.length > 0 
          ? reports.reduce((acc, r) => acc + (r.percentage || 0), 0) / reports.length 
          : 0;
        
        const streak = localStorage.getItem('studyStreak') || 0;
        const timeSpent = reports?.reduce((acc, r) => acc + (r.timeTaken || 0), 0) || 0;
        const rank = Math.floor(Math.random() * 100) + 1;
        const percentile = Math.floor(Math.random() * 30) + 70;
        const focusTime = Math.floor(timeSpent * 0.85);
        const productivity = Math.min(accuracy * 1.5, 100);
        const completionRate = exams?.length > 0 ? (attemptedExams / exams.length) * 100 : 0;
        
        setStats({
          totalExams: exams?.length || 0,
          attemptedExams,
          averageScore,
          passedExams: reports?.filter(r => r.passed).length || 0,
          rank,
          totalQuestions,
          accuracy,
          streak: Number(streak),
          timeSpent,
          percentile,
          weeklyProgress: 25 + Math.floor(Math.random() * 30),
          focusTime,
          productivity,
          completionRate,
        });
      } catch (err) {
        console.error('Error calculating dashboard stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [exams, reports, profile, examsLoading, reportsLoading, profileLoading]);

  return { 
    stats, 
    loading, 
    error, 
    exams: exams || [], 
    reports: reports || [],
    profile 
  };
};