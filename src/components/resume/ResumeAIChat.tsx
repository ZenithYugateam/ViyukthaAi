import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export const ResumeAIChat = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('resume-chat-messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(() => {
    const saved = localStorage.getItem('resume-uploaded');
    return saved === 'true';
  });
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem('resume-chat-messages', JSON.stringify(messages));
  }, [messages]);

  // Persist resume upload status
  useEffect(() => {
    localStorage.setItem('resume-uploaded', String(resumeUploaded));
  }, [resumeUploaded]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Show upload prompt after job description is entered
  useEffect(() => {
    if (!resumeUploaded && messages.length >= 2) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant") {
        setShowUploadPrompt(true);
      }
    }
  }, [messages, resumeUploaded]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setResumeUploaded(true);
    setShowUploadPrompt(false);
    const userMessage = `I've uploaded my resume (${file.name}). Please analyze it against the job description I provided and suggest specific improvements to match the role better.`;
    
    await sendMessage(userMessage);
    
    toast({
      title: "Resume uploaded",
      description: "Analyzing your resume against the job requirements...",
    });
  };

  const streamChat = async (messages: Message[]) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resume-analysis`;

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (resp.status === 402) {
        throw new Error("AI credits exhausted. Please add credits to continue.");
      }
      throw new Error("Failed to get AI response");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    let assistantContent = "";

    while (!streamDone) {
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
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat([...messages, userMsg]);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] bg-white">
      <div className="p-4 border-b bg-gradient-primary">
        <h2 className="text-xl font-bold text-white">AI Resume Coach</h2>
        <p className="text-sm text-white/90">Upload your resume and get expert feedback</p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6">
            <Bot className="w-16 h-16 text-primary" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AI Resume Coach 👋
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                I'll help you tailor your resume to match any job description perfectly
              </p>
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 mb-4 border border-primary/10">
                <p className="text-sm font-semibold text-gray-900 mb-3">How it works:</p>
                <div className="text-left space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
                    <p className="text-xs text-gray-600">Paste the job description you're applying for</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</span>
                    <p className="text-xs text-gray-600">Upload your current resume (PDF)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">3</span>
                    <p className="text-xs text-gray-600">Get AI-powered suggestions to optimize your resume</p>
                  </div>
                </div>
              </div>
              {localStorage.getItem('resume-chat-messages') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem('resume-chat-messages');
                    localStorage.removeItem('resume-uploaded');
                    setMessages([]);
                    setResumeUploaded(false);
                    setShowUploadPrompt(false);
                  }}
                  className="w-full text-xs mb-2"
                >
                  Clear Previous Session
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === "user"
                      ? "bg-gradient-primary text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                </div>
              </div>
            )}
            {showUploadPrompt && !resumeUploaded && !isLoading && (
              <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border-2 border-dashed border-primary/20">
                <Upload className="w-10 h-10 text-primary" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Ready to upload your resume?
                  </p>
                  <p className="text-xs text-gray-600 mb-3">
                    Upload a PDF file to continue with the analysis
                  </p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="gradient-primary hover:gradient-primary-hover"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resume (PDF)
                </Button>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={
              messages.length === 0
                ? "Paste the job description here (include job title, requirements, responsibilities)..."
                : "Type your response or question..."
            }
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="gradient-primary hover:gradient-primary-hover h-[60px]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          {resumeUploaded && messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm"
            >
              <Upload className="w-3 h-3 mr-2" />
              Upload Different Resume
            </Button>
          )}
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to start a new conversation? This will clear all messages.')) {
                  localStorage.removeItem('resume-chat-messages');
                  localStorage.removeItem('resume-uploaded');
                  setMessages([]);
                  setResumeUploaded(false);
                  setShowUploadPrompt(false);
                  setInput("");
                }
              }}
              className="text-sm text-destructive hover:text-destructive"
            >
              Clear Chat
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </Card>
  );
};