import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Maximize2 } from "lucide-react";
interface Message {
  role: "user" | "assistant";
  content: string;
}
interface ChatPanelProps {
  messages: Message[];
  isInterviewStarted: boolean;
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}
export const ChatPanel = ({
  messages,
  isInterviewStarted,
  isLoading,
  onSendMessage
}: ChatPanelProps) => {
  const [message, setMessage] = useState("");
  
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };
  return <div className="w-full h-full border-l border-border bg-card flex flex-col shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-card/50">
        <h3 className="text-sm font-semibold text-foreground dark:text-foreground">Chat</h3>
      </div>

      <ScrollArea className="flex-1 p-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground dark:text-muted-foreground text-sm">
            No messages yet
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => {
              // Clean markdown formatting
              const cleanContent = msg.content
                .replace(/\*\*([^*]+)\*\*/g, '$1')
                .replace(/\*([^*]+)\*/g, '$1')
                .replace(/__([^_]+)__/g, '$1')
                .replace(/_([^_]+)_/g, '$1')
                .replace(/##+\s*/g, '')
                .replace(/`([^`]+)`/g, '$1')
                .replace(/---+/g, '')
                .trim();
              
              return (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-foreground dark:bg-foreground text-background dark:text-background font-medium' 
                      : 'bg-card border border-border text-foreground dark:text-foreground'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{cleanContent}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Input Section */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              return false;
            }}
            onCopy={(e) => {
              e.preventDefault();
              return false;
            }}
            onCut={(e) => {
              e.preventDefault();
              return false;
            }}
            placeholder="Type or speak your answer..."
            className="resize-none pr-12 bg-background dark:bg-background border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground"
            rows={2}
            disabled={!isInterviewStarted || isLoading}
          />
          <div className="absolute right-3 bottom-3">
            <Button
              size="icon"
              onClick={handleSend}
              className="h-8 w-8 rounded-full bg-foreground dark:bg-foreground text-background dark:text-background hover:opacity-90 shadow-md"
              disabled={!message.trim() || !isInterviewStarted || isLoading}
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>;
};