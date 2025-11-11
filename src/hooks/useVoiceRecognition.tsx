import { useState, useEffect, useRef } from 'react';

interface UseVoiceRecognitionProps {
  onResult: (transcript: string, isFinal: boolean) => void;
  continuous?: boolean;
  onError?: (error: string) => void;
  onRetry?: () => void;
}

export const useVoiceRecognition = ({ onResult, continuous = false, onError, onRetry }: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const shouldBeListeningRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        // Increase maxAlternatives to get better results
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event: any) => {
          try {
            if (!event.results || event.results.length === 0) {
              return;
            }
            
            // Get ALL results, not just the last one, to capture full speech
            let fullTranscript = '';
            let hasFinal = false;
            
            // Accumulate all results
            for (let i = 0; i < event.results.length; i++) {
              const result = event.results[i];
              if (result && result[0] && result[0].transcript) {
                fullTranscript += (fullTranscript ? ' ' : '') + result[0].transcript;
                if (result.isFinal) {
                  hasFinal = true;
                }
              }
            }
            
            // Get the last result for interim/final status
            const lastResult = event.results[event.results.length - 1];
            if (!lastResult || !lastResult[0]) {
              return;
            }
            
            const isFinal = lastResult.isFinal || hasFinal;
            
            // Use full accumulated transcript, not just last result
            const transcript = fullTranscript.trim();
            
            // Only process if we have a valid transcript
            if (transcript && transcript.length > 0) {
              console.log('Voice recognition result (full):', transcript, 'isFinal:', isFinal, 'results count:', event.results.length);
              // Send both interim and final results with full transcript
              onResult(transcript, isFinal);
            }
          } catch (error) {
            console.error('Error processing voice recognition result:', error);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          
          // Handle different error types
          if (event.error === 'no-speech') {
            console.log('No speech detected, continuing to listen...');
            if (shouldBeListeningRef.current && continuous) {
              setTimeout(() => {
                if (shouldBeListeningRef.current) {
                  try {
                    recognitionRef.current.start();
                  } catch (e) {
                    console.log('Already started');
                  }
                }
              }, 100);
            }
          } else if (event.error === 'network') {
            // Network error - retry after a short delay
            console.log('Network error detected, retrying in 2 seconds...');
            onError?.('Network error - retrying...');
            
            if (shouldBeListeningRef.current && continuous) {
              setTimeout(() => {
                if (shouldBeListeningRef.current) {
                  try {
                    console.log('Retrying speech recognition after network error...');
                    recognitionRef.current.start();
                    setIsListening(true);
                    onRetry?.();
                  } catch (e) {
                    console.error('Failed to restart after network error:', e);
                    onError?.('Failed to restart voice recognition');
                  }
                }
              }, 2000);
            }
          } else if (event.error === 'aborted') {
            // Aborted - just log, don't restart
            console.log('Speech recognition aborted');
            setIsListening(false);
          } else {
            // Other errors - stop listening
            console.error('Unhandled speech recognition error:', event.error);
            onError?.(event.error);
            setIsListening(false);
            shouldBeListeningRef.current = false;
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
          
          // Auto-restart in continuous mode if we should still be listening
          if (shouldBeListeningRef.current && continuous) {
            console.log('Auto-restarting speech recognition...');
            setTimeout(() => {
              if (shouldBeListeningRef.current) {
                try {
                  recognitionRef.current.start();
                  setIsListening(true);
                } catch (error) {
                  console.log('Recognition already started or error:', error);
                }
              }
            }, 100);
          }
        };
      }
    }

    return () => {
      shouldBeListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
      }
    };
  }, [onResult, continuous]);

  const startListening = () => {
    if (!recognitionRef.current) {
      console.error('Speech recognition not initialized');
      return;
    }
    
    if (isListening) {
      console.log('Already listening, skipping start');
      return;
    }
    
    try {
      shouldBeListeningRef.current = true;
      
      // Reset recognition state if needed
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore if not running
      }
      
      // Small delay to ensure clean start
      setTimeout(() => {
        if (shouldBeListeningRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
            setIsListening(true);
            console.log('✓ Started listening for speech');
          } catch (startError: any) {
            // If already started, that's ok
            if (startError.message?.includes('already started') || startError.name === 'InvalidStateError') {
              console.log('Recognition already started');
              setIsListening(true);
              shouldBeListeningRef.current = true;
            } else {
              console.error('Error starting recognition:', startError);
              shouldBeListeningRef.current = false;
            }
          }
        }
      }, 50);
    } catch (error: any) {
      console.error('Error in startListening:', error);
      shouldBeListeningRef.current = false;
    }
  };

  const stopListening = () => {
    shouldBeListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        console.log('Stopped listening for speech');
      } catch (error) {
        console.log('Error stopping recognition:', error);
      }
    }
  };

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
};
