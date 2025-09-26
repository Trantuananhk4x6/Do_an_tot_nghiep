import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, Loader2, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

interface InterviewInputProps {
  isProcessing: boolean;
  onSubmit: (transcription: string) => Promise<void>;
  error: string | null;
}

const WaveformAnimation = () => (
  <div className="flex items-center justify-center gap-1 h-8 mb-4">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="w-1 bg-indigo-600 rounded-full"
        animate={{
          height: [12, 32, 12],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

const InterviewInput: React.FC<InterviewInputProps> = ({
  isProcessing,
  onSubmit,
  error,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isManualStop, setIsManualStop] = useState(false); // ✅ Track manual stop
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null); // ✅ Silence timer
  const lastTranscriptRef = useRef<string>(""); // ✅ Track last transcript

  // ✅ Improved transcript handler
  const handleTranscript = (text: string) => {
    console.log('🎤 InterviewInput received transcript:', text);
    setInputText(text);
    lastTranscriptRef.current = text;

    // ✅ Clear previous timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    // ✅ Set new timeout - auto submit after 3 seconds of silence
    if (text && text.trim().length > 5) { // Tăng từ 2 lên 5 ký tự
      silenceTimeoutRef.current = setTimeout(() => {
        console.log('⏱️ Auto-submitting after silence timeout');
        handleSubmission(text);
      }, 3000); // 3 giây không nói gì thì tự động submit
    }
  };

  const { 
    isListening, 
    isSupported, 
    startListening, 
    stopListening 
  } = useSpeechRecognition(handleTranscript, "en-US");

  const handleSubmission = async (text: string) => {
    if (!text || isSubmitting) return;
    
    console.log('📤 InterviewInput submitting:', text);
    
    // ✅ Clear timeout khi submit
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(text);
      setInputText("");
      lastTranscriptRef.current = "";
    } catch (err) {
      console.error("Error submitting transcription:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async () => {
    console.log('🎯 InterviewInput handleAction called, isListening:', isListening);
    
    if (!isSupported) {
      console.error('Speech recognition not supported');
      return;
    }

    if (isListening) {
      console.log('🛑 Manual stop - stopping listening...');
      setIsManualStop(true);
      stopListening();
      
      // ✅ Submit ngay khi user manually stop
      const currentText = lastTranscriptRef.current;
      if (currentText && currentText.trim().length > 2) {
        await handleSubmission(currentText);
      }
    } else {
      console.log('▶️ Starting listening...');
      setIsManualStop(false);
      setInputText("");
      lastTranscriptRef.current = "";
      
      // ✅ Clear any pending timeouts
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      
      startListening();
    }
  };

  // ✅ Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-red-500 text-sm mb-2"
          >
            {error}
          </motion.div>
        )}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full"
          >
            <WaveformAnimation />
            {/* ✅ Hiển thị transcript realtime */}
            {inputText && (
              <div className="text-center text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                "{inputText}"
              </div>
            )}
            {/* ✅ Instruction */}
            <div className="text-center text-xs text-gray-500 mt-2">
              Speak your answer. It will auto-submit after 3 seconds of silence, or click stop when done.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleAction}
        disabled={isProcessing || isSubmitting || !isSupported}
        className={`
          p-4 rounded-full transition-all duration-200 
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
        `}
        whileTap={{ scale: 0.95 }}
        aria-label={isListening ? "Stop recording" : "Start recording"}
      >
        {isProcessing || isSubmitting ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isListening ? (
          <Square className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </motion.button>
      
      {/* ✅ Debug info */}
      <div className="text-xs text-gray-400 mt-2">
        {isSupported ? 
          (isListening ? "🎤 Listening... (auto-submit in 3s after silence)" : "Ready to listen") : 
          "Speech recognition not supported"
        }
      </div>
    </div>
  );
};

export default InterviewInput;