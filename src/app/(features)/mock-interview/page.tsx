"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import InterviewTranscript from "./components/interviewTranscript";
import InterviewInput from "./components/interviewInput";
import AudioPlayer from "./components/audioPlayer";
import SpeechSynthesisManager from "./utils/speechSynthesis";
import { AudioManager } from "./utils/audioUtils";
import { useInterviewState } from "./hooks/useInterviewState";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import InterviewTimer from "./components/InterviewTimer";
import axios from "axios";
import mockData from "./data/MockInterviewFaker.json";
import MockInterviewModal from './components/mockInterviewModal';
import { cn } from "@/lib/utils";
import WebcamStream from "./components/WebcamStream";
import { useRouter } from "next/navigation";
import DIDTalkingHead from "./components/DIDTalkingHead";
import { v4 as uuidv4 } from 'uuid';
import { AnimatedStars } from "@/components/ui/animated-stars";
import type { InterviewSession, TranscriptEntry } from './types/assessment';
interface Voice {
  id: string;
  name: string;
  gender: string;
  age: number;
  voiceTone: string;
  avatarUrl: string;
  title: string;
  expertise: string;
  yearsOfExperience: number;
  interviewStyle: string;
  focusAreas: string[];
  questionTypes: string[];
  personality: string;
}

const TRANSITION_PHRASES = [
  "Thank you for your insight. Let's move on to our next question.",
  "I appreciate your detailed response. Now, could you tell me...",
  "Thanks for sharing that. I'd like to ask you another question.",
  "Your answer is much appreciated. Now, let's discuss...",
  "Thank you for that explanation. May we explore another aspect?",
  "I value your perspective. Let's transition to another topic.",
  "That was very helpful, thank you. Next, I'd like to ask...",
  "Thanks for your input. Let's proceed to the next question.",
  "I appreciate your thoughts. Now, can you elaborate on...",
  "Thank you for sharing your experience. Moving forward, could you...",
  "Great answer. Now, let's shift focus to another area.",
  "Thanks for that insight. Can we discuss another point?",
  "I appreciate your explanation. Let's now consider a different perspective.",
  "Thank you for your response. Next, I'd like to delve into...",
  "Your response was very informative. Let's move on to the next topic.",
  "I appreciate your answer. Now, can you tell me more about...",
  "Thanks for clarifying that. Let's now explore another question.",
  "Thank you for sharing your thoughts. Next, could you expand on...",
  "I value your input. Let's transition to discussing another aspect.",
  "Great, thanks for your answer. Now, let's take a look at another question."
];

const getRandomTransitionPhrase = () => {
  const randomIndex = Math.floor(Math.random() * TRANSITION_PHRASES.length);
  return TRANSITION_PHRASES[randomIndex];
};

