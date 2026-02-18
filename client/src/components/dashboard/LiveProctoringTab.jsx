import React, { useState, useEffect, useRef } from 'react';
import { FiVideo, FiEye, FiAlertCircle, FiCheckCircle, FiCamera, FiMonitor, FiUserCheck, FiMic, FiStopCircle } from 'react-icons/fi';

const LiveProctoringTab = ({ userId }) => {
  const [proctoringStatus, setProctoringStatus] = useState({
    active: false,
    violations: 0,
    lastCheck: new Date(),
    cameraStatus: 'disconnected',
    micStatus: 'disconnected',
    screenStatus: 'disconnected',
  });

  const [testSession, setTestSession] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [cameraError, setCameraError] = useState(null);
  const [screenError, setScreenError] = useState(null);
  const [cameraResolution, setCameraResolution] = useState(null);
  
  const videoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      stopAllStreams();
    };
  }, []);

  // Effect to handle video element when stream changes
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(e => console.error("Error playing video:", e));
      
      // Get camera resolution
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        setCameraResolution({
          width: settings.width,
          height: settings.height
        });
        console.log("Camera resolution:", settings.width, "x", settings.height);
      }
    }
  }, [mediaStream]);

  // Effect to handle screen video element when stream changes
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.play().catch(e => console.error("Error playing screen video:", e));
    }
  }, [screenStream]);

  const stopAllStreams = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        track.stop();
        console.log(`${track.kind} track stopped`);
      });
      setMediaStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => {
        track.stop();
        console.log(`${track.kind} screen track stopped`);
      });
      setScreenStream(null);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Clear video elements
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = null;
    }
    
    setCameraResolution(null);
  };

  const analyzeAudio = (stream) => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
          setAudioLevel(average);
          
          // Simulate violation detection for loud background noise
          if (average > 150 && proctoringStatus.active) {
            setProctoringStatus(prev => ({
              ...prev,
              violations: prev.violations + (Math.random() > 0.9 ? 1 : 0)
            }));
          }
          
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error("Error setting up audio analysis:", error);
    }
  };

  const requestMediaPermissions = async () => {
    setCameraError(null);
    try {
      // First check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support camera/microphone access");
      }

      // Request camera with exact 1080p resolution
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { exact: 1920 },
          height: { exact: 1080 },
          facingMode: "user",
          frameRate: { ideal: 30 }
        }, 
        audio: true 
      });
      
      console.log("Media stream obtained:", stream);
      console.log("Video tracks:", stream.getVideoTracks().length);
      console.log("Audio tracks:", stream.getAudioTracks().length);
      
      // Verify resolution
      const videoTrack = stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      console.log("Actual camera resolution:", settings.width, "x", settings.height);
      
      if (settings.width !== 1920 || settings.height !== 1080) {
        console.warn(`Camera resolution is ${settings.width}x${settings.height}, not 1080p`);
      }
      
      setMediaStream(stream);
      
      // Start audio analysis
      if (stream.getAudioTracks().length > 0) {
        analyzeAudio(stream);
      }

      setProctoringStatus(prev => ({
        ...prev,
        cameraStatus: 'connected',
        micStatus: stream.getAudioTracks().length > 0 ? 'connected' : 'disconnected',
      }));

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      
      // If exact 1080p fails, try with ideal constraints
      if (error.name === 'OverconstrainedError' || error.message.includes('exact')) {
        console.log("Exact 1080p not available, trying with ideal constraints...");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              facingMode: "user"
            }, 
            audio: true 
          });
          
          console.log("Media stream obtained with ideal constraints:", stream);
          
          const videoTrack = stream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
          console.log("Actual camera resolution:", settings.width, "x", settings.height);
          
          setMediaStream(stream);
          
          if (stream.getAudioTracks().length > 0) {
            analyzeAudio(stream);
          }

          setProctoringStatus(prev => ({
            ...prev,
            cameraStatus: 'connected',
            micStatus: stream.getAudioTracks().length > 0 ? 'connected' : 'disconnected',
          }));

          return stream;
        } catch (fallbackError) {
          console.error('Error with ideal constraints:', fallbackError);
          setCameraError("Could not access camera at 1080p. Your camera may not support this resolution.");
          setPermissionDenied(true);
          setProctoringStatus(prev => ({
            ...prev,
            cameraStatus: 'disconnected',
            micStatus: 'disconnected',
          }));
          return null;
        }
      }
      
      setCameraError(error.message);
      setPermissionDenied(true);
      setProctoringStatus(prev => ({
        ...prev,
        cameraStatus: 'disconnected',
        micStatus: 'disconnected',
      }));
      return null;
    }
  };

  const requestScreenShare = async () => {
    setScreenError(null);
    try {
      // Check if browser supports getDisplayMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error("Your browser doesn't support screen sharing");
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: {
          cursor: "always"
        },
        audio: false
      });
      
      console.log("Screen stream obtained:", stream);
      console.log("Screen video tracks:", stream.getVideoTracks().length);
      
      setScreenStream(stream);
      
      setProctoringStatus(prev => ({
        ...prev,
        screenStatus: 'shared',
      }));

      // Handle when user stops sharing
      stream.getVideoTracks()[0].onended = () => {
        console.log("Screen sharing stopped by user");
        setScreenStream(null);
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = null;
        }
        setProctoringStatus(prev => ({
          ...prev,
          screenStatus: 'disconnected',
        }));
      };

      return stream;
    } catch (error) {
      console.error('Error accessing screen share:', error);
      setScreenError(error.message);
      setProctoringStatus(prev => ({
        ...prev,
        screenStatus: 'disconnected',
      }));
      return null;
    }
  };

  const startProctoringTest = async () => {
    // Stop any existing streams
    stopAllStreams();
    
    setPermissionDenied(false);
    setCameraError(null);
    setScreenError(null);
    
    // Request camera and microphone
    const stream = await requestMediaPermissions();
    
    // Request screen share
    const screen = await requestScreenShare();

    if (stream || screen) {
      setTestSession(true);
      setProctoringStatus(prev => ({
        ...prev,
        active: true,
        violations: 0,
        lastCheck: new Date(),
      }));

      // Simulate periodic checks
      const interval = setInterval(() => {
        setProctoringStatus(prev => ({
          ...prev,
          lastCheck: new Date(),
        }));
      }, 5000);

      // Store interval for cleanup
      const cleanup = () => {
        clearInterval(interval);
        stopAllStreams();
        setTestSession(false);
        setProctoringStatus(prev => ({ ...prev, active: false }));
      };

      return cleanup;
    } else {
      alert("Could not start proctoring. Please check permissions and try again.");
    }
  };

  const stopProctoringTest = () => {
    stopAllStreams();
    setTestSession(false);
    setProctoringStatus(prev => ({ 
      ...prev, 
      active: false,
      cameraStatus: 'disconnected',
      micStatus: 'disconnected',
      screenStatus: 'disconnected',
    }));
    setAudioLevel(0);
    setCameraError(null);
    setScreenError(null);
  };

  const proctoringFeatures = [
    {
      icon: FiCamera,
      title: 'Facial Recognition',
      description: 'Continuous identity verification',
      status: proctoringStatus.cameraStatus,
      color: 'blue',
      value: proctoringStatus.cameraStatus === 'connected' ? 95 : 0,
    },
    {
      icon: FiMonitor,
      title: 'Screen Monitoring',
      description: 'Detects unauthorized windows',
      status: proctoringStatus.screenStatus,
      color: 'green',
      value: proctoringStatus.screenStatus === 'shared' ? 98 : 0,
    },
    {
      icon: FiMic,
      title: 'Audio Analysis',
      description: 'Background noise detection',
      status: proctoringStatus.micStatus,
      color: 'purple',
      value: audioLevel ? Math.min(92, audioLevel) : 0,
    },
    {
      icon: FiAlertCircle,
      title: 'Violation Count',
      description: 'Detected suspicious activities',
      status: proctoringStatus.violations > 0 ? 'warnings' : 'clean',
      color: proctoringStatus.violations > 0 ? 'amber' : 'green',
      value: proctoringStatus.violations,
    },
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      amber: 'bg-amber-100 text-amber-600',
      red: 'bg-red-100 text-red-600',
    };
    return colors[color] || colors.blue;
  };

  const getStatusText = (status) => {
    const statusMap = {
      connected: 'Connected',
      disconnected: 'Disconnected',
      shared: 'Shared',
      warnings: `${proctoringStatus.violations} violation${proctoringStatus.violations !== 1 ? 's' : ''}`,
      clean: 'No violations',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Live Proctoring System</h2>
            <p className="opacity-90 mt-2">AI-powered exam monitoring with 1080p camera resolution</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-3">
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
            {testSession && (
              <button
                onClick={stopProctoringTest}
                className="px-6 py-3 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
              >
                <FiStopCircle className="inline mr-2" />
                Stop
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Permission Denied Alert */}
      {permissionDenied && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-700">
              Camera and microphone access denied. Please allow permissions to use proctoring features.
            </p>
          </div>
        </div>
      )}

      {/* Camera Error Alert */}
      {cameraError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 text-yellow-500 mr-3" />
            <p className="text-yellow-700">
              Camera error: {cameraError}
            </p>
          </div>
        </div>
      )}

      {/* Screen Error Alert */}
      {screenError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 text-yellow-500 mr-3" />
            <p className="text-yellow-700">
              Screen sharing error: {screenError}
            </p>
          </div>
        </div>
      )}

      {/* Proctoring Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {proctoringFeatures.map((feature, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${getColorClass(feature.color)}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {getStatusText(feature.status)}
              </span>
            </div>
            <h3 className="font-bold text-gray-900">{feature.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  {feature.title === 'Violation Count' ? 'Count' : 'Level'}
                </span>
                <span className="font-semibold text-gray-900">
                  {feature.title === 'Violation Count' ? feature.value : `${feature.value}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    feature.color === 'blue' ? 'bg-blue-500' :
                    feature.color === 'green' ? 'bg-green-500' :
                    feature.color === 'purple' ? 'bg-purple-500' :
                    feature.color === 'red' ? 'bg-red-500' :
                    'bg-amber-500'
                  }`}
                  style={{ width: `${feature.title === 'Violation Count' ? Math.min(100, feature.value * 20) : feature.value}%` }}
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
                  {proctoringStatus.lastCheck.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>

              {/* Audio Level Meter */}
              {proctoringStatus.active && proctoringStatus.micStatus === 'connected' && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Audio Level</span>
                    <span className="text-sm text-gray-600">{Math.round(audioLevel)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-red-500"
                      style={{ width: `${Math.min(100, audioLevel)}%` }}
                    ></div>
                  </div>
                </div>
              )}
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

      {/* Live Camera and Screen Feed */}
      {testSession && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Live Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center justify-between text-white mb-3">
                <span className="text-sm font-medium">📹 Camera Feed (1080p)</span>
                {mediaStream && mediaStream.getVideoTracks().length > 0 ? (
                  <span className="text-xs bg-green-600 px-2 py-1 rounded-full">LIVE</span>
                ) : (
                  <span className="text-xs bg-red-600 px-2 py-1 rounded-full">OFF</span>
                )}
              </div>
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                {mediaStream && mediaStream.getVideoTracks().length > 0 ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiCamera className="h-12 w-12 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Camera: {mediaStream && mediaStream.getVideoTracks().length > 0 ? 'Active' : 'Inactive'}</span>
                {cameraResolution && (
                  <span>Resolution: {cameraResolution.width} x {cameraResolution.height}</span>
                )}
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center justify-between text-white mb-3">
                <span className="text-sm font-medium">🖥️ Screen Share</span>
                {screenStream && screenStream.getVideoTracks().length > 0 ? (
                  <span className="text-xs bg-green-600 px-2 py-1 rounded-full">ACTIVE</span>
                ) : (
                  <span className="text-xs bg-red-600 px-2 py-1 rounded-full">OFF</span>
                )}
              </div>
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                {screenStream && screenStream.getVideoTracks().length > 0 ? (
                  <video
                    ref={screenVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiMonitor className="h-12 w-12 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Screen: {screenStream && screenStream.getVideoTracks().length > 0 ? 'Being monitored' : 'Not sharing'}</span>
                {screenStream && screenStream.getVideoTracks().length > 0 && (
                  <span>Status: Active</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveProctoringTab;