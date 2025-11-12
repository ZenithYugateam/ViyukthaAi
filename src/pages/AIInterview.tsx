import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sun, Moon, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { VideoFeed } from "@/components/interview/VideoFeed";
import { InterviewControls } from "@/components/interview/InterviewControls";
import { ChatPanel } from "@/components/interview/ChatPanel";
import { LiveConversation } from "@/components/interview/LiveConversation";
import { GuidelinesModal } from "@/components/interview/GuidelinesModal";
import { PhotoCaptureModal } from "@/components/interview/PhotoCaptureModal";
import { PerformanceReport } from "@/components/interview/PerformanceReport";
import { CodeEditor } from "@/components/interview/CodeEditor";
import { Notebook } from "@/components/interview/Notebook";
import { ConversationHistorySidebar } from "@/components/interview/ConversationHistorySidebar";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { mockData } from "@/data/mock-company-dashboard";
import type { Question } from "@/data/mock-company-dashboard";
import { conductInterview, evaluateAnswer } from "@/lib/ai/conductInterview";
import { Groq } from 'groq-sdk';
import { executeWithKeyRotation, isRateLimitError } from "@/lib/ai/groqKeyRotation";

// Get Groq API key from environment variable
// No fallback - must be configured in .env file
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GROK_API_KEY;
type Message = {
  role: "user" | "assistant";
  content: string;
};
const AIInterview = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const params = new URLSearchParams(window.location.search);
  const urlCategory = params.get("category") || "general";
  const urlLevel = params.get("level") || "intermediate";
  const totalQuestions = parseInt(params.get("questions") || "5");
  
  // Check if this is a job interview route
  const isJobInterviewRoute = window.location.pathname.includes('/job-interview/');
  
  // Check for job-specific interview - only if on job interview route
  const jobSessionId = isJobInterviewRoute ? sessionStorage.getItem('currentInterviewSession') : null;
  const jobId = isJobInterviewRoute ? sessionStorage.getItem('currentJobId') : null;
  const jobQuestionsJson = isJobInterviewRoute ? sessionStorage.getItem('currentJobQuestions') : null;
  const jobQuestions: Question[] = jobQuestionsJson ? JSON.parse(jobQuestionsJson) : [];
  const isJobInterview = isJobInterviewRoute && !!jobSessionId && jobQuestions.length > 0;
  
  // Clear job interview data if this is a mock/custom interview
  useEffect(() => {
    if (!isJobInterviewRoute && !isJobInterview) {
      // Clear any leftover job interview data from sessionStorage
      sessionStorage.removeItem('currentInterviewSession');
      sessionStorage.removeItem('currentJobId');
      sessionStorage.removeItem('currentJobQuestions');
      console.log('Cleared job interview data for mock interview');
    }
  }, [isJobInterviewRoute, isJobInterview]);
  
  const [isMuted, setIsMuted] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationText, setConversationText] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(urlCategory);
  const [aiStatus, setAiStatus] = useState("Ready to start");
  const [questionCount, setQuestionCount] = useState(0);
  const [codeAnswer, setCodeAnswer] = useState<string>('');
  const [pseudoCodeAnswer, setPseudoCodeAnswer] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState(0); // Timer in seconds
  
  // Track time per question for job interviews
  const questionStartTimeRef = useRef<number>(0);
  const interviewStartTimeRef = useRef<number>(0);
  const currentQuestionIndexRef = useRef<number>(-1);
  const videoBlobRef = useRef<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const questionVideoRecordersRef = useRef<Map<number, MediaRecorder>>(new Map());
  const questionVideoChunksRef = useRef<Map<number, Blob[]>>(new Map());
  // Check if guidelines were already shown in this session
  const [showGuidelines, setShowGuidelines] = useState(() => {
    const hasSeenGuidelines = sessionStorage.getItem('hasSeenGuidelines');
    return !hasSeenGuidelines; // Only show if not seen before
  });
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [performanceReport, setPerformanceReport] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(jobSessionId);
  const [violationCount, setViolationCount] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastViolationTimeRef = useRef<number>(0);

  // Voice recognition - accumulate full speech
  const accumulatedTranscriptRef = useRef<string>('');
  const finalTranscriptTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    isListening,
    startListening,
    stopListening
  } = useVoiceRecognition({
    onResult: (transcript, isFinal) => {
      // CRITICAL: Ignore all transcripts while AI is speaking or just finished speaking
      // This prevents the mic from picking up AI's voice output
      const timeSinceAISpeech = Date.now() - aiSpeechEndTimeRef.current;
      const isTooSoonAfterAI = timeSinceAISpeech < 1000; // Ignore for 1 second after AI finishes
      
      if (isAISpeaking || window.speechSynthesis.speaking || window.speechSynthesis.pending || isTooSoonAfterAI) {
        console.log('Ignoring transcript - AI is speaking or just finished:', transcript);
        return; // Completely ignore transcripts while AI is speaking
      }
      
      // Stop AI speech immediately when user starts speaking (with proper cleanup)
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending || isAISpeaking) {
        window.speechSynthesis.cancel();
        setIsAISpeaking(false);
        // Clear any pending speech
        window.speechSynthesis.cancel();
        // Force stop any remaining speech
        setTimeout(() => {
          window.speechSynthesis.cancel();
          setIsAISpeaking(false);
        }, 50);
      }
      
      // Clean and validate transcript
      const cleanTranscript = transcript.trim();
      if (!cleanTranscript) return;
      
      // Additional check: Compare with last AI speech to filter out echo
      if (lastAISpeechRef.current) {
        const aiWords = lastAISpeechRef.current.toLowerCase().split(/\s+/);
        const transcriptWords = cleanTranscript.toLowerCase().split(/\s+/);
        const matchingWords = transcriptWords.filter(word => aiWords.includes(word));
        const similarity = matchingWords.length / Math.max(aiWords.length, transcriptWords.length);
        
        // If transcript is too similar to AI's last speech, it's likely an echo
        if (similarity > 0.5 && cleanTranscript.length > 10) {
          console.log('Ignoring transcript - too similar to AI speech:', cleanTranscript);
          return;
        }
      }
      
      // Filter out very short or meaningless transcripts (likely noise)
      // Also filter common false positives
      const minLength = 3;
      const falsePositives = ['uh', 'um', 'ah', 'eh', 'oh', 'hmm', 'mm', 'mhm'];
      const isFalsePositive = falsePositives.some(fp => 
        cleanTranscript.toLowerCase() === fp || 
        cleanTranscript.toLowerCase().startsWith(fp + ' ')
      );
      
      if (isFalsePositive && cleanTranscript.length < 10) {
        return; // Ignore short false positives
      }
      
      const meaningfulWords = cleanTranscript.split(/\s+/).filter(w => w.length > 1).length;
      
      if (isFinal) {
        // Check if this final transcript is a duplicate of what we already have
        const currentAccumulated = accumulatedTranscriptRef.current.trim();
        const isDuplicate = currentAccumulated && (
          cleanTranscript.trim() === currentAccumulated ||
          currentAccumulated.includes(cleanTranscript.trim()) ||
          cleanTranscript.trim().includes(currentAccumulated)
        );
        
        // Only accumulate if it's new content
        if (!isDuplicate) {
          accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? ' ' : '') + cleanTranscript;
        }
        
        // Clear any existing timeout
        if (finalTranscriptTimeoutRef.current) {
          clearTimeout(finalTranscriptTimeoutRef.current);
        }
        
        // Wait for more speech before sending (user might continue speaking after brief pause)
        // Reduced delay to 1.5 seconds for faster response
        finalTranscriptTimeoutRef.current = setTimeout(() => {
          const fullTranscript = accumulatedTranscriptRef.current.trim();
          
          if (fullTranscript && isInterviewStarted) {
            // Only send if we haven't already sent this exact transcript
            const lastSentMessage = messages[messages.length - 1];
            const isAlreadySent = lastSentMessage && 
              lastSentMessage.role === 'user' && 
              lastSentMessage.content.trim() === fullTranscript.trim();
            
            if (!isAlreadySent) {
              // Add final transcript to conversation
              setConversationText(prev => {
                const filtered = prev.filter(t => !t.startsWith("You (speaking): ") && !t.startsWith("You: "));
                return [...filtered, `You: ${fullTranscript}`];
              });
              
              // Only send if transcript is meaningful
              const fullMeaningfulWords = fullTranscript.split(/\s+/).filter(w => w.length > 1).length;
              if (fullTranscript.length >= minLength && fullMeaningfulWords >= 1 && !isFalsePositive) {
                if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                  handleSendMessage(fullTranscript);
                  // Clear accumulated transcript after sending
                  accumulatedTranscriptRef.current = '';
                  
                  // Auto-disable mic after candidate finishes speaking (reduced delay)
                  setTimeout(() => {
                    if (isListening && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                      setTimeout(() => {
                        if (isListening && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                          stopListening();
                          setIsMuted(true);
                          isMutedRef.current = true;
                        }
                      }, 2000); // Reduced to 2 seconds
                    }
                  }, 500); // Reduced initial delay to 500ms
                }
              }
            }
          }
          
          finalTranscriptTimeoutRef.current = null;
        }, 1500); // Reduced to 1.5 seconds for faster response
        
        // Show accumulated transcript as interim while waiting (only if not duplicate)
        const newAccumulated = accumulatedTranscriptRef.current.trim();
        if (newAccumulated && newAccumulated !== currentAccumulated) {
          setConversationText(prev => {
            const filtered = prev.filter(t => !t.startsWith("You (speaking): "));
            return [...filtered, `You (speaking): ${newAccumulated}`];
          });
        }
      } else {
        // For interim results, show ONLY the current interim transcript
        // Don't combine with accumulated final results to avoid duplication
        // The accumulated final results will be shown separately when finalized
        if (cleanTranscript.length >= minLength || meaningfulWords >= 1) {
          setConversationText(prev => {
            // Remove all interim transcripts and add only the current one
            const filtered = prev.filter(t => !t.startsWith("You (speaking): "));
            // Only show current interim if it's different from accumulated final
            if (!accumulatedTranscriptRef.current || !cleanTranscript.startsWith(accumulatedTranscriptRef.current.trim())) {
              return [...filtered, `You (speaking): ${cleanTranscript}`];
            }
            return filtered;
          });
        }
        
        // Reset timeout if we get new interim results (user is still speaking)
        if (finalTranscriptTimeoutRef.current) {
          clearTimeout(finalTranscriptTimeoutRef.current);
          finalTranscriptTimeoutRef.current = null;
        }
      }
    },
    continuous: true,
    onError: (error) => {
      console.error('Voice recognition error:', error);
      // Only show toast for critical errors, not for network retries
      if (error !== 'Network error - retrying...') {
        toast({
          title: "Voice Recognition Issue",
          description: `Error: ${error}. Trying to recover...`,
          variant: "default",
        });
      }
    },
    onRetry: () => {
      console.log('Voice recognition recovered from network error');
      toast({
        title: "Voice Recognition Restored",
        description: "Connection restored, you can continue speaking",
      });
    }
  });

  // Text-to-speech
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const lastAISpeechRef = useRef<string>(''); // Track last AI speech to filter it out
  const aiSpeechEndTimeRef = useRef<number>(0); // Track when AI finished speaking
  const isInterviewStartedRef = useRef<boolean>(false); // Track interview state for callbacks
  const isMutedRef = useRef<boolean>(false); // Track mute state for callbacks
  
  // Function to ensure voices are loaded
  const ensureVoicesLoaded = (): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve([]);
        return;
      }
      
      const voices = window.speechSynthesis.getVoices();
      
      // If voices are already loaded, return them
      if (voices.length > 0) {
        voicesRef.current = voices;
        setVoicesLoaded(true);
        resolve(voices);
        return;
      }
      
      // Wait for voices to load
      const onVoicesChanged = () => {
        const loadedVoices = window.speechSynthesis.getVoices();
        if (loadedVoices.length > 0) {
          voicesRef.current = loadedVoices;
          setVoicesLoaded(true);
          window.speechSynthesis.onvoiceschanged = null;
          console.log('Voices loaded:', loadedVoices.length);
          resolve(loadedVoices);
        }
      };
      
      window.speechSynthesis.onvoiceschanged = onVoicesChanged;
      
      // Timeout fallback - try to get voices after a short delay
      setTimeout(() => {
        const loadedVoices = window.speechSynthesis.getVoices();
        if (loadedVoices.length > 0) {
          voicesRef.current = loadedVoices;
          setVoicesLoaded(true);
          if (window.speechSynthesis.onvoiceschanged === onVoicesChanged) {
            window.speechSynthesis.onvoiceschanged = null;
          }
          resolve(loadedVoices);
        } else {
          // Still no voices, but resolve anyway to prevent hanging
          resolve([]);
        }
      }, 1000);
    });
  };
  
  const speakText = async (text: string) => {
    if (!("speechSynthesis" in window) || !text || text.trim() === '') {
      console.warn('Speech synthesis not available or empty text');
      return;
    }
    
    try {
      // Ensure voices are loaded before speaking
      let voices = voicesRef.current;
      if (voices.length === 0 || !voicesLoaded) {
        voices = await ensureVoicesLoaded();
      }
      
      // Cancel any ongoing speech first and wait for it to fully stop
      // Also check for stuck state and reset if needed
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
        // Wait longer for cancellation to complete and queue to clear
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Double-check - if still speaking after cancellation, force reset
        if (window.speechSynthesis.speaking) {
          console.warn('Speech synthesis still speaking after cancel, forcing reset');
          window.speechSynthesis.cancel();
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      const utterance = new SpeechSynthesisUtterance(text.trim());
      
      // Priority 1: US English neural/premium voices (professional quality)
      let selectedVoice = voices.find(voice => 
        (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) &&
        (voice.name.includes('Neural') || 
         voice.name.includes('Premium') ||
         voice.name.includes('Natural') ||
         voice.name.includes('Enhanced'))
      );
      
      // Priority 2: UK English neural/premium voices
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          (voice.lang === 'en-GB' || voice.lang.startsWith('en-GB')) &&
          (voice.name.includes('Neural') || 
           voice.name.includes('Premium') ||
           voice.name.includes('Natural') ||
           voice.name.includes('Enhanced'))
        );
      }
      
      // Priority 3: US English Google voices (professional and natural)
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) &&
          voice.name.includes('Google')
        );
      }
      
      // Priority 4: UK English Google voices
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          (voice.lang === 'en-GB' || voice.lang.startsWith('en-GB')) &&
          voice.name.includes('Google')
        );
      }
      
      // Priority 5: US English Microsoft voices
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) &&
          voice.name.includes('Microsoft')
        );
      }
      
      // Priority 6: UK English Microsoft voices
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          (voice.lang === 'en-GB' || voice.lang.startsWith('en-GB')) &&
          voice.name.includes('Microsoft')
        );
      }
      
      // Priority 7: Any US English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang === 'en-US' || voice.lang.startsWith('en-US')
        );
      }
      
      // Priority 8: Any UK English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang === 'en-GB' || voice.lang.startsWith('en-GB')
        );
      }
      
      // Priority 9: Professional neural/premium English voices (any variant)
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en-') &&
          (voice.name.includes('Neural') || 
           voice.name.includes('Premium') ||
           voice.name.includes('Natural') ||
           voice.name.includes('Enhanced'))
        );
      }
      
      // Priority 10: Any professional English voice (Google/Microsoft)
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en-') &&
          (voice.name.includes('Google') || voice.name.includes('Microsoft'))
        );
      }
      
      // Final fallback: any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en-'));
      }
      
      // If still no voice, use default (browser will choose)
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name, selectedVoice.lang);
      } else {
        console.warn('No suitable voice found, using browser default');
      }
      
      utterance.rate = 0.9; // Professional pace - slightly slower for clarity
      utterance.pitch = 1.0; // Natural pitch
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        setIsAISpeaking(true);
        console.log('AI started speaking');
        // CRITICAL: Force stop listening immediately when AI starts speaking
        if (isListening) {
          stopListening();
        }
        // Store the text being spoken for echo filtering
        lastAISpeechRef.current = text.trim();
      };
      
      utterance.onend = () => {
        setIsAISpeaking(false);
        aiSpeechEndTimeRef.current = Date.now(); // Record when AI finished
        console.log('AI finished speaking');
        
        // Auto-enable mic when AI finishes speaking (if interview is active and not manually muted)
        // Use refs for reliable state checking in callbacks
        const enableMic = () => {
          // Check all conditions before enabling - use refs for reliable state
          const canEnable = isInterviewStartedRef.current && 
                           !isMutedRef.current && 
                           !isListening && 
                           !window.speechSynthesis.speaking && 
                           !window.speechSynthesis.pending;
          
          if (canEnable) {
            console.log('✓ Auto-enabling mic after AI finished speaking');
            startListening();
          } else {
            console.log('Cannot auto-enable mic - conditions not met:', {
              isInterviewStarted: isInterviewStartedRef.current,
              isMuted: isMutedRef.current,
              isListening,
              speaking: window.speechSynthesis.speaking,
              pending: window.speechSynthesis.pending
            });
          }
        };
        
        // Try immediately first (in case speechSynthesis state is already cleared)
        setTimeout(enableMic, 50); // Reduced from 100ms to 50ms
        
        // Also try after a shorter delay as backup
        setTimeout(enableMic, 300); // Reduced from 600ms to 300ms
      };
      
      utterance.onerror = (event) => {
        setIsAISpeaking(false);
        
        // Don't show error for "interrupted" - it's expected when speech is cancelled
        // Also ignore "canceled" errors as they're intentional
        const errorType = event.error || '';
        const isExpectedError = errorType === 'interrupted' || errorType === 'canceled';
        
        if (!isExpectedError) {
          console.error('Speech synthesis error:', event.error, event.type);
          // Only show toast for unexpected errors
          toast({
            title: "Speech Error",
            description: `Failed to speak: ${event.error || 'Unknown error'}`,
            variant: "destructive",
          });
        } else {
          console.log('Speech synthesis cancelled/interrupted (expected)');
        }
      };
      
      // Speak with error handling
      try {
        // Clear any pending speech first
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
          await new Promise(resolve => setTimeout(resolve, 150));
        }
        
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error calling speak:', error);
        setIsAISpeaking(false);
        toast({
          title: "Speech Error",
          description: "Failed to start speech synthesis",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in speakText:', error);
      setIsAISpeaking(false);
    }
  };
  
  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      ensureVoicesLoaded().then(voices => {
        if (voices.length > 0) {
          console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        }
      });
    }
  }, []);

  // Camera setup
  useEffect(() => {
    const initCamera = async () => {
      console.log("Initializing camera on mount...");
      await startCamera();
    };
    initCamera();
    return () => {
      console.log("Cleaning up camera...");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);
  
  // Update video element when stream changes
  useEffect(() => {
    if (isCameraOn && streamRef.current && videoRef.current) {
      console.log("Updating video element with stream");
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => {
        console.error("Video play error:", err);
      });
    }
  }, [isCameraOn]);
  const startCamera = async () => {
    try {
      console.log("Requesting camera access...");
      
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: {
            ideal: 1280
          },
          height: {
            ideal: 720
          }
        },
        audio: true // Enable audio for recording
      });
      
      console.log("Camera stream obtained:", stream.active);
      streamRef.current = stream;
      setIsCameraOn(true);
      
      // Start video recording for job interviews
      if (isJobInterview && stream) {
        try {
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
          });
          
          const chunks: Blob[] = [];
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };
          
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            videoBlobRef.current = blob;
            console.log("Video recording stopped, blob size:", blob.size);
          };
          
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.start(1000); // Collect data every second
          console.log("Video recording started");
        } catch (error) {
          console.error("Error starting video recording:", error);
        }
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Video element srcObject set");
        
        try {
          await videoRef.current.play();
          console.log("Video playback started");
        } catch (playError) {
          console.error("Video play error:", playError);
        }
      }
      
      toast({
        title: "Camera Enabled",
        description: "Camera is now active",
      });
    } catch (error: any) {
      console.error("Camera Error:", error);
      
      let errorMessage = "Could not access camera. ";
      
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage += "Please allow camera access in your browser settings.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage += "No camera found on this device.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage += "Camera is being used by another application.";
      } else {
        errorMessage += error.message || "Unknown error occurred.";
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      setIsCameraOn(false);
    }
  };
  const stopCamera = () => {
    // Stop video recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraOn(false);
    }
  };

  // Start interview
  const handleStartInterview = async () => {
    try {
      if (!streamRef.current || !isCameraOn) {
        await startCamera();
        await new Promise(r => setTimeout(r, 1000));
      }
      setShowPhotoCapture(true);
    } catch {
      toast({
        title: "Error",
        description: "Failed to start camera.",
        variant: "destructive"
      });
    }
  };
  const handlePhotoConfirmed = async (photoDataUrl: string) => {
    setShowPhotoCapture(false);
    
    // Clear any previous interview state
    setMessages([]);
    setConversationText([]);
    setQuestionCount(0);
    setCodeAnswer('');
    setPseudoCodeAnswer('');
    currentQuestionIndexRef.current = -1;
    questionStartTimeRef.current = 0;
    accumulatedTranscriptRef.current = '';
    
    // For mock interviews, ensure job interview data is cleared
    if (!isJobInterview) {
      sessionStorage.removeItem('currentInterviewSession');
      sessionStorage.removeItem('currentJobId');
      sessionStorage.removeItem('currentJobQuestions');
      console.log('Cleared job interview data - starting fresh mock interview');
    }
    
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user && !isJobInterview) {
        // Only create Supabase session for mock interviews
        const {
          data: session
        } = await supabase.from("interview_sessions").insert({
          user_id: user.id,
          category,
          level: urlLevel,
          total_questions: totalQuestions,
          completed_at: null
        }).select().single();
        if (session) setSessionId(session.id);
      }
      setIsInterviewStarted(true);
      setIsMuted(false);
      isInterviewStartedRef.current = true;
      isMutedRef.current = false;
      // Reset violation count when interview starts
      setViolationCount(0);
      setShowViolationWarning(false);
      
      // Start timer
      interviewStartTimeRef.current = Date.now();
      setElapsedTime(0);
      
      // Enter fullscreen mode
      try {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
          await (element as any).mozRequestFullScreen();
        } else if ((element as any).msRequestFullscreen) {
          await (element as any).msRequestFullscreen();
        }
      } catch (error) {
        console.warn('Fullscreen not available:', error);
      }
      
      startListening();
      
      // For job interviews, start with first question context
      // For mock interviews, use category-specific greeting
      const greeting = isJobInterview && jobQuestions.length > 0
        ? [{
            role: "user" as const,
            content: `Hello, I'm ready to start the interview for ${mockData.getJobById(jobId || "")?.title || 'this position'}.`
          }]
        : [{
            role: "user" as const,
            content: `Hello, I'm ready to start the ${category} interview at ${urlLevel} level.`
          }];
      
      await streamAIResponse(greeting);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start interview.",
        variant: "destructive"
      });
    }
  };

  // AI streaming response
  const streamAIResponse = async (currentMessages: Message[]) => {
    try {
      setIsLoading(true);
      setAiStatus("Thinking...");
      
      // For job interviews, use Groq API directly with job context
      let response: Response;
      
      if (isJobInterview && jobQuestions.length > 0) {
        // Use Groq API for job-specific interviews
        const job = mockData.getJobById(jobId || "");
        const effectiveTotalQuestions = jobQuestions.length;
        
        // Determine which question we're on
        const nextQuestionIndex = questionCount < effectiveTotalQuestions ? questionCount : effectiveTotalQuestions - 1;
        const currentQuestion = jobQuestions[nextQuestionIndex];
        
        // Start tracking time for this question
        if (nextQuestionIndex !== currentQuestionIndexRef.current) {
          // Stop previous question video recording if exists
          const prevRecorder = questionVideoRecordersRef.current.get(currentQuestionIndexRef.current);
          if (prevRecorder && prevRecorder.state !== 'inactive') {
            prevRecorder.stop();
          }
          
          currentQuestionIndexRef.current = nextQuestionIndex;
          questionStartTimeRef.current = Date.now();
          
          // Reset code/pseudo code answers when moving to new question
          setCodeAnswer('');
          setPseudoCodeAnswer('');
          
          // Start video recording for this question
          if (isJobInterview && streamRef.current) {
            try {
              const questionRecorder = new MediaRecorder(streamRef.current, {
                mimeType: 'video/webm;codecs=vp9'
              });
              
              const chunks: Blob[] = [];
              questionVideoChunksRef.current.set(nextQuestionIndex, chunks);
              
              questionRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                  const currentChunks = questionVideoChunksRef.current.get(nextQuestionIndex) || [];
                  currentChunks.push(event.data);
                  questionVideoChunksRef.current.set(nextQuestionIndex, currentChunks);
                }
              };
              
              questionRecorder.onstop = () => {
                const currentChunks = questionVideoChunksRef.current.get(nextQuestionIndex) || [];
                const blob = new Blob(currentChunks, { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(blob);
                
                // Save video URL to interview session
                if (sessionId) {
                  const session = mockData.getInterviewSessionById(sessionId);
                  if (session && currentQuestion) {
                    const questionIndex = session.questions.findIndex(q => q.questionId === currentQuestion.id);
                    if (questionIndex >= 0) {
                      session.questions[questionIndex].videoUrl = videoUrl;
                      mockData.updateInterviewSession(sessionId, {
                        questions: session.questions
                      });
                    }
                  }
                }
                
                console.log(`Question ${nextQuestionIndex + 1} video recorded, blob size:`, blob.size);
              };
              
              questionVideoRecordersRef.current.set(nextQuestionIndex, questionRecorder);
              questionRecorder.start(1000); // Collect data every second
              console.log(`Started video recording for question ${nextQuestionIndex + 1}`);
            } catch (error) {
              console.error("Error starting question video recording:", error);
            }
          }
        }
        
        const interviewContext = {
          jobTitle: job?.title,
          jobDescription: job?.description,
          questions: jobQuestions,
          currentQuestionIndex: nextQuestionIndex,
          interviewRound: currentQuestion?.interviewRound || "General",
        };
        
        // Get stream from Groq API
        const stream = await conductInterview(
          currentMessages.map(m => ({ role: m.role, content: m.content })),
          interviewContext
        );
        
        // Convert ReadableStream to Response-like object for processing
        response = new Response(stream, {
          headers: { "Content-Type": "text/event-stream" }
        });
      } else {
        // Use Supabase function for mock interviews
        const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-interview`;
        
        response = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: currentMessages,
            category,
            level: urlLevel,
            action: "chat",
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed (${response.status})`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = "";
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.content || parsed.choices?.[0]?.delta?.content;
            if (delta) {
              aiResponseText += delta;
              // Clean markdown for typing display
              const cleanTyping = aiResponseText
                .replace(/\*\*([^*]+)\*\*/g, '$1')
                .replace(/\*([^*]+)\*/g, '$1')
                .replace(/__([^_]+)__/g, '$1')
                .replace(/_([^_]+)_/g, '$1')
                .replace(/##+\s*/g, '')
                .replace(/`([^`]+)`/g, '$1');
              setConversationText((prev) => {
                const filtered = prev.filter((t) => !t.startsWith("Interviewer (typing):"));
                return [...filtered, `Interviewer (typing): ${cleanTyping}`];
              });
            }
          } catch (e) {
            console.error("Error parsing SSE:", e);
          }
        }
      }

      // Clean markdown formatting from AI response
      const cleanAIResponse = aiResponseText
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove **bold**
        .replace(/\*([^*]+)\*/g, '$1') // Remove *italic*
        .replace(/__([^_]+)__/g, '$1') // Remove __bold__
        .replace(/_([^_]+)_/g, '$1') // Remove _italic_
        .replace(/##+\s*/g, '') // Remove markdown headers
        .replace(/`([^`]+)`/g, '$1') // Remove inline code
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/---+/g, '') // Remove horizontal rules
        .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
        .trim();

      setConversationText((prev) => {
        const filtered = prev.filter((t) => !t.startsWith("Interviewer (typing):"));
        return [...filtered, `Interviewer: ${cleanAIResponse}`];
      });

      setMessages((prev) => [...prev, { role: "assistant", content: cleanAIResponse }]);
      speakText(cleanAIResponse);
      
      // Increment question count after AI responds
      const effectiveTotalQuestions = isJobInterview ? jobQuestions.length : totalQuestions;
      setQuestionCount((prev) => {
        const newCount = prev + 1;
        console.log(`Question count: ${newCount}/${effectiveTotalQuestions}`);
        if (newCount > effectiveTotalQuestions) {
          console.warn(`Question count would exceed limit, keeping at ${prev}`);
          return prev;
        }
        return newCount;
      });
      setAiStatus("Listening...");
    } catch (error: any) {
      console.error("AI Response Error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send user message
  const handleSendMessage = async (userMsg: string) => {
    // Stop listening while processing to avoid capturing background noise
    if (isListening) {
      stopListening();
    }
    
    // Clear accumulated transcript and timeout
    accumulatedTranscriptRef.current = '';
    if (finalTranscriptTimeoutRef.current) {
      clearTimeout(finalTranscriptTimeoutRef.current);
      finalTranscriptTimeoutRef.current = null;
    }
    
    // For job interviews: Track time spent on current question and stop video recording
    if (isJobInterview && currentQuestionIndexRef.current >= 0 && questionStartTimeRef.current > 0) {
      const timeSpent = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
      const currentQuestion = jobQuestions[currentQuestionIndexRef.current];
      
      // Stop video recording for this question
      const questionRecorder = questionVideoRecordersRef.current.get(currentQuestionIndexRef.current);
      if (questionRecorder && questionRecorder.state !== 'inactive') {
        questionRecorder.stop();
        console.log(`Stopped video recording for question ${currentQuestionIndexRef.current + 1}`);
      }
      
      if (currentQuestion && sessionId) {
        const session = mockData.getInterviewSessionById(sessionId);
        if (session) {
          const questionIndex = session.questions.findIndex(q => q.questionId === currentQuestion.id);
          if (questionIndex >= 0) {
            session.questions[questionIndex].answer = userMsg;
            session.questions[questionIndex].timeSpent = timeSpent;
            
            // Always evaluate answer accuracy (even if expectedAnswer doesn't exist)
            try {
              const evaluation = await evaluateAnswer(
                currentQuestion.text,
                currentQuestion.expectedAnswer || "Evaluate based on question relevance and technical accuracy",
                userMsg
              );
              session.questions[questionIndex].accuracy = evaluation.accuracy;
              session.questions[questionIndex].correctedAnswer = evaluation.correctedAnswer;
              session.questions[questionIndex].answerAnalysis = evaluation.answerAnalysis;
              session.questions[questionIndex].evaluatedAt = new Date().toISOString();
            } catch (error) {
              console.error("Error evaluating answer:", error);
              // Set a default low score if evaluation fails
              session.questions[questionIndex].accuracy = 0;
              session.questions[questionIndex].correctedAnswer = currentQuestion.expectedAnswer || "No corrected answer available.";
              session.questions[questionIndex].answerAnalysis = "Evaluation failed.";
            }
            
            mockData.updateInterviewSession(sessionId, {
              questions: session.questions
            });
          }
        }
      }
    }
    
    // Clear AI speech reference when user sends a message (new conversation turn)
    lastAISpeechRef.current = '';
    aiSpeechEndTimeRef.current = 0;
    
    const newMessages = [...messages, {
      role: "user" as const,
      content: userMsg
    }];
    setMessages(newMessages);
    
    // Check if we've reached the question limit
    const effectiveTotalQuestions = isJobInterview ? jobQuestions.length : totalQuestions;
    if (questionCount >= effectiveTotalQuestions) {
      console.log(`Question limit reached (${questionCount}/${effectiveTotalQuestions}), ending interview after user response`);
      await handleEndInterview();
      return;
    }
    
    // Process AI response (this will increment questionCount)
    await streamAIResponse(newMessages);
    
    // Note: Mic will be auto-enabled when AI finishes speaking (handled in utterance.onend)
  };

  // End interview and analyze
  const handleEndInterview = async () => {
    // First, let the AI interviewer thank the candidate
    const thankYouMessage = "Thank you for completing the interview. Your responses have been recorded and will be analyzed. We appreciate your time and effort.";
    
    // Add thank you message to conversation
    const thankYouMsg: Message = {
      role: "assistant",
      content: thankYouMessage
    };
    
    setMessages(prev => [...prev, thankYouMsg]);
    setConversationText(prev => [...prev, thankYouMessage]);
    setIsAISpeaking(true);
    
    // Speak the thank you message
    await speakText(thankYouMessage);
    
    // Wait a moment for the message to be spoken
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Stop all recording and listening after thank you message
    stopListening();
    setIsMuted(true);
    isMutedRef.current = true;
    setIsInterviewStarted(false);
    isInterviewStartedRef.current = false;
    setIsLoading(true);
    setAiStatus("Generating performance report...");
    
    // Stop video recording if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop all question video recorders
    questionVideoRecordersRef.current.forEach((recorder, index) => {
      if (recorder && recorder.state !== 'inactive') {
        recorder.stop();
      }
    });
    questionVideoRecordersRef.current.clear();
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraOn(false);
    }
    
    // Stop any remaining speech synthesis
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setIsAISpeaking(false);
    
    try {
      // For job interviews, save to interview session and calculate overall score
      if (isJobInterview && sessionId) {
        const session = mockData.getInterviewSessionById(sessionId);
        if (session) {
          // Calculate overall score from question accuracies
          const answeredQuestions = session.questions.filter(q => q.answer && q.answer.trim() !== "");
          const totalAccuracy = answeredQuestions.reduce((sum, q) => sum + (q.accuracy || 0), 0);
          const averageAccuracy = answeredQuestions.length > 0 ? totalAccuracy / answeredQuestions.length : 0;
          
          // Generate AI remarks using Groq
          const job = mockData.getJobById(jobId || "");
          let aiRemarks = "";
          try {
            aiRemarks = await executeWithKeyRotation(async (apiKey: string) => {
              const groq = new Groq({
                apiKey,
                dangerouslyAllowBrowser: true,
              });
              
              const remarksPrompt = `Analyze this interview performance and provide brief feedback (2-3 sentences):
Job: ${job?.title || 'N/A'}
Questions Answered: ${answeredQuestions.length}/${session.questions.length}
Average Accuracy: ${averageAccuracy.toFixed(1)}%
Answers: ${answeredQuestions.map((q, i) => `Q${i+1}: ${q.answer.substring(0, 100)}...`).join('\n')}

Provide professional feedback on strengths, areas for improvement, and overall assessment.`;
            
              const remarksResponse = await groq.chat.completions.create({
                messages: [{ role: "user", content: remarksPrompt }],
                model: "openai/gpt-oss-120b",
                temperature: 0.7,
                max_completion_tokens: 300,
              });
              
              return remarksResponse.choices[0]?.message?.content || "";
            });
          } catch (error) {
            console.error("Error generating AI remarks:", error);
            aiRemarks = `Interview completed. Average accuracy: ${averageAccuracy.toFixed(1)}%. ${answeredQuestions.length} out of ${session.questions.length} questions answered.`;
          }
          
          // Determine overall status
          const overallStatus: "Passed" | "Failed" | "Pending" = 
            averageAccuracy >= 70 ? "Passed" : averageAccuracy >= 50 ? "Pending" : "Failed";
          
          // Save video URL if available
          let videoUrl = "";
          if (videoBlobRef.current) {
            videoUrl = URL.createObjectURL(videoBlobRef.current);
            // In production, upload to storage and get URL
          }
          
          // Update interview session
          mockData.updateInterviewSession(sessionId, {
            status: "Completed",
            completedAt: new Date().toISOString(),
            totalScore: averageAccuracy,
            aiRemarks,
            overallStatus,
            videoUrl: videoUrl || undefined,
          });
          
          // Create or update Interview entry in company dashboard
          const existingInterviews = mockData.getInterviews();
          const existingInterview = existingInterviews.find(int => int.jobTitle === job?.title);
          
          if (existingInterview) {
            // Update existing interview - add candidate to list
            const candidateExists = existingInterview.candidateList.some(c => c.email === session.candidateEmail);
            if (!candidateExists) {
              const updatedCandidateList = [
                ...existingInterview.candidateList,
                {
                  id: session.candidateId,
                  name: session.candidateName,
                  email: session.candidateEmail,
                  score: averageAccuracy,
                  aiRemarks: aiRemarks || "",
                  status: overallStatus || "Pending",
                }
              ];
              mockData.updateInterview(existingInterview.id, {
                candidates: updatedCandidateList.length,
                candidateList: updatedCandidateList,
                status: "Completed" as const,
              });
            } else {
              // Update existing candidate entry
              const updatedCandidateList = existingInterview.candidateList.map(c =>
                c.email === session.candidateEmail
                  ? {
                      ...c,
                      score: averageAccuracy,
                      aiRemarks: aiRemarks || "",
                      status: overallStatus || "Pending",
                    }
                  : c
              );
              mockData.updateInterview(existingInterview.id, {
                candidateList: updatedCandidateList,
                status: "Completed" as const,
              });
            }
          } else {
            // Create new interview entry
            mockData.addInterview({
              id: `INT-${Date.now()}`,
              jobTitle: job?.title || "Unknown Job",
              candidates: 1,
              date: new Date().toISOString().split('T')[0],
              status: "Completed",
              candidateList: [{
                id: session.candidateId,
                name: session.candidateName,
                email: session.candidateEmail,
                score: averageAccuracy,
                aiRemarks: aiRemarks || "",
                status: overallStatus || "Pending",
              }],
            });
          }
          
          // Exit fullscreen before navigating
          try {
            if (document.fullscreenElement || (document as any).webkitFullscreenElement || 
                (document as any).mozFullScreenElement || (document as any).msFullscreenElement) {
              if (document.exitFullscreen) {
                await document.exitFullscreen();
              } else if ((document as any).webkitExitFullscreen) {
                await (document as any).webkitExitFullscreen();
              } else if ((document as any).mozCancelFullScreen) {
                await (document as any).mozCancelFullScreen();
              } else if ((document as any).msExitFullscreen) {
                await (document as any).msExitFullscreen();
              }
            }
          } catch (error) {
            console.warn('Error exiting fullscreen:', error);
          }
          
          // Show thank you message
          toast({
            title: "Thank You!",
            description: "Thanks for completing the interview. Your responses have been recorded.",
            duration: 3000,
          });
          
          // Navigate to results page
          setTimeout(() => {
            navigate(`/interview-results/${sessionId}`);
          }, 1000);
          
          setIsLoading(false);
          return;
        }
      }
      
      // For mock interviews, use existing Supabase flow
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-interview`;
      
      const analysisMessages = [
        ...messages,
        {
          role: "system" as const,
          content: `Analyze the candidate's interview performance and return a JSON object with these fields: overall_score, technical_knowledge, communication_skills, confidence_level, problem_solving, ai_summary, strengths, and improvements.`,
        },
      ];

      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: analysisMessages,
          category,
          level: urlLevel,
          action: "analyze",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate report");

      const report = await response.json();
      setPerformanceReport(report);

      if (sessionId) {
        await supabase.from("interview_sessions").update({
          completed_at: new Date().toISOString()
        }).eq("id", sessionId);
        await supabase.from("interview_reports").insert({
          session_id: sessionId,
          ...report,
          conversation_history: messages
        });
      }
      // Show thank you message
      toast({
        title: "Thank You!",
        description: "Thanks for completing the interview. Your performance report is being generated.",
        duration: 3000,
      });
      
      setShowReport(true);
      setIsInterviewStarted(false);
      setIsMuted(true);
      isInterviewStartedRef.current = false;
      isMutedRef.current = true;
      
      // Ensure listening is stopped
      stopListening();
      
      // Clear conversation text and messages to reset UI
      setConversationText([]);
      setMessages([]);
      setQuestionCount(0);
      setElapsedTime(0);
    } catch (error: any) {
      console.error("Report generation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze performance.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleExitConfirm = async () => {
    stopCamera();
    stopListening();
    
    // Exit fullscreen if active
    try {
      if (document.fullscreenElement || (document as any).webkitFullscreenElement || 
          (document as any).mozFullScreenElement || (document as any).msFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.warn('Error exiting fullscreen:', error);
    }
    
    navigate("/");
  };
  // Keep refs in sync with state
  useEffect(() => {
    isInterviewStartedRef.current = isInterviewStarted;
  }, [isInterviewStarted]);
  
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Handle manual mute/unmute toggle and auto-enable
  useEffect(() => {
    if (!isInterviewStarted) return;
    
    // CRITICAL: Never start listening if AI is speaking or just finished
    const timeSinceAISpeech = Date.now() - aiSpeechEndTimeRef.current;
    const isTooSoonAfterAI = timeSinceAISpeech < 300; // Reduced to 300ms for faster response
    
    // Check if speech synthesis is actually active
    const isSpeechActive = window.speechSynthesis.speaking || window.speechSynthesis.pending || isAISpeaking;
    
    // Auto-enable mic when not muted and conditions are met
    if (!isMuted && !isListening && !isSpeechActive && !isTooSoonAfterAI) {
      console.log('Auto-enabling mic - conditions met in useEffect');
      // Immediate enable for better responsiveness
      const timeoutId = setTimeout(() => {
        // Double-check all conditions before enabling
        const canEnable = !isMuted && 
                         !isListening && 
                         isInterviewStarted && 
                         !isAISpeaking &&
                         !window.speechSynthesis.speaking &&
                         !window.speechSynthesis.pending;
        
        if (canEnable) {
          console.log('✓ Auto-enabling mic from useEffect');
          startListening();
        } else {
          console.log('Cannot enable - conditions changed:', {
            isMuted,
            isListening,
            isInterviewStarted,
            isAISpeaking,
            speaking: window.speechSynthesis.speaking,
            pending: window.speechSynthesis.pending
          });
        }
      }, 50); // Very short delay for immediate response
      return () => clearTimeout(timeoutId);
    } 
    // Stop listening if manually muted
    else if (isMuted && isListening) {
      console.log('Stopping listening - manually muted');
      stopListening();
    } 
    // Force stop if AI starts speaking while listening
    else if (isSpeechActive && isListening) {
      console.log('Stopping listening - AI is speaking');
      stopListening();
    }
  }, [isMuted, isInterviewStarted, isAISpeaking, isListening]);

  // Timer effect - update elapsed time every second
  useEffect(() => {
    if (!isInterviewStarted) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      if (interviewStartTimeRef.current > 0) {
        const elapsed = Math.floor((Date.now() - interviewStartTimeRef.current) / 1000);
        setElapsedTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isInterviewStarted]);

  // Format elapsed time as hours:minutes:seconds or minutes:seconds
  const formatElapsedTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Store handleEndInterview in ref to avoid dependency issues
  const handleEndInterviewRef = useRef(handleEndInterview);
  useEffect(() => {
    handleEndInterviewRef.current = handleEndInterview;
  }, [handleEndInterview]);

  // Handle Tab/Shift violations and disable copy-paste
  useEffect(() => {
    if (!isInterviewStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Alt+Tab together (window switching)
      const isAltTab = (e.key === 'Tab' || e.keyCode === 9) && e.altKey;
      
      // Detect Tab alone
      const isTab = (e.key === 'Tab' || e.keyCode === 9) && !e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey;
      
      // Allow Shift alone (needed for coding), but detect if used with Tab
      const isShiftTab = (e.key === 'Tab' || e.keyCode === 9) && e.shiftKey;
      
      // Detect Ctrl+Shift+I (DevTools) or Ctrl+Shift+J (Console)
      const isDevTools = (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.keyCode === 73 || e.keyCode === 74);
      
      if (isAltTab || isTab || isShiftTab || isDevTools) {
        // Prevent default behavior
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        const violationType = isAltTab ? 'Alt+Tab (Window Switching)' : 
                             isTab ? 'Tab' : 
                             isShiftTab ? 'Shift+Tab' : 
                             'DevTools';
        
        console.log('Violation detected:', { 
          key: e.key, 
          keyCode: e.keyCode, 
          violationType,
          shiftKey: e.shiftKey,
          ctrlKey: e.ctrlKey,
          altKey: e.altKey
        });
        
        // Ignore if it's been less than 1 second since last violation (prevent spam)
        const now = Date.now();
        if (now - lastViolationTimeRef.current < 1000) {
          console.log('Violation ignored - too soon after last one');
          return;
        }
        lastViolationTimeRef.current = now;
        
        // Increment violation count
        setViolationCount(prev => {
          const newCount = prev + 1;
          console.log('Violation count:', newCount);
          
          if (newCount <= 3) {
            // Show warning
            setShowViolationWarning(true);
            toast({
              title: "⚠️ Violation Warning",
              description: `${violationType} detected! Warning ${newCount}/3. Interview will be terminated on the 4th violation.`,
              variant: "destructive",
            });
            
            // Hide warning after 3 seconds
            setTimeout(() => setShowViolationWarning(false), 3000);
          } else {
            // Terminate interview on 4th violation
            toast({
              title: "❌ Interview Terminated",
              description: `Interview terminated due to multiple violations (${violationType} usage).`,
              variant: "destructive",
            });
            // Use setTimeout to avoid dependency issues
            setTimeout(() => {
              handleEndInterviewRef.current();
            }, 100);
          }
          
          return newCount;
        });
      }
      
      // Disable copy-paste shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
        e.preventDefault();
        e.stopPropagation();
        toast({
          title: "⚠️ Copy-Paste Disabled",
          description: "Copy-paste is not allowed during the interview.",
          variant: "default",
        });
      }
      
      // Disable F12 (Developer Tools) and other DevTools shortcuts
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          (e.ctrlKey && e.key === 'U') ||
          (e.ctrlKey && e.shiftKey && e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        toast({
          title: "⚠️ Developer Tools Disabled",
          description: "Developer tools are not allowed during the interview.",
          variant: "default",
        });
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Disable right-click context menu
      e.preventDefault();
      e.stopPropagation();
      toast({
        title: "⚠️ Right-Click Disabled",
        description: "Right-click is not allowed during the interview.",
        variant: "default",
      });
    };

    const handleCopy = (e: ClipboardEvent) => {
      // Prevent copy
      e.preventDefault();
      e.stopPropagation();
    };

    const handlePaste = (e: ClipboardEvent) => {
      // Prevent paste
      e.preventDefault();
      e.stopPropagation();
    };

    // Add event listeners with capture phase for better detection
    // Use both window and document to catch all events
    window.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });
    document.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('copy', handleCopy, true);
    window.addEventListener('paste', handlePaste, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('paste', handlePaste, true);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true } as any);
      document.removeEventListener('keydown', handleKeyDown, { capture: true } as any);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('copy', handleCopy, true);
      window.removeEventListener('paste', handlePaste, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('paste', handlePaste, true);
    };
  }, [isInterviewStarted, toast]);
  return <div className={`h-screen ${isDark ? "dark" : ""}`}>
      <GuidelinesModal isOpen={showGuidelines} onComplete={() => {
        setShowGuidelines(false);
        // Mark as seen in session storage to prevent showing again
        sessionStorage.setItem('hasSeenGuidelines', 'true');
      }} />
      <PhotoCaptureModal isOpen={showPhotoCapture} stream={streamRef.current} onPhotoConfirmed={handlePhotoConfirmed} onCancel={() => setShowPhotoCapture(false)} />
      {showReport && performanceReport && <PerformanceReport report={performanceReport} onClose={() => {
      setShowReport(false);
      navigate("/");
    }} />}

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Interview?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave the interview? Your progress will not be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExitConfirm}>Leave</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="h-screen bg-background text-foreground flex flex-col">
        <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-foreground dark:bg-foreground text-background dark:text-background shadow-lg border-b border-border">
          <Button variant="ghost" size="icon" onClick={() => setShowExitDialog(true)} className="text-background dark:text-background hover:bg-background/10 dark:hover:bg-background/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl font-semibold text-background dark:text-background">AI Interview - OpenAI Powered</h1>
            {isInterviewStarted && (
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-background/10 dark:bg-background/20 text-background dark:text-background border border-background/20 dark:border-background/30 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {formatElapsedTime(elapsedTime)}
              </div>
            )}
            {isInterviewStarted && violationCount > 0 && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                violationCount >= 3 
                  ? 'bg-red-500/20 dark:bg-red-500/30 text-red-700 dark:text-red-300 border border-red-400 dark:border-red-500' 
                  : 'bg-yellow-500/20 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300 border border-yellow-400 dark:border-yellow-500'
              }`}>
                ⚠️ Violations: {violationCount}/3
              </div>
            )}
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} className="text-background dark:text-background hover:bg-background/10 dark:hover:bg-background/10">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>
        

        <div className="flex-1 overflow-hidden flex">
          {/* Left Side - Main Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden p-3 md:p-4">
              <div className="h-full max-w-7xl mx-auto flex flex-col gap-4">
                {/* Video Feeds */}
                <div className="grid grid-cols-2 gap-3 h-[280px] lg:h-[320px]">
                  <VideoFeed title="You" videoRef={videoRef} isActive={isCameraOn} />
                  <VideoFeed title="AI Interviewer" isActive={true} isAI={true} aiStatus={aiStatus} isAISpeaking={isAISpeaking} />
                </div>
              </div>
            </div>

            {/* Footer Section - Only show when interview is started or not showing report */}
            {!showReport && (
              <div className="border-t border-border bg-card/50">
                <div className="max-w-7xl mx-auto p-4">
                  {/* Live Conversation - Only show mic indicators when interview is started */}
                  <div className="mb-4 h-[200px]">
                    <LiveConversation 
                      conversationText={conversationText} 
                      onSendMessage={handleSendMessage}
                      isListening={isInterviewStarted ? isListening : false}
                      isInterviewStarted={isInterviewStarted}
                      onToggleMic={() => {
                        // Only allow toggle when interview is started
                        if (!isInterviewStarted) return;
                        
                        // Toggle mic state - ensure it works properly and immediately
                        if (isListening) {
                          console.log('Manually disabling mic');
                          stopListening();
                          setIsMuted(true);
                          isMutedRef.current = true;
                        } else {
                          console.log('Manually enabling mic');
                          // Always allow manual toggle - user knows what they're doing
                          setIsMuted(false);
                          isMutedRef.current = false;
                          // Start listening immediately
                          setTimeout(() => {
                            if (!isMutedRef.current && !isAISpeaking && !window.speechSynthesis.speaking && isInterviewStarted) {
                              startListening();
                            }
                          }, 50); // Very short delay for immediate response
                        }
                      }}
                    />
                  </div>

                  {/* Interview Controls */}
                  <div className="flex justify-center">
                    <InterviewControls 
                      isInterviewStarted={isInterviewStarted} 
                      isMuted={isMuted} 
                      isCameraOn={isCameraOn} 
                      isLoading={isLoading} 
                      onStartInterview={handleStartInterview} 
                      onEndInterview={handleEndInterview} 
                      onToggleMute={() => {
                        if (!isInterviewStarted) return;
                        const newMuted = !isMuted;
                        setIsMuted(newMuted);
                        isMutedRef.current = newMuted;
                      }} 
                      onToggleCamera={() => {
                        if (!isInterviewStarted) return;
                        if (isCameraOn) {
                          stopCamera();
                        } else {
                          startCamera();
                        }
                      }} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Chat Panel or Code Editor/Notebook */}
          <div className="w-[400px] flex-shrink-0 flex flex-col">
            {(() => {
              // Check if current question is a coding question
              if (isJobInterview && isInterviewStarted && currentQuestionIndexRef.current >= 0) {
                const currentQuestion = jobQuestions[currentQuestionIndexRef.current];
                if (currentQuestion && currentQuestion.type === "Code") {
                  // Determine if it's pseudo code based on question text
                  const isPseudoCode = currentQuestion.text.toLowerCase().includes('pseudo') || 
                                      currentQuestion.text.toLowerCase().includes('algorithm') ||
                                      currentQuestion.text.toLowerCase().includes('approach') ||
                                      currentQuestion.text.toLowerCase().includes('steps');
                  
                  if (isPseudoCode) {
                    return (
                      <Notebook
                        value={pseudoCodeAnswer}
                        onChange={setPseudoCodeAnswer}
                        onSubmit={(code) => {
                          setPseudoCodeAnswer(code);
                          handleSendMessage(code);
                        }}
                        isDisabled={isLoading || !isInterviewStarted}
                      />
                    );
                  } else {
                    return (
                      <CodeEditor
                        value={codeAnswer}
                        onChange={setCodeAnswer}
                        language="javascript"
                        onSubmit={(code) => {
                          setCodeAnswer(code);
                          handleSendMessage(code);
                        }}
                        isDisabled={isLoading || !isInterviewStarted}
                      />
                    );
                  }
                }
              }
              
              // Default: Show chat panel
              return (
                <ChatPanel 
                  messages={messages} 
                  isInterviewStarted={isInterviewStarted} 
                  isLoading={isLoading} 
                  onSendMessage={handleSendMessage} 
                />
              );
            })()}
          </div>
        </div>
      </div>
    </div>;
};
export default AIInterview;