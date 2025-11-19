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
        
        console.log('🎤 Speech Recognition configured:', {
          continuous: recognition.continuous,
          interimResults: recognition.interimResults,
          lang: recognition.lang,
          maxAlternatives: recognition.maxAlternatives
        });

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
          
          // ✅ Reset timeout để tiếp tục ghi nếu user đang nói
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            // ✅ Auto stop sau 30 giây
            timeoutRef.current = setTimeout(() => {
              console.log('⏰ Auto stopping after timeout');
              recognition.stop();
            }, 30000);
          }
          
          let fullTranscript = '';
          
          // ✅ GHI LẠI TOÀN BỘ từ đầu đến giờ (như YouTube/Google)
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            
            console.log(`Result ${i}:`, {
              transcript,
              isFinal: result.isFinal,
              confidence: result[0].confidence
            });
            
            // Nối tất cả các transcript lại
            fullTranscript += transcript + ' ';
          }
          
          fullTranscript = fullTranscript.trim();
          console.log('📝 Full transcript so far:', fullTranscript);
          
          if (fullTranscript && fullTranscript.length > 0) {
            // ✅ Chỉ update transcript, KHÔNG tự động gửi
            setTranscript(fullTranscript);
            
            // ✅ Gọi callback để update UI real-time
            if (callbackRef.current) {
              console.log('📞 Updating transcript (not submitting):', fullTranscript);
              callbackRef.current(fullTranscript);
            }
            // ✅ BỎ auto stop - chỉ stop khi user bấm button
          }
        };

        recognition.onerror = (event: any) => {
          // ✅ Xử lý error dựa trên type
          if (event.error === 'no-speech') {
            // ⚠️ Không phải lỗi nghiêm trọng - chỉ là không nghe thấy giọng nói
            console.warn('⚠️ No speech detected, waiting for audio input...');
            
            // ❌ KHÔNG restart - để recognition tự xử lý!
            // Recognition sẽ tự động tiếp tục lắng nghe vì continuous = true
            // Restart liên tục sẽ làm nó không kịp nghe giọng nói
            
            setError('Đang lắng nghe... Hãy bắt đầu nói');
            // Không set isListening = false, vẫn để = true
            
          } else if (event.error === 'aborted') {
            // User chủ động dừng, không cần báo lỗi
            console.log('✅ Recognition stopped by user');
            setIsListening(false);
            
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          } else if (event.error === 'audio-capture') {
            console.error('❌ Microphone access error - check permissions');
            setError('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.');
            setIsListening(false);
            
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          } else if (event.error === 'not-allowed') {
            console.error('❌ Microphone permission denied');
            setError('Bạn cần cấp quyền truy cập microphone để sử dụng tính năng này.');
            setIsListening(false);
            
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          } else {
            // Các lỗi khác
            console.error('❌ Speech recognition error:', event.error, event);
            setError(`Lỗi nhận dạng giọng nói: ${event.error}`);
            setIsListening(false);
            
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
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
  }, [language]);

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