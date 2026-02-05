import CryptoJS from 'crypto-js';

// Use environment variables from React (Vite/CRA)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'sage-secure-key-2024-default';

// Encrypt sensitive data (for user data, NOT for JWT tokens)
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Decrypt data
export const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Store token - DO NOT ENCRYPT JWT TOKEN
export const setToken = (token) => {
  // Store the raw JWT token (not encrypted)
  localStorage.setItem('sage_token', token);
  
  // Also set as cookie for server-side usage if needed
  document.cookie = `sage_token=${token}; path=/; max-age=86400; SameSite=Strict${import.meta.env.PROD ? '; Secure' : ''}`;
};

// Get token - Return the raw JWT token
export const getToken = () => {
  try {
    const token = localStorage.getItem('sage_token');
    if (!token) return null;
    
    // Return the raw token (no decryption needed for JWT)
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    removeToken();
    return null;
  }
};

// Remove token
export const removeToken = () => {
  localStorage.removeItem('sage_token');
  localStorage.removeItem('sage_user');
  localStorage.removeItem('rememberedEmail');
  localStorage.removeItem('sage_session');
  
  // Clear cookie
  document.cookie = 'sage_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

// Check authentication with token validation
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Simple check if token is a JWT
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch {
    return false;
  }
};

// Get user role
export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

// Store user data with encryption (this is OK to encrypt)
export const setUser = (user) => {
  const userData = {
    ...user,
    lastLogin: Date.now()
  };
  localStorage.setItem('sage_user', encryptData(userData));
};

// Get user data
export const getUser = () => {
  try {
    const encryptedUser = localStorage.getItem('sage_user');
    if (!encryptedUser) return null;
    return decryptData(encryptedUser);
  } catch (error) {
    console.error('Error decrypting user data:', error);
    return null;
  }
};

// Clear all auth data
export const clearAuth = () => {
  removeToken();
};

// Session management
export const setSession = (data) => {
  localStorage.setItem('sage_session', JSON.stringify({
    ...data,
    createdAt: Date.now()
  }));
};

export const getSession = () => {
  const session = localStorage.getItem('sage_session');
  return session ? JSON.parse(session) : null;
};

// Check if session is still valid (optional)
export const isSessionValid = () => {
  const session = getSession();
  if (!session) return false;
  
  const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours
  return Date.now() - session.createdAt < sessionDuration;
};

// Check if user is admin
export const isAdmin = () => {
  return getUserRole() === 'admin';
};

// Check if user is teacher
export const isTeacher = () => {
  return getUserRole() === 'teacher';
};

// Check if user is student
export const isStudent = () => {
  return getUserRole() === 'student';
};