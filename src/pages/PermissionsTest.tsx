import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, XCircle, Camera, Mic, Wifi, Clipboard, Volume2, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PermissionStatus = 'idle' | 'testing' | 'granted' | 'denied';

interface PermissionState {
  camera: PermissionStatus;
  microphone: PermissionStatus;
  internet: PermissionStatus;
  clipboard: PermissionStatus;
  speaker: PermissionStatus;
}

const PermissionsTest = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: 'idle',
    microphone: 'idle',
    internet: 'idle',
    clipboard: 'idle',
    speaker: 'idle',
  });
  const [accepted, setAccepted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [internetSpeed, setInternetSpeed] = useState<string>('');
  const [downloadSpeed, setDownloadSpeed] = useState<number>(0);
  const [isTesting, setIsTesting] = useState(false);
  const [speakerConfirmed, setSpeakerConfirmed] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const steps = [
    'Guidelines',
    'Camera Test',
    'Microphone Test',
    'Internet Test',
    'Clipboard Test',
    'Speaker Test',
    'Summary',
    'Acceptance'
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Capture image from video
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        
        // Auto-proceed to next step after capture
        setTimeout(() => {
          handleNext();
        }, 1500);
      }
    }
  };

  // Camera Test
  const testCamera = async () => {
    setPermissions(prev => ({ ...prev, camera: 'testing' }));
    
    // Check if mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Camera API not available');
      setPermissions(prev => ({ ...prev, camera: 'denied' }));
      return;
    }

    try {
      // Request camera with specific constraints for better compatibility
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      console.log('Camera permission granted');
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Ensure video plays
        videoRef.current.play().catch(e => console.log('Video play error:', e));
        
        // Auto-capture after 2 seconds
        setTimeout(() => {
          captureImage();
        }, 2000);
      }
      
      setPermissions(prev => ({ ...prev, camera: 'granted' }));
    } catch (error) {
      console.error('Camera error:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name, 'Message:', error.message);
      }
      setPermissions(prev => ({ ...prev, camera: 'denied' }));
    }
  };

  // Microphone Test
  const testMicrophone = async () => {
    setPermissions(prev => ({ ...prev, microphone: 'testing' }));
    
    // Check if mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Microphone API not available');
      setPermissions(prev => ({ ...prev, microphone: 'denied' }));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log('Microphone permission granted');
      
      // Create AudioContext (with fallback for Safari)
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      // Optimized for better responsiveness to voice
      analyserRef.current.fftSize = 2048; // Higher FFT size for better frequency resolution
      analyserRef.current.smoothingTimeConstant = 0.3; // Lower smoothing for more responsiveness
      analyserRef.current.minDecibels = -90;
      analyserRef.current.maxDecibels = -10;
      
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      let animationId: number;
      const updateLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average with emphasis on mid-range frequencies (human voice range)
          // Human voice is typically 85-255 Hz (fundamental) and harmonics up to 4000 Hz
          const total = dataArray.reduce((sum, value) => sum + value, 0);
          const average = total / dataArray.length;
          
          // Amplify the signal for better visual feedback
          const amplified = Math.min(255, average * 2.5);
          
          setAudioLevel(amplified);
          animationId = requestAnimationFrame(updateLevel);
        }
      };
      updateLevel();

      setPermissions(prev => ({ ...prev, microphone: 'granted' }));
      
      // Store cleanup function
      return () => {
        if (animationId) cancelAnimationFrame(animationId);
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      console.error('Microphone error:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name, 'Message:', error.message);
      }
      setPermissions(prev => ({ ...prev, microphone: 'denied' }));
    }
  };

  // Internet Test with speed measurement
  const testInternet = async () => {
    setIsTesting(true);
    setPermissions(prev => ({ ...prev, internet: 'testing' }));
    
    // Check if online
    if (!navigator.onLine) {
      setPermissions(prev => ({ ...prev, internet: 'denied' }));
      setInternetSpeed('Offline');
      setDownloadSpeed(0);
      setIsTesting(false);
      return;
    }

    try {
      // Perform an actual short throughput test (measured now)
      // Use a large, CORS-enabled file and read for a fixed sampling window
      const testFileUrl = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.480p.vp9.webm';
      const response = await fetch(`${testFileUrl}?nocache=${Date.now()}`, {
        cache: 'no-store'
      });

      if (!response.ok || !response.body) {
        throw new Error('Speed test request failed');
      }

      const reader = response.body.getReader();
      const sampleWindowMs = 3500; // 3.5 seconds sample for accuracy
      const startTs = performance.now();
      let receivedBytes = 0;

      // Read until sample window elapses, then cancel gracefully
      while (true) {
        const elapsed = performance.now() - startTs;
        if (elapsed >= sampleWindowMs) {
          // Stop reading without throwing
          try { await reader.cancel(); } catch {}
          break;
        }
        const { value, done } = await reader.read();
        if (done) break; // file ended early
        if (value) receivedBytes += value.byteLength;
      }

      const durationSeconds = (performance.now() - startTs) / 1000;
      const mbps = (receivedBytes * 8) / durationSeconds / 1_000_000;
      const measured = parseFloat(mbps.toFixed(2));

      setDownloadSpeed(measured);
      setInternetSpeed('Measured');
      setPermissions(prev => ({ ...prev, internet: 'granted' }));
    } catch (error: any) {
      // Ignore abort-related noise; report only real failures
      if (error?.name !== 'AbortError') {
        console.error('Internet error:', error);
      }
      if (navigator.onLine) {
        setInternetSpeed('Measured');
        setDownloadSpeed(0);
        setPermissions(prev => ({ ...prev, internet: 'granted' }));
      } else {
        setPermissions(prev => ({ ...prev, internet: 'denied' }));
        setInternetSpeed('No connection');
        setDownloadSpeed(0);
      }
    } finally {
      setIsTesting(false);
    }
  };

  // Clipboard Test
  const testClipboard = async () => {
    setPermissions(prev => ({ ...prev, clipboard: 'testing' }));
    
    // Check if clipboard API is available
    if (!navigator.clipboard) {
      console.log('Clipboard API not available');
      setPermissions(prev => ({ ...prev, clipboard: 'denied' }));
      return;
    }

    try {
      // Try using Permissions API first (for modern browsers)
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
          console.log('Clipboard permission:', permission.state);
          
          if (permission.state === 'denied') {
            setPermissions(prev => ({ ...prev, clipboard: 'denied' }));
            return;
          }
        } catch (permError) {
          console.log('Permissions API not fully supported, testing directly');
        }
      }

      // Test write and read
      const testText = 'Clipboard working ✅';
      await navigator.clipboard.writeText(testText);
      
      // Small delay to ensure write completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const text = await navigator.clipboard.readText();
      console.log('Clipboard read:', text);
      
      if (text === testText) {
        setPermissions(prev => ({ ...prev, clipboard: 'granted' }));
      } else {
        setPermissions(prev => ({ ...prev, clipboard: 'denied' }));
      }
    } catch (error) {
      console.error('Clipboard error:', error);
      // If we get a NotAllowedError, it means permission was denied
      if (error instanceof Error && error.name === 'NotAllowedError') {
        setPermissions(prev => ({ ...prev, clipboard: 'denied' }));
      } else {
        // For other errors, still mark as denied
        setPermissions(prev => ({ ...prev, clipboard: 'denied' }));
      }
    }
  };

  // Speaker Test
  const testSpeaker = () => {
    setPermissions(prev => ({ ...prev, speaker: 'testing' }));
    
    try {
      // Create a simple beep sound using Web Audio API for better compatibility
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.value = 0.3;
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      console.log('Test sound played');
    } catch (error) {
      console.error('Speaker test error:', error);
    }
  };

  const handleSpeakerConfirm = (heard: boolean) => {
    setSpeakerConfirmed(heard);
    setPermissions(prev => ({ ...prev, speaker: heard ? 'granted' : 'denied' }));
  };

  // Auto-run tests when entering step (except internet test which is manual)
  useEffect(() => {
    if (currentStep === 1 && permissions.camera === 'idle') {
      testCamera();
    } else if (currentStep === 2 && permissions.microphone === 'idle') {
      testMicrophone();
    } else if (currentStep === 4 && permissions.clipboard === 'idle') {
      testClipboard();
    } else if (currentStep === 5 && permissions.speaker === 'idle') {
      testSpeaker();
    }
  }, [currentStep]);

  const allPermissionsGranted = 
    permissions.camera === 'granted' &&
    permissions.microphone === 'granted' &&
    permissions.internet === 'granted' &&
    permissions.clipboard === 'granted' &&
    permissions.speaker === 'granted';

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartInterview = () => {
    localStorage.setItem('permissionsGranted', JSON.stringify(permissions));
    // Get category and other settings from URL params
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || 'general';
    const level = params.get('level') || 'intermediate';
    const questions = params.get('questions') || '5';
    
    // Pass to guidelines page
    navigate(`/guidelines?category=${category}&level=${level}&questions=${questions}`);
  };

  const StatusIcon = ({ status }: { status: PermissionStatus }) => {
    if (status === 'granted') return <CheckCircle2 className="w-6 h-6 text-green-600" />;
    if (status === 'denied') return <XCircle className="w-6 h-6 text-destructive" />;
    return <div className="w-6 h-6 border-2 border-muted rounded-full animate-spin border-t-primary" />;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-start justify-between w-full">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center w-full">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    index === currentStep 
                      ? 'bg-primary text-primary-foreground scale-110' 
                      : index < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className={`text-xs mt-2 text-center whitespace-nowrap ${index === currentStep ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-1 mx-2 transition-all ${
                    index < currentStep ? 'bg-green-600' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <Card className="p-8 border border-border shadow-sm bg-card rounded-3xl">
          {/* Guidelines */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-foreground">Guidelines</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Before starting your AI mock interview, we need to test your device's media permissions and connectivity.
              </p>
              <div className="space-y-4 mt-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">We'll test your camera, microphone, internet connection, clipboard, and speakers</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">Each test will automatically run when you reach that step</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">Please allow all permissions when prompted by your browser</p>
                </div>
              </div>
            </div>
          )}

          {/* Camera Test */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Camera className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-semibold text-foreground">Camera Test</h2>
                </div>
                <StatusIcon status={permissions.camera} />
              </div>
              <div className="bg-muted/30 rounded-xl overflow-hidden h-96 flex items-center justify-center border-2 border-primary/20 relative">
                {permissions.camera === 'testing' && (
                  <div className="text-muted-foreground">Waiting for camera access...</div>
                )}
                {!capturedImage ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="w-full h-full object-cover"
                  />
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              {permissions.camera === 'granted' && !capturedImage && (
                <p className="text-green-600 font-medium">✅ Camera is working properly!</p>
              )}
              {permissions.camera === 'granted' && capturedImage && (
                <p className="text-green-600 font-medium">✅ Camera is working properly!</p>
              )}
              {permissions.camera === 'denied' && (
                <p className="text-destructive font-medium">❌ Camera access denied. Please enable camera permissions.</p>
              )}
            </div>
          )}

          {/* Microphone Test */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-semibold text-foreground">Microphone Test</h2>
                </div>
                <StatusIcon status={permissions.microphone} />
              </div>
              <p className="text-muted-foreground">Speak into your microphone to test the audio input</p>
              <div className="bg-muted/30 rounded-xl p-12 relative overflow-hidden">
                {/* Multiple layered pulsing background effects */}
                {audioLevel > 20 && (
                  <>
                    <div 
                      className="absolute inset-0 bg-gradient-radial from-primary/10 via-primary/5 to-transparent rounded-xl transition-all duration-500 animate-pulse"
                      style={{ 
                        opacity: Math.min(audioLevel / 255, 0.5),
                        transform: `scale(${1 + (audioLevel / 500)})`
                      }}
                    />
                    <div 
                      className="absolute inset-0 rounded-xl transition-opacity duration-300"
                      style={{ 
                        background: `radial-gradient(circle at center, hsl(var(--primary) / ${audioLevel / 1000}), transparent)`,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                      }}
                    />
                  </>
                )}
                
                <div className="h-40 flex items-end justify-center gap-2 relative z-10">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const delay = i * 0.03;
                    const baseHeight = 15;
                    const maxHeight = 95;
                    
                    // Enhanced wave calculation with multiple frequencies
                    let height = baseHeight;
                    if (audioLevel > 5) {
                      const normalizedLevel = audioLevel / 255;
                      const time = Date.now() / 150;
                      
                      // Multiple wave frequencies for more organic movement
                      const wave1 = Math.sin(time + i * 0.4);
                      const wave2 = Math.sin(time * 1.5 + i * 0.2) * 0.5;
                      const wave3 = Math.cos(time * 0.8 + i * 0.5) * 0.3;
                      const combinedWave = (wave1 + wave2 + wave3) / 1.8;
                      
                      // Center bars are taller
                      const centerBoost = 1 - Math.abs((i - 11.5) / 11.5) * 0.3;
                      
                      height = baseHeight + (normalizedLevel * maxHeight * (0.6 + combinedWave * 0.4) * centerBoost);
                    }
                    
                    const isActive = audioLevel > 5;
                    const intensity = Math.min(audioLevel / 255, 1);
                    
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-full transition-all duration-100 ease-out relative"
                        style={{
                          height: `${Math.max(baseHeight, Math.min(height, 100))}%`,
                          maxWidth: '10px',
                          background: isActive 
                            ? `linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary) / ${0.7 + intensity * 0.3}))`
                            : 'linear-gradient(to top, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.2))',
                          boxShadow: isActive 
                            ? `0 0 ${8 + intensity * 12}px hsl(var(--primary) / ${intensity * 0.6}), 0 0 ${4 + intensity * 6}px hsl(var(--primary) / ${intensity * 0.4})`
                            : 'none',
                          transform: isActive ? `scaleY(${1 + intensity * 0.05})` : 'scaleY(1)',
                          opacity: isActive ? 0.9 + intensity * 0.1 : 0.25,
                          transitionDelay: `${delay}s`
                        }}
                      />
                    );
                  })}
                </div>
                
                {/* Enhanced audio level indicator with animations */}
                {audioLevel > 5 && (
                  <div className="absolute top-4 right-4 flex items-center gap-3 text-primary text-sm font-semibold animate-fade-in">
                    <div className="relative flex items-center justify-center">
                      {/* Pulsing rings */}
                      <div className="absolute w-8 h-8 bg-primary/20 rounded-full animate-ping" />
                      <div className="absolute w-6 h-6 bg-primary/30 rounded-full animate-pulse" />
                      <div className="relative w-3 h-3 bg-primary rounded-full shadow-lg" 
                        style={{
                          boxShadow: `0 0 ${8 + (audioLevel / 255) * 12}px hsl(var(--primary))`
                        }}
                      />
                    </div>
                    <span className="animate-pulse">Listening...</span>
                    {/* Volume bar indicator */}
                    <div className="flex gap-0.5 items-end h-4">
                      {[...Array(5)].map((_, idx) => (
                        <div
                          key={idx}
                          className="w-1 bg-primary rounded-full transition-all duration-150"
                          style={{
                            height: audioLevel > (idx * 50) ? `${(idx + 1) * 20}%` : '20%',
                            opacity: audioLevel > (idx * 50) ? 1 : 0.3
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {permissions.microphone === 'granted' && (
                <p className="text-green-600 font-medium">✅ Microphone is working properly!</p>
              )}
              {permissions.microphone === 'denied' && (
                <p className="text-destructive font-medium">❌ Microphone access denied. Please enable microphone permissions.</p>
              )}
            </div>
          )}

          {/* Internet Test */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wifi className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-semibold text-foreground">Internet Test</h2>
                </div>
                <StatusIcon status={permissions.internet} />
              </div>
              
              <div className="bg-muted/30 rounded-xl p-12 flex flex-col items-center justify-center space-y-6">
                <p className="text-muted-foreground text-lg text-center">
                  Test your internet connection speed
                </p>
                
                <Button
                  onClick={testInternet}
                  disabled={isTesting}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg font-semibold rounded-xl h-auto shadow-lg transition-all"
                >
                  {isTesting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Testing...
                    </>
                  ) : (
                    'Test Internet Speed'
                  )}
                </Button>
                
                {downloadSpeed > 0 && !isTesting && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3 text-3xl">
                      <span className="text-primary font-bold">{downloadSpeed}</span>
                      <span className="text-foreground font-semibold">Mbps</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Download speed
                    </p>
                  </div>
                )}
                
                {permissions.internet === 'denied' && !isTesting && (
                  <p className="text-destructive font-medium">❌ No internet connection detected</p>
                )}
              </div>
              
              {permissions.internet === 'granted' && (
                <p className="text-green-600 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Internet connection is stable!
                </p>
              )}
            </div>
          )}

          {/* Clipboard Test */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clipboard className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-semibold text-foreground">Clipboard Test</h2>
                </div>
                <StatusIcon status={permissions.clipboard} />
              </div>
              <p className="text-muted-foreground">Testing clipboard read/write permissions</p>
              {permissions.clipboard === 'granted' && (
                <p className="text-green-600 font-medium">✅ Clipboard access is working!</p>
              )}
              {permissions.clipboard === 'denied' && (
                <p className="text-destructive font-medium">❌ Clipboard access denied.</p>
              )}
            </div>
          )}

          {/* Speaker Test */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-semibold text-foreground">Speaker Test</h2>
                </div>
                <StatusIcon status={permissions.speaker} />
              </div>
              <p className="text-muted-foreground">A test sound has been played. Can you hear it?</p>
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={() => handleSpeakerConfirm(true)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                  disabled={speakerConfirmed}
                >
                  Yes, I can hear it
                </Button>
                <Button
                  onClick={() => handleSpeakerConfirm(false)}
                  variant="outline"
                  className="flex-1 rounded-xl"
                  disabled={speakerConfirmed}
                >
                  No, I can't hear it
                </Button>
              </div>
            </div>
          )}

          {/* Summary */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-foreground">Summary</h2>
              <p className="text-muted-foreground">Here's the status of all permission tests:</p>
              <div className="space-y-4">
                {[
                  { name: 'Camera', status: permissions.camera, icon: Camera },
                  { name: 'Microphone', status: permissions.microphone, icon: Mic },
                  { name: 'Internet', status: permissions.internet, icon: Wifi },
                  { name: 'Clipboard', status: permissions.clipboard, icon: Clipboard },
                  { name: 'Speaker', status: permissions.speaker, icon: Volume2 },
                ].map(({ name, status, icon: Icon }) => (
                  <div key={name} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-primary" />
                      <span className="font-medium text-foreground">{name}</span>
                    </div>
                    <StatusIcon status={status} />
                  </div>
                ))}
              </div>
              {!allPermissionsGranted && (
                <p className="text-destructive font-medium">⚠️ Some permissions were not granted. Please go back and enable them.</p>
              )}
            </div>
          )}

          {/* Acceptance */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-foreground">Ready to Start</h2>
              <p className="text-muted-foreground text-lg">
                All permission tests are complete. Please confirm you're ready to begin your mock interview.
              </p>
              <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-xl">
                <Checkbox
                  id="acceptance"
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked as boolean)}
                  disabled={!allPermissionsGranted}
                />
                <label
                  htmlFor="acceptance"
                  className="text-foreground font-medium cursor-pointer"
                >
                  I'm ready to start my mock interview
                </label>
              </div>
              {allPermissionsGranted && accepted && (
                <Button
                  onClick={handleStartInterview}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl text-lg font-medium"
                >
                  Proceed to Interview
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="rounded-xl"
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            disabled={currentStep === steps.length - 1 || (currentStep === 7 && !accepted)}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsTest;
