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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Voice recognition
  const {
    isListening,
    startListening,
    stopListening
  } = useVoiceRecognition({
    onResult: (transcript, isFinal) => {
      // Stop AI speech when user starts speaking
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      if (isFinal) {
        // Add final transcript without filtering - keep conversation history
        setConversationText(prev => {
          const filtered = prev.filter(t => !t.startsWith("You (speaking): "));
          return [...filtered, `You: ${transcript}`];
        });
        if (isInterviewStarted && transcript.trim()) {
          handleSendMessage(transcript);
        }
      } else {
        // Update interim transcript by replacing the last interim entry
        setConversationText(prev => {
          const filtered = prev.filter(t => !t.startsWith("You (speaking): "));
          return [...filtered, `You (speaking): ${transcript}`];
        });
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
  
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices and select Indian English voice
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find Indian English voice (en-IN)
      let selectedVoice = voices.find(voice => 
        voice.lang === 'en-IN' || voice.lang.startsWith('en-IN')
      );
      
      // Fallback to other English voices if Indian not available
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en-') && (voice.name.includes('India') || voice.name.includes('Indian'))
        );
      }
      
      // Final fallback to any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en-'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name, selectedVoice.lang);
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        setIsAISpeaking(true);
        console.log('AI started speaking');
        // Don't stop listening, just note that AI is speaking
      };
      
      utterance.onend = () => {
        setIsAISpeaking(false);
        console.log('AI finished speaking');
      };
      
      utterance.onerror = (event) => {
        setIsAISpeaking(false);
        console.error('Speech synthesis error:', event);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices
      let voices = window.speechSynthesis.getVoices();
      
      // Some browsers load voices async
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        };
      } else {
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      }
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
    const newMessages = [...messages, {
      role: "user" as const,
      content: userMsg
    }];
    setMessages(newMessages);
    if (questionCount >= totalQuestions) {
      await handleEndInterview();
      return;
    }
    await streamAIResponse(newMessages);
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
  useEffect(() => {
    if (isInterviewStarted) {
      if (!isMuted && !isListening) startListening();else if (isMuted && isListening) stopListening();
    }
  }, [isMuted, isInterviewStarted]);
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
          
          <h1 className="text-lg md:text-xl font-semibold">AI Interview - OpenAI Powered</h1>
          
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
                      if (isListening) {
                        stopListening();
                        setIsMuted(true);
                      } else {
                        startListening();
                        setIsMuted(false);
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