import { Camera, AlertCircle } from "lucide-react";
import Lottie from "lottie-react";
import aiInterviewerAnimation from "@/assets/ai-interviewer.json";
import { useEffect } from "react";

interface VideoFeedProps {
  title: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  isAI?: boolean;
  aiStatus?: string;
  isAISpeaking?: boolean;
}

export const VideoFeed = ({ title, videoRef, isActive, isAI, aiStatus, isAISpeaking = false }: VideoFeedProps) => {
  useEffect(() => {
    if (isActive && !isAI && videoRef?.current) {
      console.log("VideoFeed: Video element ready, stream:", videoRef.current.srcObject);
      
      // Ensure video plays
      const playVideo = async () => {
        try {
          if (videoRef.current && videoRef.current.srcObject) {
            await videoRef.current.play();
            console.log("VideoFeed: Video playing");
          }
        } catch (error) {
          console.error("VideoFeed: Play error", error);
        }
      };
      
      playVideo();
    }
  }, [isActive, isAI, videoRef]);

  return (
    <div className="relative bg-card rounded-2xl overflow-hidden border border-border h-full min-h-[200px] md:min-h-0">
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10">
        <span className={`${isAI ? 'bg-foreground dark:bg-foreground text-background dark:text-background' : 'bg-card/90 dark:bg-card/90'} backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-md ${isAI ? '' : 'text-foreground dark:text-foreground'}`}>
          {title}
        </span>
      </div>
      
      {isActive && !isAI ? (
        <>
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          {/* Debug overlay */}
          {videoRef?.current?.srcObject ? null : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm">
              <div className="text-center p-4">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Camera stream not connected</p>
                <p className="text-xs mt-1">Check console for details</p>
              </div>
            </div>
          )}
        </>
      ) : isAI ? (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
          {isAISpeaking && (
            <div 
              className="absolute inset-0 animate-voice-gradient"
              style={{
                background: "linear-gradient(90deg, transparent 0%, hsl(0, 0%, 20%) 25%, hsl(0, 0%, 40%) 50%, hsl(0, 0%, 20%) 75%, transparent 100%)",
                backgroundSize: "200% 100%",
                opacity: 0.3,
              }}
            />
          )}
          <div className="text-center relative z-10">
            <div className={`w-32 h-32 md:w-48 md:h-48 mx-auto mb-4 md:mb-6 flex items-center justify-center transition-transform duration-300 ${isAISpeaking ? 'scale-110' : 'scale-100'}`}>
              <Lottie 
                animationData={aiInterviewerAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <p className="text-xs md:text-sm text-foreground dark:text-foreground font-medium">
              {aiStatus || "AI Interviewer Ready"}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <Camera className="h-12 w-12 md:h-16 md:w-16 opacity-20" />
        </div>
      )}
    </div>
  );
};
