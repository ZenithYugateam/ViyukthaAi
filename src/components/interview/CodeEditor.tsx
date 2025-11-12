import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Code2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onSubmit: (code: string) => void;
  isDisabled?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  onSubmit,
  isDisabled = false,
}) => {
  const { toast } = useToast();
  const [code, setCode] = useState(value);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(value);
  }, [value]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange(newCode);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    // Simulate code execution (in production, this would call an API)
    setTimeout(() => {
      setOutput('Code executed successfully. Output will be evaluated by the interviewer.');
      setIsRunning(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }
    onSubmit(code);
  };

  // Detect language from code or use provided language
  const detectLanguage = (code: string): string => {
    if (code.includes('def ') || code.includes('import ')) return 'python';
    if (code.includes('function ') || code.includes('const ') || code.includes('let ')) return 'javascript';
    if (code.includes('public class') || code.includes('public static')) return 'java';
    if (code.includes('#include') || code.includes('int main')) return 'cpp';
    return language;
  };

  const currentLang = detectLanguage(code);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Code Editor ({currentLang})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!code.trim()}
              className="h-7"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRun}
              disabled={!code.trim() || isRunning || isDisabled}
              className="h-7"
            >
              <Play className="h-3 w-3 mr-1" />
              Run
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 p-3">
        <div className="flex-1 relative">
          <textarea
            value={code}
            onChange={handleCodeChange}
            disabled={isDisabled}
            placeholder={`Write your ${currentLang} code here...\n\nExample:\nfunction solution() {\n  // Your code here\n  return result;\n}`}
            className="w-full h-full font-mono text-sm p-3 rounded-md border border-input bg-[#1e1e1e] text-[#d4d4d4] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              tabSize: 2,
            }}
            onKeyDown={(e) => {
              // Handle tab indentation
              if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                const textarea = e.currentTarget;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newValue = code.substring(0, start) + '  ' + code.substring(end);
                setCode(newValue);
                onChange(newValue);
                setTimeout(() => {
                  textarea.selectionStart = textarea.selectionEnd = start + 2;
                }, 0);
              }
            }}
          />
        </div>
        
        {output && (
          <div className="p-2 bg-muted rounded-md text-xs font-mono">
            <div className="font-semibold mb-1">Output:</div>
            <div className="text-muted-foreground">{output}</div>
          </div>
        )}
        
        <Button
          onClick={handleSubmit}
          disabled={!code.trim() || isDisabled}
          className="w-full"
        >
          Submit Code Answer
        </Button>
      </CardContent>
    </Card>
  );
};

