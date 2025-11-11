import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send } from "lucide-react";
interface LiveConversationProps {
  conversationText: string[];
  onSendMessage?: (message: string) => void;
  isListening?: boolean;
  onToggleMic?: () => void;
  isInterviewStarted?: boolean;
}
export const LiveConversation = ({
  conversationText,
  onSendMessage,
  isListening = false,
  onToggleMic,
  isInterviewStarted = false
}: LiveConversationProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [conversationText]);
  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage("");
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return <div className="bg-card rounded-2xl p-4 border border-border h-full flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1">
          <h3 className="text-sm font-medium text-muted-foreground">Live Conversation</h3>
          {isInterviewStarted && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isListening 
                ? 'bg-primary/20 text-primary animate-pulse' 
                : 'bg-destructive/20 text-destructive'
            }`}>
              {isListening ? 'Listening...' : 'Muted'}
            </span>
          )}
        </div>
        {isInterviewStarted && onToggleMic && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Mic className={`h-4 w-4 ${isListening ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
            <Switch
              checked={isListening}
              onCheckedChange={onToggleMic}
              className="data-[state=checked]:bg-primary"
            />
            <span className="text-xs text-muted-foreground min-w-[60px]">
              {isListening ? 'ON' : 'OFF'}
            </span>
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1 min-h-0">
        {conversationText.length === 0 ? <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Conversation will appear here in real-time
          </div> : <div className="space-y-2">
            {conversationText.map((text, idx) => {
              const isUserSpeaking = text.startsWith("You (speaking):");
              const isUserFinal = text.startsWith("You:");
              const isInterviewer = text.startsWith("Interviewer");
              const isTyping = text.startsWith("Interviewer (typing):");
              
              // Extract text without prefix for CC display
              const displayText = text.replace(/^(You \(speaking\): |You: |Interviewer \(typing\): |Interviewer: )/, '');
              
              return (
                <div key={idx} className={`flex items-start gap-3 ${isUserSpeaking || isUserFinal ? 'justify-end' : 'justify-start'}`}>
                  {isInterviewer && !isTyping && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 animate-pulse flex-shrink-0" />
                  )}
                  <div className={`rounded-xl px-4 py-3 max-w-[85%] shadow-sm ${
                    isUserSpeaking 
                      ? "bg-gradient-to-r from-primary/15 to-primary/5 border-2 border-primary/40 text-foreground font-semibold" 
                      : isUserFinal
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 text-foreground font-medium"
                      : isInterviewer && !isTyping
                      ? "bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 text-accent-foreground font-medium"
                      : isTyping
                      ? "bg-muted/50 border border-muted text-muted-foreground italic"
                      : "bg-muted/30 text-muted-foreground"
                  }`}>
                    {/* Enhanced CC-style display for user speech */}
                    {(isUserSpeaking || isUserFinal) && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-primary/20">
                        <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-full">
                          <Mic className={`h-3.5 w-3.5 ${isUserSpeaking ? 'text-primary animate-pulse' : 'text-primary/70'}`} />
                          <span className="text-xs font-bold text-primary uppercase tracking-wide">CC</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          {isUserSpeaking ? 'Speaking...' : 'You said'}
                        </span>
                      </div>
                    )}
                    <p className={`leading-relaxed ${
                      isUserSpeaking 
                        ? "text-base" 
                        : isUserFinal
                        ? "text-sm"
                        : "text-sm"
                    }`}>
                      {displayText}
                    </p>
                  </div>
                  {(isUserSpeaking || isUserFinal) && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>}
      </ScrollArea>
    </div>;
};