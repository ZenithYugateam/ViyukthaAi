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
  return <div className="bg-card rounded-2xl p-4 border border-border h-full flex flex-col shadow-sm">
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2 flex-1">
          <h3 className="text-sm font-semibold text-foreground dark:text-foreground">Live Conversation</h3>
          {/* Only show mic status when interview is started */}
          {isInterviewStarted && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              isListening 
                ? 'bg-foreground/10 dark:bg-foreground/20 text-foreground dark:text-foreground animate-pulse border border-foreground/20' 
                : 'bg-muted text-muted-foreground border border-border'
            }`}>
              {isListening ? 'Listening...' : 'Muted'}
            </span>
          )}
        </div>
        {/* Only show mic controls when interview is started */}
        {isInterviewStarted && onToggleMic && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Mic className={`h-4 w-4 ${isListening ? 'text-foreground dark:text-foreground animate-pulse' : 'text-muted-foreground'}`} />
            <Switch
              checked={isListening}
              onCheckedChange={onToggleMic}
              className="data-[state=checked]:bg-foreground dark:data-[state=checked]:bg-foreground"
            />
            <span className="text-xs text-foreground dark:text-foreground font-medium min-w-[60px]">
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
              
              // Extract text without prefix for CC display and clean markdown
              let displayText = text.replace(/^(You \(speaking\): |You: |Interviewer \(typing\): |Interviewer: )/, '');
              // Clean markdown formatting
              displayText = displayText
                .replace(/\*\*([^*]+)\*\*/g, '$1')
                .replace(/\*([^*]+)\*/g, '$1')
                .replace(/__([^_]+)__/g, '$1')
                .replace(/_([^_]+)_/g, '$1')
                .replace(/##+\s*/g, '')
                .replace(/`([^`]+)`/g, '$1')
                .replace(/---+/g, '')
                .trim();
              
              return (
                <div key={idx} className={`flex items-start gap-3 ${isUserSpeaking || isUserFinal ? 'justify-end' : 'justify-start'}`}>
                  {isInterviewer && !isTyping && (
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground dark:bg-foreground mt-2 animate-pulse flex-shrink-0" />
                  )}
                  <div className={`rounded-xl px-4 py-3 max-w-[85%] shadow-sm ${
                    isUserSpeaking 
                      ? "bg-gradient-to-r from-foreground/10 dark:from-foreground/20 to-foreground/5 dark:to-foreground/10 border-2 border-foreground/30 dark:border-foreground/40 text-foreground dark:text-foreground font-semibold" 
                      : isUserFinal
                      ? "bg-gradient-to-r from-foreground/8 dark:from-foreground/15 to-foreground/4 dark:to-foreground/8 border border-foreground/20 dark:border-foreground/30 text-foreground dark:text-foreground font-medium"
                      : isInterviewer && !isTyping
                      ? "bg-card border border-border/50 dark:border-border text-foreground dark:text-foreground font-medium shadow-md"
                      : isTyping
                      ? "bg-muted/50 dark:bg-muted/30 border border-border text-muted-foreground dark:text-muted-foreground italic"
                      : "bg-muted/30 dark:bg-muted/20 text-muted-foreground dark:text-muted-foreground"
                  }`}>
                    {/* Enhanced CC-style display for user speech */}
                    {(isUserSpeaking || isUserFinal) && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-foreground/20 dark:border-foreground/30">
                        <div className="flex items-center gap-1.5 bg-foreground/10 dark:bg-foreground/20 px-2 py-0.5 rounded-full">
                          <Mic className={`h-3.5 w-3.5 ${isUserSpeaking ? 'text-foreground dark:text-foreground animate-pulse' : 'text-foreground/70 dark:text-foreground/70'}`} />
                          <span className="text-xs font-bold text-foreground dark:text-foreground uppercase tracking-wide">CC</span>
                        </div>
                        <span className="text-xs text-muted-foreground dark:text-muted-foreground font-medium">
                          {isUserSpeaking ? 'Speaking...' : 'You said'}
                        </span>
                      </div>
                    )}
                    <p className={`leading-relaxed ${
                      isUserSpeaking 
                        ? "text-base text-foreground dark:text-foreground" 
                        : isUserFinal
                        ? "text-sm text-foreground dark:text-foreground"
                        : "text-sm text-foreground dark:text-foreground"
                    }`}>
                      {displayText}
                    </p>
                  </div>
                  {(isUserSpeaking || isUserFinal) && (
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground dark:bg-foreground mt-2 flex-shrink-0" />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>}
      </ScrollArea>
    </div>;
};