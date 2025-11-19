import { useState, useRef, useCallback, useEffect } from 'react';

interface DeepgramRecognitionHook {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
}

const DEEPGRAM_API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || 'be9db62afa7d8cd53e1da92593d413abee0648bc';

export const useDeepgramRecognition = (
  onTranscript?: (text: string) => void,
  language: string = 'vi-VN'
): DeepgramRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const accumulatedTranscriptRef = useRef<string>('');

  const isSupported = typeof window !== 'undefined' && 
    navigator.mediaDevices && 
    typeof MediaRecorder !== 'undefined' &&
    typeof WebSocket !== 'undefined';

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError('MediaRecorder/WebSocket not supported');
      return;
    }

    if (isListening) {
      console.log('⚠️ Already listening');
      return;
    }

    try {
      console.log('🎙️ Starting Deepgram WebSocket streaming for language:', language);
      
      // Map language codes
      const languageMap: Record<string, string> = {
        'vi-VN': 'vi',
        'en-US': 'en-US',
        'ja-JP': 'ja',
        'zh-CN': 'zh-CN',
        'ko-KR': 'ko'
      };
      const deepgramLang = languageMap[language] || 'vi';

      // Connect to Deepgram WebSocket
      const wsUrl = `wss://api.deepgram.com/v1/listen?language=${deepgramLang}&model=nova-2&smart_format=true&interim_results=true`;
      const socket = new WebSocket(wsUrl, ['token', DEEPGRAM_API_KEY]);
      socketRef.current = socket;
      accumulatedTranscriptRef.current = '';

      socket.onopen = async () => {
        console.log('✅ Deepgram WebSocket connected');
        
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 16000
          } 
        });
        streamRef.current = stream;

        // Create MediaRecorder to stream audio
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        // Send audio chunks every 250ms for realtime streaming
        mediaRecorder.start(250);
        setIsListening(true);
        setError(null);
        console.log('🔴 Streaming started');
      };

      socket.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data);
          const transcriptData = data.channel?.alternatives?.[0];
          
          if (transcriptData?.transcript) {
            const newText = transcriptData.transcript;
            const isFinal = data.is_final;
            
            if (isFinal) {
              // Final result - accumulate
              accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? ' ' : '') + newText;
              const fullText = accumulatedTranscriptRef.current;
              console.log('✅ Final transcript:', fullText);
              setTranscript(fullText);
              onTranscript?.(fullText);
            } else {
              // Interim result - show temporarily
              const fullText = accumulatedTranscriptRef.current + (accumulatedTranscriptRef.current ? ' ' : '') + newText;
              console.log('📝 Interim transcript:', fullText);
              setTranscript(fullText);
              onTranscript?.(fullText);
            }
          }
        } catch (err) {
          console.error('❌ Error parsing message:', err);
        }
      };

      socket.onerror = (err) => {
        console.error('❌ WebSocket error:', err);
        setError('Connection error');
      };

      socket.onclose = () => {
        console.log('🔌 Deepgram WebSocket closed');
      };

    } catch (err: any) {
      console.error('❌ Error starting Deepgram streaming:', err);
      setError(err.message);
      setIsListening(false);
    }
  }, [isSupported, isListening, language, onTranscript]);

  const stopListening = useCallback(() => {
    if (!isListening) {
      return;
    }

    console.log('⏹️ Stopping Deepgram streaming...');
    
    try {
      // Stop media recorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      // Close WebSocket
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'CloseStream' }));
        socketRef.current.close();
      }

      // Stop media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      setIsListening(false);
      console.log('✅ Streaming stopped');
    } catch (err: any) {
      console.error('❌ Error stopping streaming:', err);
      setError(err.message);
    }
  }, [isListening]);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening
  };
};
