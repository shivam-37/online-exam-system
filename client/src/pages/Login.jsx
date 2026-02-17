import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setToken, setUser, setSession } from '../utils/auth';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import validator from 'validator';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recaptchaRef = useRef();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  const { email, password, rememberMe } = formData;

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.title = 'X Exams | Sign In';

    const attempts = localStorage.getItem('loginAttempts');
    const lockUntil = localStorage.getItem('lockUntil');

    if (attempts) setLoginAttempts(parseInt(attempts));
    if (lockUntil && Date.now() < parseInt(lockUntil)) {
      setIsLocked(true);
      setLockTime(parseInt(lockUntil) - Date.now());
    }

    document.getElementById('email')?.focus();
  }, []);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, []);

  useEffect(() => {
    if (!isLocked) return;

    const timer = setInterval(() => {
      const remaining = lockTime - 1000;
      setLockTime(remaining);

      if (remaining <= 0) {
        setIsLocked(false);
        setLoginAttempts(0);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockUntil');
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, lockTime]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validator.isEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      toast.error(`Account is locked. Please try again in ${Math.ceil(lockTime / 1000)} seconds.`);
      return;
    }

    if (!validateForm()) return;

    if (loginAttempts >= 5 && !recaptchaToken) {
      toast.error('Please complete the CAPTCHA to continue');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login({
        email,
        password,
        recaptchaToken,
        userAgent: navigator.userAgent,
        ip: await getClientIP()
      });

      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockUntil');
      setLoginAttempts(0);

      setToken(response.data.token);
      setUser(response.data.user);
      setSession({
        lastActivity: Date.now(),
        deviceInfo: navigator.userAgent
      });

      localStorage.setItem('lastLogin', Date.now());

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberMeToken', btoa(`${email}:${Date.now()}`));
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberMeToken');
      }

      toast.success('Welcome back to Sage Exams! Redirecting...');

      recaptchaRef.current?.reset();
      setRecaptchaToken('');

      const from = location.state?.from?.pathname || '/dashboard';

      setTimeout(() => {
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from);
        }
      }, 1500);

    } catch (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts);

      if (newAttempts >= 5) {
        const lockDuration = 5 * 60 * 1000;
        const lockUntil = Date.now() + lockDuration;
        localStorage.setItem('lockUntil', lockUntil);
        setIsLocked(true);
        setLockTime(lockDuration);

        toast.error('Too many failed attempts. Account locked for 5 minutes.');
      } else {
        toast.error(error.response?.data?.message || 'Invalid credentials. Please try again.');
      }

      recaptchaRef.current?.reset();
      setRecaptchaToken('');

    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    toast.loading('Redirecting to GitHub...');
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauth_state', state);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github?state=${state}`;
  };

  const handleGoogleLogin = () => {
    toast.loading('Redirecting to Google...');
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauth_state', state);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?state=${state}`;
  };

  const formatTime = (ms) => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Modern Exam Platform Logo */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center shadow-2xl shadow-blue-600/30">
                <div className="relative">
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-2xl blur-2xl opacity-30"></div>
            </div>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-3">
            X Exams
          </h1>
          <p className="text-gray-400 font-medium">
            Secure Online Assessment Platform
          </p>
          <div className="mt-4 inline-flex items-center text-sm text-blue-400 bg-blue-900/30 px-4 py-2 rounded-full">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Sign in to access your exams
          </div>
        </div>

        {loginAttempts >= 3 && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-yellow-300 text-sm">
                {loginAttempts} failed attempt{loginAttempts > 1 ? 's' : ''}. {loginAttempts >= 5 ? 'Account temporarily locked.' : 'Please check your credentials.'}
              </span>
            </div>
          </div>
        )}

        <div className="bg-gray-800/40 backdrop-blur-sm py-10 px-8 sm:px-12 shadow-2xl rounded-3xl border border-gray-700/30">
          {isLocked ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-900/20 border border-red-700/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Account Temporarily Locked</h3>
              <p className="text-gray-400 mb-4">
                Too many failed login attempts. Please try again in:
              </p>
              <div className="text-2xl font-bold text-emerald-400 mb-6">
                {formatTime(lockTime)}
              </div>
              <p className="text-gray-500 text-sm">
                For immediate access, contact support or try resetting your password.
              </p>
            </div>
          ) : (
            <>
              <form className="space-y-7" onSubmit={onSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-3">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        Email Address
                      </div>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={onChange}
                      className={`block w-full px-4 py-3.5 border ${errors.email ? 'border-red-500' : 'border-gray-700'
                        } bg-gray-900/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 rounded-xl transition-all duration-200 shadow-inner`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-200">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Password
                        </div>
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={onChange}
                        className={`block w-full px-4 py-3.5 border ${errors.password ? 'border-red-500' : 'border-gray-700'
                          } bg-gray-900/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 rounded-xl transition-all duration-200 shadow-inner pr-12`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-blue-300 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <svg
                          className={`h-5 w-5 ${showPassword ? 'text-blue-400' : 'text-gray-500'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {showPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          )}
                        </svg>
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {loginAttempts >= 3 && import.meta.env.VITE_RECAPTCHA_SITE_KEY && (
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      onChange={(token) => setRecaptchaToken(token)}
                      theme="dark"
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={onChange}
                    className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-600 rounded bg-gray-900/50"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-300">
                    Remember me on this device
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-700/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      'Access Exams'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-10">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-800/40 text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="group w-full inline-flex justify-center items-center py-3.5 px-4 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-all duration-200 hover:border-blue-500/30"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="group-hover:text-white transition-colors">Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGitHubLogin}
                    className="group w-full inline-flex justify-center items-center py-3.5 px-4 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-all duration-200 hover:border-blue-500/30"
                  >
                    <svg className="w-5 h-5 mr-3 fill-current text-gray-300 group-hover:text-white" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="group-hover:text-white transition-colors">GitHub</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="mt-10 pt-8 border-t border-gray-700/50">
            <p className="text-center text-sm text-gray-400">
              New to Sage Exams?{' '}
              <Link
                to="/register"
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center text-xs text-gray-500 bg-gray-900/30 px-5 py-3 rounded-xl border border-gray-700/50">
              <svg className="w-4 h-4 mr-2 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure exam platform with end-to-end encryption</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>

        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(30, 58, 138, 0.2) 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm font-medium">
          Secure online assessments for institutions and organizations
        </p>
        <p className="text-gray-600 text-xs mt-2">
          ISO 27001 Certified • GDPR Compliant • SOC 2 Type II
        </p>
      </div>
    </div>
  );
};

export default Login;