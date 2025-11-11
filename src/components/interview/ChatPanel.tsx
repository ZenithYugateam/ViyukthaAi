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
  return <div className="w-full h-full border-l border-border flex flex-col">
      

      <ScrollArea className="flex-1 p-3 min-h-0">
        {messages.length === 0 ? <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet
          </div> : <div className="space-y-3">
            {messages.map((msg, idx) => <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>)}
          </div>}
      </ScrollArea>

      {/* Input Section */}
      <div className="p-3 border-t border-border">
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
            className="resize-none pr-24 bg-muted/50 border-border"
            rows={2}
            disabled={!isInterviewStarted || isLoading}
          />
          <div className="absolute right-2 bottom-2 flex gap-2">
            <Button
              size="icon"
              onClick={handleSend}
              className="h-8 w-8 rounded-full"
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