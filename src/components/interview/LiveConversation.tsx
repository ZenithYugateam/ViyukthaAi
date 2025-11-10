import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
      <div className="flex items-center gap-2 mb-3">
        {isInterviewStarted && onToggleMic && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMic}
            className={`h-9 w-9 rounded-full flex-shrink-0 ${
              !isListening 
                ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
          >
            {!isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
        <h3 className="text-sm font-medium text-muted-foreground">Live Conversation</h3>
      </div>
      
      <ScrollArea className="flex-1 min-h-0">
        {conversationText.length === 0 ? <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Conversation will appear here in real-time
          </div> : <div className="space-y-2">
            {conversationText.map((text, idx) => <p key={idx} className={`text-sm ${text.startsWith("You (speaking):") ? "text-primary font-medium italic animate-pulse" : text.startsWith("You:") ? "text-foreground font-medium" : text.startsWith("Interviewer:") ? "text-accent-foreground font-medium" : "text-muted-foreground"}`}>
                {text}
              </p>)}
            <div ref={messagesEndRef} />
          </div>}
      </ScrollArea>
    </div>;
};