const MockInterviewPage = () => {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAIText, setCurrentAIText] = useState<string>(""); // ✅ State cho D-ID video
  const audioManager = useRef(new AudioManager());
  const speechSynthesis = useRef(SpeechSynthesisManager.getInstance());
  
  // ✅ NEW: Interview session tracking for AI assessment
  const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);
  const interviewStartTime = useRef<number>(0);

  const {
    isStarted,
    setIsStarted,
    messages,
    currentResponse,
    setCurrentResponse,
    isPlaying,
    volume,
    setVolume,
    addMessage,
    resetState,
  } = useInterviewState(audioManager.current);

  // Add new state for tracking mic errors
  const [micError, setMicError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const handleSpeechStart = () => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && !lastMessage.isUser) {
        setPlayingMessageId(lastMessage.id);
      }
    };

    const handleSpeechEnd = () => {
      setPlayingMessageId(null);
    };

    speechSynthesis.current.on("speechStart", handleSpeechStart);
    speechSynthesis.current.on("speechEnd", handleSpeechEnd);

    return () => {
      speechSynthesis.current.removeListener("speechStart", handleSpeechStart);
      speechSynthesis.current.removeListener("speechEnd", handleSpeechEnd);
    };
  }, [messages]);


  // Khai báo handleSubmit trước
 const handleSubmit = useCallback(async (transcription: string) => {
    console.log('🎯 handleSubmit called with:', transcription);
    console.log('📊 Current question index:', currentQuestionIndex);
    console.log('📝 Total questions:', interviewQuestions.length);
    console.log('❓ Interview questions:', interviewQuestions);

    if (!transcription || isProcessing) {
      console.log('❌ Early return - no transcription or processing');
      return;
    }

    if (interviewQuestions.length === 0) {
      console.log('❌ No interview questions available');
      return;
    }

    try {
      setIsProcessing(true);
      setInputText("");

      // Add user message
      const userMessage = addMessage(transcription, true);
      console.log('✅ Added user message');
      
      // ✅ NEW: Record candidate response in transcript
      if (interviewSession) {
        const timeSinceStart = Date.now() - interviewStartTime.current;
        interviewSession.transcript.push({
          speaker: 'candidate',
          message: transcription,
          timestamp: timeSinceStart
        });
        setInterviewSession({...interviewSession});
        console.log('✅ Recorded candidate response in transcript');
      }

      // Logic chuyển sang câu hỏi tiếp theo
      const nextQuestionIndex = currentQuestionIndex + 1;
      console.log('➡️ Next question index:', nextQuestionIndex);
      
      if (nextQuestionIndex < interviewQuestions.length) {
        // Có câu hỏi tiếp theo
        const transitionPhrase = getRandomTransitionPhrase();
        const nextQuestion = interviewQuestions[nextQuestionIndex];
        const fullResponse = `${transitionPhrase} ${nextQuestion.question}`;
        
        console.log('📢 Next question:', nextQuestion.question);
        console.log('💬 Full response:', fullResponse);
        
        // ✅ Set text cho D-ID video
        setCurrentAIText(fullResponse);
        
        // Add AI message với câu hỏi tiếp theo
        const aiMessage = addMessage(fullResponse, false);
        
        // ✅ NEW: Record interviewer question in transcript
        if (interviewSession) {
          const timeSinceStart = Date.now() - interviewStartTime.current;
          interviewSession.transcript.push({
            speaker: 'interviewer',
            message: fullResponse,
            timestamp: timeSinceStart
          });
          setInterviewSession({...interviewSession});
          console.log('✅ Recorded next question in transcript');
        }
        
        // Cập nhật index
        setCurrentQuestionIndex(nextQuestionIndex);
        console.log('✅ Updated question index to:', nextQuestionIndex);
        
        // Speak với đúng giọng nói
        const voiceGender = selectedVoice?.gender || 'female';
        await speechSynthesis.current.speak(fullResponse, voiceGender);
        
      } else {
        // Hết câu hỏi - kết thúc phỏng vấn
        console.log('🏁 Interview finished - no more questions');
        const endMessage = "Thank you for your time. That concludes our interview. We'll be in touch soon!";
        
        // ✅ Set text cho D-ID video
        setCurrentAIText(endMessage);
        
        const aiMessage = addMessage(endMessage, false);
        
        const voiceGender = selectedVoice?.gender || 'female';
        await speechSynthesis.current.speak(endMessage, voiceGender);
        
        // Tự động chuyển đến trang báo cáo sau 3 giây
        setTimeout(() => {
          router.push('/assessment-report');
        }, 3000);
      }

    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage, isProcessing, selectedVoice, currentQuestionIndex, interviewQuestions, router, interviewSession]);

  // Khai báo handleTranscript - CHỈ update UI, KHÔNG submit
  const handleTranscript = useCallback((text: string) => {
    console.log('📝 Received transcript (not submitting):', text);
    setMicError(null);
    setInputText(text); // Chỉ update input text để hiển thị
    // ✅ BỎ tự động submit - để InterviewInput xử lý
  }, []);

  // ✅ SỬA DÒNG NÀY: Truyền handleTranscript vào useSpeechRecognition


   const { isListening, isSupported, startListening, stopListening } =
    useSpeechRecognition(handleTranscript, "en-US");

  const handleToggleRecording = useCallback(() => {
    if (!isSupported) {
      setMicError("Speech recognition is not supported in your browser.");
      return;
    }

    if (isProcessing) {
      return;
    }

    try {
      if (isListening) {
        stopListening();
      } else {
        // Reset any previous errors
        setMicError(null);
        // Ensure we're not in a processing state
        setIsProcessing(false);
        startListening();
      }
    } catch (error) {
      setMicError("Failed to toggle microphone. Please try again.");
      console.error("Microphone toggle error:", error);
      // Reset states on error
      stopListening();
      setIsProcessing(false);
    }
  }, [isListening, isSupported, isProcessing, startListening, stopListening]);

// ...existing code...

// const handleSubmit = useCallback(async (transcription: string) => {
//   if (!transcription || isProcessing) return;

//   try {
//     setIsProcessing(true);
//     setInputText("");

//     // Add user message
//     const userMessage = addMessage(transcription, true);

//     // Simulate AI response
//     const responses = [
//       "That's a great question! Can you tell me more about your experience with...",
//       "I appreciate your detailed response. Now, could you tell me...",
//       "Excellent! Your background shows strong technical skills. How do you handle...",
//     ];

//     const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
//     // Add AI message
//     const aiMessage = addMessage(randomResponse, false);

//     // Speak with correct gender
//     const voiceGender = selectedVoice?.gender || 'female'; // Lấy gender từ selectedVoice
//     await speechSynthesis.current.speak(randomResponse, voiceGender);

//   } catch (error) {
//     console.error("Error in handleSubmit:", error);
//   } finally {
//     setIsProcessing(false);
//   }
// }, [currentResponse, interviewQuestions, addMessage, setCurrentResponse, isProcessing, selectedVoice]);

// const handleTranscript = useCallback((text: string) => {
//     console.log('📝 Received transcript:', text);
//     setMicError(null);
//     setInputText(text);
    
//     // Tự động stop listening và submit khi có final transcript
//     if (text && text.trim().length > 2) {
//       stopListening();
//       setTimeout(() => {
//         handleSubmit(text);
//       }, 500);
//     }
//   }, [stopListening, handleSubmit]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (isListening) {
        stopListening();
      }
      setIsProcessing(false);
      setMicError(null);
    };
  }, [isListening, stopListening]);


  const handleStart = useCallback(async (questions: any[]) => {
    console.log('🚀 Starting interview with questions:', questions);
    setIsStarted(true);
    setCurrentQuestionIndex(0);
    setInterviewQuestions(questions); // ✅ QUAN TRỌNG: Set questions vào state
    
    // ✅ NEW: Initialize interview session for tracking
    const sessionId = uuidv4();
    const startTime = Date.now();
    interviewStartTime.current = startTime;
    
    const session: InterviewSession = {
      sessionId,
      startTime,
      interviewer: {
        name: selectedVoice?.name || 'AI Interviewer',
        title: selectedVoice?.title || 'Senior Interviewer',
        gender: selectedVoice?.gender || 'female',
        age: selectedVoice?.age || 35,
        voiceTone: selectedVoice?.voiceTone || 'professional',
        expertise: selectedVoice?.expertise || 'General Software Engineering',
        yearsOfExperience: selectedVoice?.yearsOfExperience || 10,
        focusAreas: selectedVoice?.focusAreas || ['Technical Skills', 'Problem Solving'],
        interviewStyle: selectedVoice?.interviewStyle || 'Professional and Friendly'
      },
      transcript: []
    };
    setInterviewSession(session);
    console.log('✅ Created interview session:', sessionId);
    
    const firstQuestion = questions[0];
    if (firstQuestion) {
      console.log('🎤 Speaking first question:', firstQuestion.question);
      setCurrentAIText(firstQuestion.question); // ✅ Set text cho D-ID
      addMessage(firstQuestion.question, false);
      
      // ✅ Record first question in transcript
      session.transcript.push({
        speaker: 'interviewer',
        message: firstQuestion.question,
        timestamp: 0 // First question at time 0
      });
      setInterviewSession({...session});
      
      const voiceGender = selectedVoice?.gender || 'female';
      await speechSynthesis.current.speak(firstQuestion.question, voiceGender);
    }
  }, [setIsStarted, addMessage, selectedVoice]);

  const handleEnd = useCallback(() => {
    if (isListening) {
      stopListening();
    }
    speechSynthesis.current.stop();
    resetState();
    setInputText("");
    setIsProcessing(false);
    setPlayingMessageId(null);
  }, [resetState, isListening, stopListening]);
  const handleInterviewSetup = useCallback(
    async (voice: Voice, interviewId: string) => {
      try {
        console.log('⚙️ Setting up interview with ID:', interviewId);
        const response = await axios.get(`/api/interview-set?id=${interviewId}`);
        console.log('📥 Received questions from API:', response.data);
        
        setSelectedVoice(voice);
        // Truyền questions trực tiếp vào handleStart
        await handleStart(response.data);
      } catch (error) {
        console.error("❌ Error fetching interview questions:", error);
      }
    },
    [handleStart] // ✅ Thêm handleStart vào dependency
  );
  const handleLeaveInterview = useCallback(async () => {
    if (!window.confirm('Are you sure you want to leave the interview?')) {
      return;
    }
    
    try {
      console.log('🚀 Leaving interview - generating assessment...');
      
      // Stop audio and clean up
      if (isListening) {
        stopListening();
      }
      speechSynthesis.current.stop();
      
      // Calculate duration
      const endTime = Date.now();
      const durationInSeconds = Math.floor((endTime - interviewStartTime.current) / 1000);
      
      if (interviewSession && interviewSession.transcript.length > 0) {
        // Complete the session data
        const completeSession = {
          ...interviewSession,
          endTime,
          duration: durationInSeconds
        };
        
        console.log('📊 Session stats:');
        console.log('  - Duration:', durationInSeconds, 'seconds');
        console.log('  - Transcript entries:', completeSession.transcript.length);
        console.log('  - Questions answered:', Math.floor(completeSession.transcript.length / 2));
        
        // Call AI assessment API
        console.log('🤖 Calling assessment API...');
        const response = await axios.post('/api/assess-interview', {
          interviewSession: completeSession
        });
        
        if (response.data.success && response.data.assessment) {
          console.log('✅ Assessment generated successfully!');
          console.log('  - Overall Score:', response.data.assessment.overallScore);
          console.log('  - Readiness Level:', response.data.assessment.readinessLevel);
          
          // Save assessment to sessionStorage
          sessionStorage.setItem('latestAssessment', JSON.stringify(response.data.assessment));
          sessionStorage.setItem('interviewSession', JSON.stringify(completeSession));
          
          console.log('💾 Saved assessment to sessionStorage');
        } else {
          console.error('❌ Assessment API returned error:', response.data.error);
          alert('Failed to generate assessment. Please try again.');
          return;
        }
      } else {
        console.warn('⚠️ No interview data to assess');
        alert('No interview data available for assessment.');
        return;
      }
      
      // Clean up and navigate
      handleEnd();
      setElapsedTime(0);
      router.push('/assessment-report');
      
    } catch (error) {
      console.error('❌ Error generating assessment:', error);
      alert('Failed to generate assessment. Redirecting to report page...');
      
      // Still navigate even on error
      handleEnd();
      setElapsedTime(0);
      router.push('/assessment-report');
    }
  }, [handleEnd, router, interviewSession, isListening, stopListening]);

  const handleCameraToggle = useCallback(() => {
    setIsCameraOn(prev => !prev);
  }, []);

  const handleStreamReady = useCallback((stream: MediaStream) => {
    setStreaming(true);
  }, []);

  // Add cleanup effect
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Animated Stars Background */}
      <AnimatedStars />
      
      <div className="flex-1 relative z-10">
        {!isStarted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-4"
          >
            <div className="glass-effect rounded-3xl p-12 max-w-2xl w-full text-center">
              <div className="mb-6 inline-block">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto animate-float">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-5xl font-bold gradient-text mb-6">Mock Interview</h1>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                Practice your interview skills with our AI-powered interviewer. Get real-time feedback and improve your responses.
              </p>
              <Button
                variant={"default"}
                size={"lg"}
                onClick={() => setShowLanguageModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  Start Your Interview
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col p-6">
            {/* Header */}
            <div className="glass-effect rounded-2xl p-4 mb-4 border border-white/10">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl font-semibold gradient-text">Mock Interview</h1>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="h-4 w-4" />
                    <InterviewTimer 
                      isStarted={isStarted} 
                      onReset={() => setElapsedTime(0)} 
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleCameraToggle}
                    className={cn(
                      "rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all duration-300",
                      isCameraOn 
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 hover:shadow-neon" 
                        : "glass-effect border border-white/10 hover:bg-white/5"
                    )}
                    aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
                  >
                    <Camera 
                      className={cn(
                        "h-5 w-5 transition-colors duration-200", 
                        isCameraOn ? "text-white" : "text-gray-400"
                      )} 
                    />
                  </Button>
                  <Button
                    onClick={handleLeaveInterview}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-full px-4 py-2 text-sm transition-all duration-300"
                  >
                    Leave
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex gap-4 flex-1 min-h-0">
              {/* Video Section */}
              <div className="w-[25%] flex flex-col gap-4">
                <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-black/50 aspect-[4/3] shadow-neon">
                  <DIDTalkingHead
                    text={currentAIText}
                    avatarUrl={selectedVoice?.avatarUrl}
                    voiceGender={selectedVoice?.gender}
                    isSpeaking={playingMessageId !== null}
                    onVideoReady={() => console.log('✅ D-ID video ready')}
                    onVideoEnd={() => console.log('🎬 D-ID video ended')}
                  />
                </div>
                <WebcamStream 
                  ref={videoRef}
                  isActive={isCameraOn}
                  onStreamReady={handleStreamReady}
                />
              </div>

              {/* Chat Section */}
              <div className="w-[75%] flex flex-col min-h-0 gap-4">
                <div className="flex-1 min-h-0 glass-effect rounded-2xl border border-white/10 overflow-hidden">
                  <InterviewTranscript
                    messages={messages.map((msg) => ({
                      ...msg,
                      isPlaying: msg.id === playingMessageId,
                    }))}
                  />
                </div>
                <div className="glass-effect rounded-2xl border border-white/10 p-4">
                  <InterviewInput
                    isProcessing={isProcessing}
                    onSubmit={handleSubmit}
                    error={micError}
                  />
                </div>
              </div>
            </div>

            <AudioPlayer
              isPlaying={isPlaying}
              volume={volume}
              onVolumeChange={setVolume}
            />
          </div>
        )}

        <MockInterviewModal
          isOpen={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
          onSelect={handleInterviewSetup}
        />
      </div>
    </div>
  );
};

export default MockInterviewPage;
