import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Lottie from "lottie-react";
import clipboardAnimation from "@/assets/clipboard-animation.json";
import visibilityAnimation from "@/assets/visibility-animation.json";
import voiceAnimation from "@/assets/voice-animation.json";
import tabAnimation from "@/assets/tab-animation.json";
import faceAnimation from "@/assets/face-animation.json";

interface GuidelinesModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const GuidelinesModal = ({ isOpen, onComplete }: GuidelinesModalProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Reset slide when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen]);

  const guidelines = [
    {
      title: "Don't use copy-paste",
      description: "Copying content is not allowed during the test. Please answer questions independently.",
    },
    {
      title: "Only you should be visible",
      description: "Another person in view will be flagged; the test is being monitored.",
    },
    {
      title: "Tab switching is monitored",
      description: "Avoid switching tabs during the test. Tab changes are tracked and may result in warnings.",
    },
    {
      title: "Multi-voice detection",
      description: "Background voices are detected and may raise concerns. Ensure a quiet environment.",
    },
    {
      title: "Face must stay in view",
      description: "Moving out of camera view will trigger detection. Stay visible at all times.",
    },
  ];

  const handleNext = () => {
    if (currentSlide < guidelines.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Just close the modal, don't navigate (we're already on the interview page)
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const isLastSlide = currentSlide === guidelines.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-background">
        {/* Content */}
        <div className="p-6 text-center">
          {/* Icon/Image */}
          <div className="mb-4 w-48 h-48 mx-auto">
            {currentSlide === 0 ? (
              <Lottie 
                animationData={clipboardAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            ) : currentSlide === 1 ? (
              <Lottie 
                animationData={visibilityAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            ) : currentSlide === 2 ? (
              <Lottie 
                animationData={tabAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            ) : currentSlide === 3 ? (
              <Lottie 
                animationData={voiceAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Lottie 
                animationData={faceAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {guidelines[currentSlide].title}
          </h2>

          {/* Description */}
          <p className="text-muted-foreground text-base mb-6 leading-relaxed max-w-lg mx-auto">
            {guidelines[currentSlide].description}
          </p>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mb-4">
            {guidelines.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-8 bg-primary"
                    : index < currentSlide
                    ? "w-2 bg-primary"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-border p-6 flex justify-between items-center bg-muted/30">
          <Button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            variant="outline"
            className="disabled:opacity-30"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            variant="default"
            className={isLastSlide ? "bg-primary hover:bg-primary/90" : ""}
          >
            {isLastSlide ? "Start Interview" : "Next"}
            {!isLastSlide && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
