import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotebookProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (pseudoCode: string) => void;
  isDisabled?: boolean;
}

export const Notebook: React.FC<NotebookProps> = ({
  value,
  onChange,
  onSubmit,
  isDisabled = false,
}) => {
  const { toast } = useToast();
  const [pseudoCode, setPseudoCode] = useState(value);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPseudoCode(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setPseudoCode(newValue);
    onChange(newValue);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pseudoCode);
    setCopied(true);
    toast.success('Pseudo code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!pseudoCode.trim()) {
      toast.error('Please write some pseudo code before submitting');
      return;
    }
    onSubmit(pseudoCode);
  };

  return (
    <Card className="w-full h-full flex flex-col bg-white border-2 border-gray-300 shadow-lg">
      <CardHeader className="pb-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2 text-gray-800">
            <FileText className="h-4 w-4" />
            Pseudo Code Notebook
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!pseudoCode.trim()}
            className="h-7 bg-white"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 p-4 bg-white">
        <div className="flex-1 relative">
          {/* Notebook lines effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="border-b border-blue-300"
                style={{ height: '24px', marginTop: i === 0 ? 0 : '24px' }}
              />
            ))}
          </div>
          
          <textarea
            value={pseudoCode}
            onChange={handleChange}
            disabled={isDisabled}
            placeholder={`Write your pseudo code here...\n\nExample:\n1. Initialize variables\n2. Loop through input\n3. Check condition\n4. Return result`}
            className="w-full h-full font-mono text-sm p-4 rounded-md bg-transparent text-gray-900 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 relative z-10"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              lineHeight: '24px',
              background: 'transparent',
            }}
          />
        </div>
        
        <div className="text-xs text-gray-500 italic pt-2 border-t border-gray-200">
          Tip: Write step-by-step pseudo code explaining your approach
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!pseudoCode.trim() || isDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Submit Pseudo Code Answer
        </Button>
      </CardContent>
    </Card>
  );
};

