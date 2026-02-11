import React, { useState } from 'react';
import { 
  FiSettings, FiSave, FiRefreshCw, FiBell, FiShield, 
  FiDatabase, FiUsers, FiGlobe, FiMail, FiLock, 
  FiCloud, FiServer, FiActivity, FiBarChart2, 
  FiUpload, FiDownload, FiArchive, FiKey,
  FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle,
  FiCpu, FiHardDrive, FiMonitor, FiWifi
} from 'react-icons/fi';
import { 
  HiOutlineCog, HiOutlineDocumentText, HiOutlineColorSwatch,
  HiOutlineShieldCheck, HiOutlineCloud, HiOutlineDatabase,
  HiOutlineBell, HiOutlineUserGroup, HiOutlineGlobeAlt,
  HiOutlineLightningBolt, HiOutlineChartBar, HiOutlineKey
} from 'react-icons/hi';
import { MdOutlineSecurity, MdOutlineBackup } from 'react-icons/md';
import { TbSettingsAutomation } from 'react-icons/tb';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'SageExam',
    siteUrl: 'https://sageexam.com',
    siteDescription: 'Secure Online Exam Platform',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Security Settings
    enable2FA: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireComplexPasswords: true,
    ipWhitelist: [],
    enableBruteForceProtection: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    examStartAlerts: true,
    resultAlerts: true,
    proctoringAlerts: true,
    weeklyReports: true,
    
    // System Settings
    maintenanceMode: false,
    enableCaching: true,
    cacheDuration: 3600,
    maxUploadSize: 10, // MB
    enableCompression: true,
    enableCDN: false,
    
    // Database Settings
    backupFrequency: 'daily',
    keepBackups: 30,
    autoCleanup: true,
    encryptionEnabled: true,
    
    // Performance Settings
    enableGzip: true,
    enableMinification: true,
    maxConnections: 100,
    queryCache: true,
    
    // API Settings
    enableAPI: true,
    apiRateLimit: 100,
    apiKeys: [],
    webhookEnabled: false,
    
    // Appearance Settings
    theme: 'dark',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    fontFamily: 'Inter',
    enableAnimations: true,
    customCSS: '',
    
    // Integration Settings
    googleAnalytics: '',
    googleSignin: true,
    githubSignin: true,
    stripeEnabled: false,
    mailchimpEnabled: false,
    
    // Advanced Settings
    debugMode: false,
    verboseLogging: false,
    enableProfiling: false,
    experimentalFeatures: false,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: HiOutlineCog, color: 'from-blue-500 to-cyan-400' },
    { id: 'security', label: 'Security', icon: HiOutlineShieldCheck, color: 'from-emerald-500 to-green-400' },
    { id: 'notifications', label: 'Notifications', icon: HiOutlineBell, color: 'from-amber-500 to-orange-400' },
    { id: 'appearance', label: 'Appearance', icon: HiOutlineColorSwatch, color: 'from-purple-500 to-pink-500' },
    { id: 'performance', label: 'Performance', icon: HiOutlineLightningBolt, color: 'from-rose-500 to-pink-400' },
    { id: 'database', label: 'Database', icon: HiOutlineDatabase, color: 'from-indigo-500 to-purple-400' },
    { id: 'integrations', label: 'Integrations', icon: HiOutlineGlobeAlt, color: 'from-teal-500 to-emerald-400' },
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default settings
      setSettings({
        ...settings,
        // Reset specific settings here
        siteName: 'SageExam',
        siteUrl: 'https://sageexam.com',
        enable2FA: true,
        emailNotifications: true,
        maintenanceMode: false,
      });
      toast.success('Settings reset to defaults');
    }
  };

  const backupDatabase = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Database backup completed successfully');
      setLoading(false);
    }, 2000);
  };

  const clearCache = () => {
    toast.success('Cache cleared successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
                  <HiOutlineCog className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">System Settings</h1>
                  <p className="text-xs text-gray-400">Configure platform preferences</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleResetSettings}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center"
              >
                <FiRefreshCw className="mr-2" />
                Reset
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <FiSave className="mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">System Status</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                  <p className="text-lg font-bold text-white">Operational</p>
                </div>
              </div>
              <FiServer className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Users</p>
                <p className="text-lg font-bold text-white">1,245</p>
              </div>
              <FiUsers className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Storage Used</p>
                <p className="text-lg font-bold text-white">2.4 GB</p>
              </div>
              <FiHardDrive className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Uptime</p>
                <p className="text-lg font-bold text-white">99.9%</p>
              </div>
              <FiActivity className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

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
          {/* Settings Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <HiOutlineCog className="mr-3 h-6 w-6 text-blue-400" />
                      General Settings
                    </h2>
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                      Basic Configuration
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleSettingChange('siteName', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Site URL
                      </label>
                      <input
                        type="url"
                        value={settings.siteUrl}
                        onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="GMT">GMT</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={settings.siteDescription}
                        onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                        rows="3"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <HiOutlineShieldCheck className="mr-3 h-6 w-6 text-emerald-400" />
                      Security Settings
                    </h2>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                      High Priority
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'enable2FA', label: 'Enable Two-Factor Authentication', icon: FiKey, description: 'Add extra security layer for all users' },
                      { id: 'enableBruteForceProtection', label: 'Brute Force Protection', icon: FiShield, description: 'Prevent multiple failed login attempts' },
                      { id: 'requireComplexPasswords', label: 'Require Complex Passwords', icon: FiLock, description: 'Enforce strong password policies' },
                      { id: 'encryptionEnabled', label: 'Data Encryption', icon: FiDatabase, description: 'Encrypt sensitive data at rest' },
                    ].map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center">
                          <setting.icon className="h-5 w-5 text-emerald-400 mr-3" />
                          <div>
                            <label className="text-sm font-medium text-white cursor-pointer" htmlFor={setting.id}>
                              {setting.label}
                            </label>
                            <p className="text-xs text-gray-400">{setting.description}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            id={setting.id}
                            checked={settings[setting.id]}
                            onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                            className="sr-only"
                          />
                          <div 
                            className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                              settings[setting.id] ? 'bg-emerald-500' : 'bg-gray-600'
                            }`}
                            onClick={() => handleSettingChange(setting.id, !settings[setting.id])}
                          >
                            <div 
                              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                settings[setting.id] ? 'transform translate-x-6' : ''
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          value={settings.maxLoginAttempts}
                          onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <HiOutlineBell className="mr-3 h-6 w-6 text-amber-400" />
                      Notification Settings
                    </h2>
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">
                      User Preferences
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'emailNotifications', label: 'Email Notifications', icon: FiMail, description: 'Send email alerts for important events' },
                      { id: 'pushNotifications', label: 'Push Notifications', icon: FiBell, description: 'Enable browser push notifications' },
                      { id: 'examStartAlerts', label: 'Exam Start Alerts', icon: FiActivity, description: 'Notify when exams begin' },
                      { id: 'resultAlerts', label: 'Result Alerts', icon: FiBarChart2, description: 'Alert when results are published' },
                      { id: 'proctoringAlerts', label: 'Proctoring Alerts', icon: FiEye, description: 'Notify about proctoring events' },
                      { id: 'weeklyReports', label: 'Weekly Reports', icon: HiOutlineChartBar, description: 'Send weekly summary emails' },
                    ].map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center">
                          <setting.icon className="h-5 w-5 text-amber-400 mr-3" />
                          <div>
                            <label className="text-sm font-medium text-white cursor-pointer" htmlFor={setting.id}>
                              {setting.label}
                            </label>
                            <p className="text-xs text-gray-400">{setting.description}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            id={setting.id}
                            checked={settings[setting.id]}
                            onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                            className="sr-only"
                          />
                          <div 
                            className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                              settings[setting.id] ? 'bg-amber-500' : 'bg-gray-600'
                            }`}
                            onClick={() => handleSettingChange(setting.id, !settings[setting.id])}
                          >
                            <div 
                              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                settings[setting.id] ? 'transform translate-x-6' : ''
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <HiOutlineColorSwatch className="mr-3 h-6 w-6 text-purple-400" />
                      Appearance Settings
                    </h2>
                    <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                      UI Customization
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Theme
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Font Family
                      </label>
                      <select
                        value={settings.fontFamily}
                        onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Montserrat">Montserrat</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                          className="w-12 h-12 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                          className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                          className="w-12 h-12 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                          className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                        <div className="flex items-center">
                          <HiOutlineLightningBolt className="h-5 w-5 text-purple-400 mr-3" />
                          <div>
                            <label className="text-sm font-medium text-white">Enable Animations</label>
                            <p className="text-xs text-gray-400">Smooth transitions and effects</p>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={settings.enableAnimations}
                            onChange={(e) => handleSettingChange('enableAnimations', e.target.checked)}
                            className="sr-only"
                          />
                          <div 
                            className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                              settings.enableAnimations ? 'bg-purple-500' : 'bg-gray-600'
                            }`}
                            onClick={() => handleSettingChange('enableAnimations', !settings.enableAnimations)}
                          >
                            <div 
                              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                settings.enableAnimations ? 'transform translate-x-6' : ''
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Custom CSS
                      </label>
                      <textarea
                        value={settings.customCSS}
                        onChange={(e) => handleSettingChange('customCSS', e.target.value)}
                        rows="5"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="/* Add custom CSS here */"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Settings */}
              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <HiOutlineLightningBolt className="mr-3 h-6 w-6 text-rose-400" />
                      Performance Settings
                    </h2>
                    <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-400">
                      System Optimization
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'enableCaching', label: 'Enable Caching', icon: FiDatabase, description: 'Cache frequently accessed data' },
                      { id: 'enableCompression', label: 'Enable Compression', icon: FiArchive, description: 'Compress responses for faster loading' },
                      { id: 'enableGzip', label: 'GZIP Compression', icon: FiCloud, description: 'Enable GZIP for text-based assets' },
                      { id: 'enableMinification', label: 'Asset Minification', icon: FiCpu, description: 'Minify CSS and JavaScript files' },
                      { id: 'queryCache', label: 'Query Caching', icon: FiHardDrive, description: 'Cache database queries' },
                      { id: 'enableCDN', label: 'CDN Enabled', icon: FiGlobe, description: 'Use Content Delivery Network' },
                    ].map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center">
                          <setting.icon className="h-5 w-5 text-rose-400 mr-3" />
                          <div>
                            <label className="text-sm font-medium text-white cursor-pointer" htmlFor={setting.id}>
                              {setting.label}
                            </label>
                            <p className="text-xs text-gray-400">{setting.description}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            id={setting.id}
                            checked={settings[setting.id]}
                            onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                            className="sr-only"
                          />
                          <div 
                            className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                              settings[setting.id] ? 'bg-rose-500' : 'bg-gray-600'
                            }`}
                            onClick={() => handleSettingChange(setting.id, !settings[setting.id])}
                          >
                            <div 
                              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                settings[setting.id] ? 'transform translate-x-6' : ''
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cache Duration (seconds)
                        </label>
                        <input
                          type="number"
                          value={settings.cacheDuration}
                          onChange={(e) => handleSettingChange('cacheDuration', parseInt(e.target.value))}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Max Upload Size (MB)
                        </label>
                        <input
                          type="number"
                          value={settings.maxUploadSize}
                          onChange={(e) => handleSettingChange('maxUploadSize', parseInt(e.target.value))}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Database Settings */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <HiOutlineDatabase className="mr-3 h-6 w-6 text-indigo-400" />
                      Database Settings
                    </h2>
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
                      Data Management
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Backup Frequency
                        </label>
                        <select
                          value={settings.backupFrequency}
                          onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Keep Backups (days)
                        </label>
                        <input
                          type="number"
                          value={settings.keepBackups}
                          onChange={(e) => handleSettingChange('keepBackups', parseInt(e.target.value))}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    {[
                      { id: 'autoCleanup', label: 'Auto Cleanup Old Data', icon: FiTrash, description: 'Automatically remove old logs and data' },
                      { id: 'encryptionEnabled', label: 'Database Encryption', icon: FiLock, description: 'Encrypt sensitive database fields' },
                    ].map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center">
                          <setting.icon className="h-5 w-5 text-indigo-400 mr-3" />
                          <div>
                            <label className="text-sm font-medium text-white cursor-pointer" htmlFor={setting.id}>
                              {setting.label}
                            </label>
                            <p className="text-xs text-gray-400">{setting.description}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            id={setting.id}
                            checked={settings[setting.id]}
                            onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                            className="sr-only"
                          />
                          <div 
                            className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                              settings[setting.id] ? 'bg-indigo-500' : 'bg-gray-600'
                            }`}
                            onClick={() => handleSettingChange(setting.id, !settings[setting.id])}
                          >
                            <div 
                              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                settings[setting.id] ? 'transform translate-x-6' : ''
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Integration Settings */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <HiOutlineGlobeAlt className="mr-3 h-6 w-6 text-teal-400" />
                      Integration Settings
                    </h2>
                    <span className="text-xs px-3 py-1 rounded-full bg-teal-500/20 text-teal-400">
                      Third-Party Services
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'googleSignin', label: 'Google Sign-In', icon: FiGlobe, description: 'Allow users to sign in with Google' },
                      { id: 'githubSignin', label: 'GitHub Sign-In', icon: FiGlobe, description: 'Allow users to sign in with GitHub' },
                      { id: 'stripeEnabled', label: 'Stripe Payments', icon: FiKey, description: 'Enable payment processing via Stripe' },
                      { id: 'mailchimpEnabled', label: 'Mailchimp Integration', icon: FiMail, description: 'Sync users with Mailchimp' },
                      { id: 'enableAPI', label: 'REST API', icon: FiServer, description: 'Enable API access for developers' },
                      { id: 'webhookEnabled', label: 'Webhooks', icon: FiActivity, description: 'Enable webhook notifications' },
                    ].map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center">
                          <setting.icon className="h-5 w-5 text-teal-400 mr-3" />
                          <div>
                            <label className="text-sm font-medium text-white cursor-pointer" htmlFor={setting.id}>
                              {setting.label}
                            </label>
                            <p className="text-xs text-gray-400">{setting.description}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            id={setting.id}
                            checked={settings[setting.id]}
                            onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                            className="sr-only"
                          />
                          <div 
                            className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                              settings[setting.id] ? 'bg-teal-500' : 'bg-gray-600'
                            }`}
                            onClick={() => handleSettingChange(setting.id, !settings[setting.id])}
                          >
                            <div 
                              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                settings[setting.id] ? 'transform translate-x-6' : ''
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Google Analytics ID
                      </label>
                      <input
                        type="text"
                        value={settings.googleAnalytics}
                        onChange={(e) => handleSettingChange('googleAnalytics', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="UA-XXXXXXXXX-X"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        API Rate Limit (requests/hour)
                      </label>
                      <input
                        type="number"
                        value={settings.apiRateLimit}
                        onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e.target.value))}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Settings Toggle */}
            <div className="mt-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <TbSettingsAutomation className="mr-2" />
                {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
              </button>
              
              {showAdvanced && (
                <div className="mt-4 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">Advanced Settings</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'debugMode', label: 'Debug Mode', description: 'Enable detailed error reporting' },
                      { id: 'verboseLogging', label: 'Verbose Logging', description: 'Log all system activities' },
                      { id: 'enableProfiling', label: 'Performance Profiling', description: 'Monitor system performance' },
                      { id: 'experimentalFeatures', label: 'Experimental Features', description: 'Enable beta features' },
                    ].map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-white">{setting.label}</label>
                          <p className="text-xs text-gray-400">{setting.description}</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={settings[setting.id]}
                            onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                            className="sr-only"
                          />
                          <div 
                            className={`block w-10 h-5 rounded-full cursor-pointer transition-colors ${
                              settings[setting.id] ? 'bg-blue-500' : 'bg-gray-600'
                            }`}
                            onClick={() => handleSettingChange(setting.id, !settings[setting.id])}
                          >
                            <div 
                              className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${
                                settings[setting.id] ? 'transform translate-x-5' : ''
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Actions & Status */}
          <div className="space-y-8">
            {/* System Actions */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <FiActivity className="mr-2 h-5 w-5 text-blue-400" />
                System Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={backupDatabase}
                  disabled={loading}
                  className="w-full flex items-center justify-center p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors disabled:opacity-50"
                >
                  <MdOutlineBackup className="mr-2" />
                  Backup Database
                </button>
                
                <button
                  onClick={clearCache}
                  className="w-full flex items-center justify-center p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                  <FiRefreshCw className="mr-2" />
                  Clear Cache
                </button>
                
                <button
                  onClick={() => toast.success('System check completed')}
                  className="w-full flex items-center justify-center p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                  <FiCheckCircle className="mr-2" />
                  Run System Check
                </button>
                
                <button
                  onClick={() => handleSettingChange('maintenanceMode', !settings.maintenanceMode)}
                  className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${
                    settings.maintenanceMode
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <FiAlertCircle className="mr-2" />
                  {settings.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="text-xs text-gray-400">
                  <p className="font-medium mb-1">⚠️ Important</p>
                  <p>Some actions may temporarily affect system performance. Perform during low-traffic periods.</p>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <FiServer className="mr-2 h-5 w-5 text-emerald-400" />
                System Status
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Database', status: 'Healthy', value: '100%', color: 'emerald' },
                  { label: 'Cache', status: 'Optimal', value: '78%', color: 'blue' },
                  { label: 'Memory', status: 'Normal', value: '64%', color: 'amber' },
                  { label: 'CPU', status: 'Low', value: '42%', color: 'emerald' },
                  { label: 'Storage', status: 'Warning', value: '82%', color: 'rose' },
                  { label: 'Network', status: 'Stable', value: '95%', color: 'purple' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{item.label}</span>
                      <span className={`text-${item.color}-400`}>{item.status}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r from-${item.color}-500 to-${item.color === 'emerald' ? 'green' : item.color === 'rose' ? 'pink' : item.color}-400`}
                        style={{ width: item.value }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <FiActivity className="mr-2 h-5 w-5 text-purple-400" />
                Recent Activity
              </h3>
              
              <div className="space-y-3">
                {[
                  { time: '2 min ago', action: 'Settings updated', user: 'Admin' },
                  { time: '15 min ago', action: 'Database backup', user: 'System' },
                  { time: '1 hour ago', action: 'User registered', user: 'New User' },
                  { time: '2 hours ago', action: 'Exam created', user: 'Instructor' },
                  { time: '5 hours ago', action: 'System update', user: 'System' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center p-2 hover:bg-gray-700/30 rounded-lg transition-colors">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.action}</p>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{activity.user}</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button className="w-full text-sm text-center text-gray-400 hover:text-white transition-colors">
                  View Full Logs →
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-start mb-4">
                <HiOutlineLightningBolt className="h-6 w-6 text-blue-400 mr-3" />
                <div>
                  <h3 className="font-bold text-white">Quick Tips</h3>
                  <p className="text-xs text-blue-200/80">Best practices</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <FiCheckCircle className="h-4 w-4 text-emerald-400 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-300">Regularly backup your database</p>
                </div>
                
                <div className="flex items-start">
                  <FiCheckCircle className="h-4 w-4 text-emerald-400 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-300">Enable 2FA for admin accounts</p>
                </div>
                
                <div className="flex items-start">
                  <FiCheckCircle className="h-4 w-4 text-emerald-400 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-300">Monitor system logs weekly</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-blue-500/20">
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View Documentation →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;