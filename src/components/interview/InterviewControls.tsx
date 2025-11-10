import { Button } from "@/components/ui/button";
import { Settings, Mic, MicOff, Camera, CameraOff } from "lucide-react";

interface InterviewControlsProps {
  isInterviewStarted: boolean;
  isMuted: boolean;
  isCameraOn: boolean;
  isLoading: boolean;
  onStartInterview: () => void;
  onEndInterview: () => void;
  onToggleMute: () => void;
  onToggleCamera: () => void;
}

export const InterviewControls = ({
  isInterviewStarted,
  isMuted,
  isCameraOn,
  isLoading,
  onStartInterview,
  onEndInterview,
  onToggleMute,
  onToggleCamera,
}: InterviewControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3 py-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full bg-muted hover:bg-muted/80 flex-shrink-0 hidden md:flex"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {!isInterviewStarted ? (
        <Button
          onClick={onStartInterview}
          disabled={isLoading}
          className="h-10 px-6 rounded-full gradient-primary text-white hover:opacity-90 font-semibold shadow-lg hover:shadow-xl transition-all text-sm flex-shrink-0"
        >
          Start Interview
        </Button>
      ) : (
        <Button
          onClick={onEndInterview}
          variant="destructive"
          className="h-10 px-6 rounded-full font-semibold shadow-lg text-sm flex-shrink-0"
        >
          End Interview
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          console.log("Camera button clicked, current state:", isCameraOn);
          onToggleCamera();
        }}
        className={`h-10 w-10 rounded-full flex-shrink-0 ${
          isCameraOn 
            ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        {isCameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
      </Button>
    </div>
  );
};