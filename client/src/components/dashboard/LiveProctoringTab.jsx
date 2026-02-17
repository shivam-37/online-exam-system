import React, { useState, useEffect } from 'react';
import { FiVideo, FiEye, FiAlertCircle, FiCheckCircle, FiCamera, FiMonitor, FiUserCheck } from 'react-icons/fi';

const LiveProctoringTab = ({ userId }) => {
  const [proctoringStatus, setProctoringStatus] = useState({
    active: false,
    violations: 0,
    lastCheck: new Date(),
    cameraStatus: 'connected',
    micStatus: 'connected',
    screenStatus: 'shared',
  });

  const [testSession, setTestSession] = useState(false);

  const startProctoringTest = () => {
    setTestSession(true);
    setProctoringStatus(prev => ({
      ...prev,
      active: true,
      violations: 0,
    }));

    // Simulate proctoring updates
    const interval = setInterval(() => {
      setProctoringStatus(prev => ({
        ...prev,
        lastCheck: new Date(),
        violations: Math.random() > 0.8 ? prev.violations + 1 : prev.violations,
      }));
    }, 5000);

    // Clear after 1 minute (for demo)
    setTimeout(() => {
      clearInterval(interval);
      setTestSession(false);
      setProctoringStatus(prev => ({ ...prev, active: false }));
    }, 60000);

    return () => clearInterval(interval);
  };

  const proctoringFeatures = [
    {
      icon: FiCamera,
      title: 'Facial Recognition',
      description: 'Continuous identity verification',
      status: proctoringStatus.cameraStatus,
      color: 'blue',
      value: 95,
    },
    {
      icon: FiMonitor,
      title: 'Screen Monitoring',
      description: 'Detects unauthorized windows',
      status: proctoringStatus.screenStatus,
      color: 'green',
      value: 98,
    },
    {
      icon: FiUserCheck,
      title: 'Behavior Analysis',
      description: 'AI-powered suspicious activity detection',
      status: 'active',
      color: 'purple',
      value: 92,
    },
    {
      icon: FiAlertCircle,
      title: 'Environment Check',
      description: 'Background noise and movement detection',
      status: 'ready',
      color: 'amber',
      value: 88,
    },
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      amber: 'bg-amber-100 text-amber-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Live Proctoring System</h2>
            <p className="opacity-90 mt-2">AI-powered exam monitoring for secure assessments</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={startProctoringTest}
              disabled={testSession}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                testSession
                  ? 'bg-white/20 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg'
              }`}
            >
              {testSession ? 'Proctoring Active...' : 'Start Proctoring Test'}
            </button>
          </div>
        </div>
      </div>

      {/* Proctoring Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {proctoringFeatures.map((feature, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${getColorClass(feature.color)}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {feature.status}
              </span>
            </div>
            <h3 className="font-bold text-gray-900">{feature.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Accuracy</span>
                <span className="font-semibold text-gray-900">{feature.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    feature.color === 'blue' ? 'bg-blue-500' :
                    feature.color === 'green' ? 'bg-green-500' :
                    feature.color === 'purple' ? 'bg-purple-500' :
                    'bg-amber-500'
                  }`}
                  style={{ width: `${feature.value}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Live Monitoring Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    proctoringStatus.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <FiVideo />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Proctoring Session</p>
                    <p className="text-sm text-gray-600">
                      {proctoringStatus.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  proctoringStatus.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {proctoringStatus.active ? 'Live' : 'Ready'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg mr-3 bg-blue-100 text-blue-600">
                    <FiAlertCircle />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Policy Violations</p>
                    <p className="text-sm text-gray-600">Detected suspicious activities</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  proctoringStatus.violations > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {proctoringStatus.violations} detected
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg mr-3 bg-purple-100 text-purple-600">
                    <FiEye />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Last System Check</p>
                    <p className="text-sm text-gray-600">Continuous monitoring</p>
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  {proctoringStatus.lastCheck.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Proctoring Guidelines</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-700">Ensure your face is clearly visible in good lighting</p>
            </div>
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-700">Close all unnecessary applications and browser tabs</p>
            </div>
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-700">Use a quiet environment without interruptions</p>
            </div>
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-700">Keep your eyes on the screen during the exam</p>
            </div>
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-700">No mobile phones or secondary devices nearby</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Camera Feed */}
      {testSession && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Live Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center justify-between text-white mb-3">
                <span className="text-sm font-medium">📹 Camera Feed</span>
                <span className="text-xs bg-green-600 px-2 py-1 rounded-full">LIVE</span>
              </div>
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                    <FiCamera className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-gray-300">Live Camera Feed Active</p>
                  <p className="text-sm text-gray-400 mt-1">Face detected ✓</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center justify-between text-white mb-3">
                <span className="text-sm font-medium">🖥️ Screen Share</span>
                <span className="text-xs bg-green-600 px-2 py-1 rounded-full">ACTIVE</span>
              </div>
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center">
                    <FiMonitor className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-gray-300">Screen Monitoring Active</p>
                  <p className="text-sm text-gray-400 mt-1">No violations detected ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveProctoringTab;