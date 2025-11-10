import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw } from "lucide-react";

interface PhotoCaptureModalProps {
  isOpen: boolean;
  stream: MediaStream | null;
  onPhotoConfirmed: (photoDataUrl: string) => void;
  onCancel: () => void;
}

export const PhotoCaptureModal = ({ isOpen, stream, onPhotoConfirmed, onCancel }: PhotoCaptureModalProps) => {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [videoRefReady, setVideoRefReady] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    modalVideoRef.current = node;
    setVideoRefReady(!!node);
  }, []);
  // Attach stream to video element when modal opens
  useEffect(() => {
    if (!isOpen || capturedPhoto || !stream) {
      console.log("Modal video setup skipped:", { isOpen, capturedPhoto: !!capturedPhoto, stream: !!stream });
      setIsVideoReady(false);
      return;
    }

    const videoElement = modalVideoRef.current;
    if (!videoElement) {
      console.log("Modal video ref not ready yet");
      return;
    }

    console.log("Attaching stream to modal video element", stream);
    const tracks = stream.getVideoTracks();
    console.log("Stream tracks:", tracks, tracks[0]?.readyState);
    
    // Clone the stream to avoid conflicts with other video elements using the same track
    const cloned = new MediaStream(tracks.map(t => t.clone()));
    setLocalStream(cloned);
    
    videoElement.srcObject = cloned as MediaStream;
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.setAttribute('playsinline', 'true');

    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded, dimensions:", videoElement.videoWidth, "x", videoElement.videoHeight);
      // Some browsers don't set dimensions immediately; fallback to RAF checks
      const checkDims = () => {
        if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
          setIsVideoReady(true);
        } else {
          requestAnimationFrame(checkDims);
        }
      };
      checkDims();
    };

    const handleCanPlay = () => {
      console.log("Video canplay fired");
      setIsVideoReady(true);
    };

    const handlePlaying = () => {
      console.log("Video playing event");
      setIsVideoReady(true);
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('playing', handlePlaying);

    videoElement.play()
      .then(() => {
        console.log("Modal video playing successfully");
        setIsVideoReady(true);
      })
      .catch(e => {
        console.error("Modal video play failed:", e);
        // Retry once shortly after; some browsers need a tick
        setTimeout(() => {
          videoElement.play().then(() => {
            console.log("Modal video playing successfully on retry");
            setIsVideoReady(true);
          }).catch(err => console.error("Retry play failed:", err));
        }, 300);
      });

    // Cleanup function
    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('playing', handlePlaying);
      if (videoElement.srcObject) {
        console.log("Cleaning up modal video stream");
        const s = videoElement.srcObject as MediaStream;
        s.getTracks().forEach(t => t.stop());
        videoElement.srcObject = null;
      }
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
        setLocalStream(null);
      }
      setIsVideoReady(false);
    };
  }, [isOpen, stream, capturedPhoto, videoRefReady]);

  const capturePhoto = () => {
    if (!modalVideoRef.current) {
      console.error("Video ref not available for capture");
      return;
    }

    const video = modalVideoRef.current;
    
    if (!isVideoReady || video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Video not ready for capture:", { isVideoReady, width: video.videoWidth, height: video.videoHeight });
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      console.log("Capturing photo with dimensions:", canvas.width, "x", canvas.height);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      console.log("Photo captured successfully, data URL length:", photoDataUrl.length);
      setCapturedPhoto(photoDataUrl);
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onPhotoConfirmed(capturedPhoto);
      setCapturedPhoto(null);
    }
  };

  const handleCancel = () => {
    setCapturedPhoto(null);
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Capture Your Photo</DialogTitle>
          <DialogDescription>
            {capturedPhoto 
              ? "Review your photo. You can retake it if you're not satisfied."
              : "Position yourself in the frame and click capture when ready."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative bg-card rounded-lg overflow-hidden aspect-video">
            {capturedPhoto ? (
              <img 
                src={capturedPhoto} 
                alt="Captured photo" 
                className="w-full h-full object-cover"
              />
            ) : stream ? (
              <div className="relative w-full h-full">
                <video 
                  ref={setVideoRef}
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-full object-cover"
                />
                {!isVideoReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                    <p className="text-muted-foreground">Initializing camera...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">No camera stream available</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            {capturedPhoto ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleRetake}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retake Photo
                </Button>
                <Button 
                  onClick={handleConfirm}
                  className="gap-2"
                >
                  Continue to Interview
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={capturePhoto}
                  className="gap-2"
                  disabled={!isVideoReady}
                >
                  <Camera className="h-4 w-4" />
                  Capture Photo
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
