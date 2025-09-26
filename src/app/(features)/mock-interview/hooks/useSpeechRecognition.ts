import { useState, useRef, useCallback, useEffect } from "react";

interface SpeechRecognitionHook {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  error: string | null;
  resetTranscript: () => void;
}

export const useSpeechRecognition = (
  onTranscript?: (text: string) => void,
  language: string = 'en-US'
): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(onTranscript); // ✅ Sử dụng ref cho callback

  // ✅ Cập nhật callback ref
  useEffect(() => {
    callbackRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        console.log('✅ Speech Recognition supported');
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;

        // ✅ Cấu hình giống test thành công
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          console.log('🎤 Speech recognition STARTED');
          setIsListening(true);
          setError(null);
          
          // ✅ Auto stop sau 30 giây
          timeoutRef.current = setTimeout(() => {
            console.log('⏰ Auto stopping after timeout');
            recognition.stop();
          }, 30000);
        };

        recognition.onresult = (event: any) => {
          console.log('📊 Speech recognition onresult event:', event);
          console.log('Results length:', event.results.length);
          
          // ✅ Clear timeout khi có kết quả
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          let finalTranscript = '';
          let interimTranscript = '';
          
          // ✅ Xử lý giống test thành công
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            
            console.log(`Result ${i}:`, {
              transcript,
              isFinal: result.isFinal,
              confidence: result[0].confidence
            });
            
            if (result.isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          const currentTranscript = finalTranscript || interimTranscript;
          console.log('📝 Current transcript:', currentTranscript);
          
          if (currentTranscript && currentTranscript.trim().length > 0) {
            setTranscript(currentTranscript);
            
            // ✅ Sử dụng callbackRef thay vì onTranscript
            if (callbackRef.current) {
              console.log('📞 Calling callback with:', currentTranscript);
              callbackRef.current(currentTranscript);
              
              // ✅ Auto stop sau final transcript
              if (finalTranscript && finalTranscript.trim().length > 2) {
                setTimeout(() => {
                  console.log('🛑 Auto stopping after final transcript');
                  recognition.stop();
                }, 1500);
              }
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.error('❌ Speech recognition error:', event.error, event);
          setError(`Speech error: ${event.error}`);
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          // ✅ Chỉ restart cho một số lỗi nhất định
          if (event.error === 'no-speech') {
            console.log('🔄 Restarting due to no speech...');
            setTimeout(() => {
              if (recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (e) {
                  console.error('Failed to restart:', e);
                  setIsListening(false);
                }
              }
            }, 500);
          } else {
            setIsListening(false);
          }
        };

        recognition.onend = () => {
          console.log('🛑 Speech recognition ENDED');
          setIsListening(false);
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };

        // ✅ Debug events
        recognition.onspeechstart = () => console.log('🗣️ Speech detected!');
        recognition.onspeechend = () => console.log('🤐 Speech ended');
        recognition.onsoundstart = () => console.log('🔊 Sound detected');
        recognition.onsoundend = () => console.log('🔇 Sound ended');

      } else {
        console.error('❌ Speech Recognition NOT supported');
        setIsSupported(false);
        setError('Speech recognition not supported');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [language]); // ✅ Loại bỏ onTranscript và isListening khỏi dependencies

  const startListening = useCallback(() => {
    console.log('🚀 startListening called, isListening:', isListening);
    
    if (recognitionRef.current && !isListening) {
      try {
        setError(null);
        setTranscript('');
        console.log('🎯 Actually starting recognition...');
        recognitionRef.current.start();
      } catch (error) {
        console.error('❌ Error starting recognition:', error);
        setError('Failed to start speech recognition');
      }
    } else {
      console.log('⚠️ Cannot start - already listening or no recognition available');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    console.log('⏹️ stopListening called, isListening:', isListening);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  };
};