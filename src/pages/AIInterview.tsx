import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sun, Moon } from "lucide-react";
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
import { ConversationHistorySidebar } from "@/components/interview/ConversationHistorySidebar";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
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
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [performanceReport, setPerformanceReport] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
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
      
      // Stop AI speech when user starts speaking (with proper cleanup)
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
        setIsAISpeaking(false);
        // Note: Don't await here as this is a synchronous callback
        // The cancellation happens immediately
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
        // Accumulate final transcripts - user might still be speaking after a pause
        accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? ' ' : '') + cleanTranscript;
        
        // Clear any existing timeout
        if (finalTranscriptTimeoutRef.current) {
          clearTimeout(finalTranscriptTimeoutRef.current);
        }
        
        // Wait for more speech before sending (user might continue speaking after brief pause)
        // Increased delay to 2.5 seconds to capture full speech
        finalTranscriptTimeoutRef.current = setTimeout(() => {
          const fullTranscript = accumulatedTranscriptRef.current.trim();
          
          if (fullTranscript && isInterviewStarted) {
            // Add final transcript to conversation
            setConversationText(prev => {
              const filtered = prev.filter(t => !t.startsWith("You (speaking): "));
              return [...filtered, `You: ${fullTranscript}`];
            });
            
            // Only send if transcript is meaningful
            const fullMeaningfulWords = fullTranscript.split(/\s+/).filter(w => w.length > 1).length;
            if (fullTranscript.length >= minLength && fullMeaningfulWords >= 1 && !isFalsePositive) {
              if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                handleSendMessage(fullTranscript);
                // Clear accumulated transcript after sending
                accumulatedTranscriptRef.current = '';
                
                // Auto-disable mic after candidate finishes speaking (with delay)
                // Only auto-disable if user hasn't manually enabled it
                setTimeout(() => {
                  // Check if AI hasn't started speaking yet (user might want to continue)
                  // Only auto-disable if mic is still on and AI hasn't responded
                  if (isListening && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                    // Give user a chance to continue speaking - only disable after longer delay
                    setTimeout(() => {
                      if (isListening && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                        stopListening();
                        setIsMuted(true);
                      }
                    }, 3000); // Additional 3 seconds = total 4 seconds after message sent
                  }
                }, 1000); // Initial 1 second delay
              }
            }
          }
          
          finalTranscriptTimeoutRef.current = null;
        }, 2500); // Wait 2.5 seconds of silence before sending final transcript (increased to capture full speech)
        
        // Show accumulated transcript as interim while waiting
        const currentAccumulated = accumulatedTranscriptRef.current.trim();
        if (currentAccumulated) {
          setConversationText(prev => {
            const filtered = prev.filter(t => !t.startsWith("You (speaking): "));
            return [...filtered, `You (speaking): ${currentAccumulated}`];
          });
        }
      } else {
        // For interim results, combine with accumulated final results
        // This shows real-time speech as user is speaking
        const combinedTranscript = (accumulatedTranscriptRef.current ? accumulatedTranscriptRef.current + ' ' : '') + cleanTranscript;
        
        // Update interim transcript by replacing the last interim entry
        // Show all interim results to give real-time feedback
        if (combinedTranscript.length >= minLength || meaningfulWords >= 1) {
          setConversationText(prev => {
            const filtered = prev.filter(t => !t.startsWith("You (speaking): "));
            return [...filtered, `You (speaking): ${combinedTranscript}`];
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
        // Use longer delay to prevent picking up echo/feedback
        if (isInterviewStarted && !isMuted && !isListening) {
          setTimeout(() => {
            // Double-check conditions before auto-enabling
            // Make sure enough time has passed and AI is truly done
            const timeSinceEnd = Date.now() - aiSpeechEndTimeRef.current;
            if (!window.speechSynthesis.speaking && 
                !window.speechSynthesis.pending && 
                isInterviewStarted && 
                !isMuted && 
                !isListening &&
                timeSinceEnd >= 800) { // Wait at least 800ms after AI finishes
              console.log('Auto-enabling mic after AI finished speaking');
              startListening();
            }
          }, 1000); // Longer delay to ensure speech is fully finished and echo has died down
        }
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
        audio: false
      });
      
      console.log("Camera stream obtained:", stream.active);
      streamRef.current = stream;
      setIsCameraOn(true);
      
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
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
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
      // Reset violation count when interview starts
      setViolationCount(0);
      setShowViolationWarning(false);
      startListening();
      const greeting = [{
        role: "user" as const,
        content: "Hello, I'm ready to start the interview."
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
      
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-interview`;
      
      const response = await fetch(CHAT_URL, {
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
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              aiResponseText += delta;
              setConversationText((prev) => {
                const filtered = prev.filter((t) => !t.startsWith("Interviewer (typing):"));
                return [...filtered, `Interviewer (typing): ${aiResponseText}`];
              });
            }
          } catch (e) {
            console.error("Error parsing SSE:", e);
          }
        }
      }

      setConversationText((prev) => {
        const filtered = prev.filter((t) => !t.startsWith("Interviewer (typing):"));
        return [...filtered, `Interviewer: ${aiResponseText}`];
      });

      setMessages((prev) => [...prev, { role: "assistant", content: aiResponseText }]);
      speakText(aiResponseText);
      setQuestionCount((prev) => prev + 1);
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
    
    // Clear AI speech reference when user sends a message (new conversation turn)
    lastAISpeechRef.current = '';
    aiSpeechEndTimeRef.current = 0;
    
    const newMessages = [...messages, {
      role: "user" as const,
      content: userMsg
    }];
    setMessages(newMessages);
    
    if (questionCount >= totalQuestions) {
      await handleEndInterview();
      return;
    }
    
    // Process AI response
    await streamAIResponse(newMessages);
    
    // Note: Mic will be auto-enabled when AI finishes speaking (handled in utterance.onend)
  };

  // End interview and analyze
  const handleEndInterview = async () => {
    stopListening();
    setIsLoading(true);
    setAiStatus("Generating performance report...");
    
    try {
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
      setShowReport(true);
      setIsInterviewStarted(false);
      setIsMuted(true);
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
  const handleExitConfirm = () => {
    stopCamera();
    stopListening();
    navigate("/");
  };
  // Handle manual mute/unmute toggle and auto-enable
  useEffect(() => {
    if (!isInterviewStarted) return;
    
    // CRITICAL: Never start listening if AI is speaking or just finished
    const timeSinceAISpeech = Date.now() - aiSpeechEndTimeRef.current;
    const isTooSoonAfterAI = timeSinceAISpeech < 1000;
    
    // Auto-enable mic when not muted and conditions are met
    if (!isMuted && !isListening && !isAISpeaking && !window.speechSynthesis.speaking && !window.speechSynthesis.pending && !isTooSoonAfterAI) {
      console.log('Auto-enabling mic - conditions met');
      // Small delay to ensure clean start
      const timeoutId = setTimeout(() => {
        if (!isMuted && !isListening && isInterviewStarted) {
          startListening();
        }
      }, 200);
      return () => clearTimeout(timeoutId);
    } 
    // Stop listening if manually muted
    else if (isMuted && isListening) {
      console.log('Stopping listening - manually muted');
      stopListening();
    } 
    // Force stop if AI starts speaking while listening
    else if (isAISpeaking && isListening) {
      console.log('Stopping listening - AI is speaking');
      stopListening();
    }
  }, [isMuted, isInterviewStarted, isAISpeaking, isListening]);

  // Store handleEndInterview in ref to avoid dependency issues
  const handleEndInterviewRef = useRef(handleEndInterview);
  useEffect(() => {
    handleEndInterviewRef.current = handleEndInterview;
  }, [handleEndInterview]);

  // Handle Tab/Shift violations and disable copy-paste
  useEffect(() => {
    if (!isInterviewStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Tab or Shift key presses
      // Check both key and keyCode for better compatibility
      const isTab = e.key === 'Tab' || e.keyCode === 9;
      // For Shift: check if it's pressed alone (not with other keys) or if Shift key is the main key
      const isShift = (e.key === 'Shift' || e.keyCode === 16) && !e.ctrlKey && !e.altKey && !e.metaKey;
      
      if (isTab || isShift) {
        // Prevent default behavior
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('Tab/Shift detected:', { 
          key: e.key, 
          keyCode: e.keyCode, 
          isTab, 
          isShift,
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
              description: `Tab/Shift key detected! Warning ${newCount}/3. Interview will be terminated on the 4th violation.`,
              variant: "destructive",
            });
            
            // Hide warning after 3 seconds
            setTimeout(() => setShowViolationWarning(false), 3000);
          } else {
            // Terminate interview on 4th violation
            toast({
              title: "❌ Interview Terminated",
              description: "Interview terminated due to multiple violations (Tab/Shift key usage).",
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
      
      // Disable F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
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
      <GuidelinesModal isOpen={showGuidelines} onComplete={() => setShowGuidelines(false)} />
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
        <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-[hsl(200,40%,25%)] text-white">
          <Button variant="ghost" size="icon" onClick={() => setShowExitDialog(true)} className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl font-semibold">AI Interview - OpenAI Powered</h1>
            {isInterviewStarted && violationCount > 0 && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                violationCount >= 3 
                  ? 'bg-red-500/20 text-red-200 border border-red-400' 
                  : 'bg-yellow-500/20 text-yellow-200 border border-yellow-400'
              }`}>
                ⚠️ Violations: {violationCount}/3
              </div>
            )}
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} className="text-white hover:bg-white/10">
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

            {/* Footer Section */}
            <div className="border-t border-border bg-card/50">
              <div className="max-w-7xl mx-auto p-4">
                {/* Live Conversation */}
                <div className="mb-4 h-[200px]">
                  <LiveConversation 
                    conversationText={conversationText} 
                    onSendMessage={handleSendMessage}
                    isListening={isListening}
                    isInterviewStarted={isInterviewStarted}
                    onToggleMic={() => {
                      // Toggle mic state - ensure it works properly
                      if (isListening) {
                        console.log('Manually disabling mic');
                        stopListening();
                        setIsMuted(true);
                      } else {
                        console.log('Manually enabling mic');
                        // Make sure AI is not speaking before enabling
                        if (!isAISpeaking && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                          setIsMuted(false);
                          // Start listening immediately after unmuting
                          setTimeout(() => {
                            startListening();
                          }, 150);
                        } else {
                          toast({
                            title: "Cannot Enable Mic",
                            description: "Please wait for AI to finish speaking.",
                            variant: "default",
                          });
                          // Don't change mute state if AI is speaking
                        }
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
                    onToggleMute={() => setIsMuted(!isMuted)} 
                    onToggleCamera={() => {
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
          </div>

          {/* Right Side - Chat Panel */}
          <div className="w-[400px] flex-shrink-0 flex flex-col">
            <ChatPanel messages={messages} isInterviewStarted={isInterviewStarted} isLoading={isLoading} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>;
};
export default AIInterview;