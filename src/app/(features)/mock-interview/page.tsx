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
import NeuralNetworkBg from "@/components/ui/neural-network-bg";
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

const TRANSITION_PHRASES: Record<string, string[]> = {
  en: [
    "Thank you for your insight. Let's move on to our next question.",
    "I appreciate your detailed response. Now, could you tell me...",
    "Thanks for sharing that. I'd like to ask you another question.",
    "Your answer is much appreciated. Now, let's discuss...",
    "Thank you for that explanation. May we explore another aspect?",
    "I value your perspective. Let's transition to another topic.",
    "That was very helpful, thank you. Next, I'd like to ask...",
    "Thanks for your input. Let's proceed to the next question.",
  ],
  vi: [
    "Cảm ơn bạn đã chia sẻ. Chúng ta chuyển sang câu hỏi tiếp theo nhé.",
    "Tôi đánh giá cao câu trả lời của bạn. Bây giờ, bạn có thể cho tôi biết...",
    "Cảm ơn vì đã chia sẻ. Tôi muốn hỏi bạn một câu hỏi khác.",
    "Câu trả lời của bạn rất tốt. Bây giờ, hãy thảo luận về...",
    "Cảm ơn lời giải thích. Chúng ta có thể khám phá một khía cạnh khác không?",
    "Tôi đánh giá cao quan điểm của bạn. Hãy chuyển sang chủ đề khác.",
    "Điều đó rất hữu ích, cảm ơn bạn. Tiếp theo, tôi muốn hỏi...",
    "Cảm ơn ý kiến của bạn. Hãy tiếp tục với câu hỏi tiếp theo.",
  ],
};

const END_MESSAGES: Record<string, string> = {
  en: "Thank you for your time. That concludes our interview. We'll be in touch soon!",
  vi: "Cảm ơn bạn đã dành thời gian. Buổi phỏng vấn của chúng ta đã kết thúc. Chúng tôi sẽ liên lạc sớm!",
  ja: "お時間をいただきありがとうございました。面接は以上です。また連絡させていただきます。",
  zh: "感谢您的时间。我们的面试到此结束。我们会尽快与您联系！",
  ko: "시간 내주셔서 감사합니다. 면접이 끝났습니다. 곧 연락드리겠습니다!",
};

const getRandomTransitionPhrase = (language: string = 'en') => {
  const phrases = TRANSITION_PHRASES[language] || TRANSITION_PHRASES.en;
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
};

const getEndMessage = (language: string = 'en') => {
  return END_MESSAGES[language] || END_MESSAGES.en;
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
  const [interviewLanguage, setInterviewLanguage] = useState<string>("en"); // Language from interview set
  const audioManager = useRef(new AudioManager());
  const speechSynthesis = useRef(SpeechSynthesisManager.getInstance());
  
  // ✅ NEW: Loading states for better UX
  const [isLoadingInterview, setIsLoadingInterview] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);
  
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
      
      // ✅ NEW: Record candidate response in transcript AND link to question
      // Use local variable to avoid async state issues
      let updatedSession = interviewSession;
      
      if (updatedSession) {
        const timeSinceStart = Date.now() - interviewStartTime.current;
        const currentQuestion = interviewQuestions[currentQuestionIndex];
        
        updatedSession.transcript.push({
          speaker: 'candidate',
          message: transcription,
          timestamp: timeSinceStart,
          questionId: currentQuestion?.id,
          expectedAnswer: currentQuestion?.answer
        });
        
        // ✅ Track question-answer pair for scoring
        if (!updatedSession.questionsAsked) {
          updatedSession.questionsAsked = [];
        }
        
        // Update or add question-answer pair
        const existingQA = updatedSession.questionsAsked.find(qa => qa.questionId === currentQuestion?.id);
        if (existingQA) {
          existingQA.candidateAnswer = transcription;
        } else {
          updatedSession.questionsAsked.push({
            questionId: currentQuestion?.id || currentQuestionIndex,
            question: currentQuestion?.question || '',
            expectedAnswer: currentQuestion?.answer || '',
            candidateAnswer: transcription,
            timestamp: timeSinceStart
          });
        }
        
        setInterviewSession({...updatedSession});
        console.log('✅ Recorded candidate response with question link');
      }

      // Logic chuyển sang câu hỏi tiếp theo
      const nextQuestionIndex = currentQuestionIndex + 1;
      console.log('➡️ Next question index:', nextQuestionIndex);
      
      if (nextQuestionIndex < interviewQuestions.length) {
        // Có câu hỏi tiếp theo
        const transitionPhrase = getRandomTransitionPhrase(interviewLanguage);
        const nextQuestion = interviewQuestions[nextQuestionIndex];
        const fullResponse = `${transitionPhrase} ${nextQuestion.question}`;
        
        console.log('📢 Next question:', nextQuestion.question);
        console.log('💬 Full response:', fullResponse);
        
        // ✅ Set text cho D-ID video
        setCurrentAIText(fullResponse);
        
        // Add AI message với câu hỏi tiếp theo
        const aiMessage = addMessage(fullResponse, false);
        
        // ✅ NEW: Record interviewer question in transcript - use updatedSession
        if (updatedSession) {
          const timeSinceStart = Date.now() - interviewStartTime.current;
          updatedSession.transcript.push({
            speaker: 'interviewer',
            message: fullResponse,
            timestamp: timeSinceStart,
            isQuestion: true,
            questionId: nextQuestion?.id
          });
          
          // ✅ Pre-register question in questionsAsked (will be updated when user answers)
          if (!updatedSession.questionsAsked) {
            updatedSession.questionsAsked = [];
          }
          updatedSession.questionsAsked.push({
            questionId: nextQuestion?.id || nextQuestionIndex,
            question: nextQuestion?.question || '',
            expectedAnswer: nextQuestion?.answer || '',
            candidateAnswer: undefined, // Will be filled when user answers
            timestamp: timeSinceStart
          });
          
          setInterviewSession({...updatedSession});
          console.log('✅ Recorded next question in transcript');
        }
        
        // Cập nhật index
        setCurrentQuestionIndex(nextQuestionIndex);
        console.log('✅ Updated question index to:', nextQuestionIndex);
        
        // Speak với đúng giọng nói và ngôn ngữ
        const voiceGender = selectedVoice?.gender || 'female';
        await speechSynthesis.current.speak(fullResponse, voiceGender, interviewLanguage);
        
      } else {
        // Hết câu hỏi - kết thúc phỏng vấn
        console.log('🏁 Interview finished - no more questions');
        const endMessage = getEndMessage(interviewLanguage);
        
        // ✅ Set text cho D-ID video
        setCurrentAIText(endMessage);
        
        const aiMessage = addMessage(endMessage, false);
        
        const voiceGender = selectedVoice?.gender || 'female';
        await speechSynthesis.current.speak(endMessage, voiceGender, interviewLanguage);
        
        // ✅ FIX: Gọi API assess-interview TRƯỚC khi chuyển trang
        try {
          console.log('🚀 Auto-generating assessment after completing all questions...');
          
          // Calculate duration
          const endTime = Date.now();
          const durationInSeconds = Math.floor((endTime - interviewStartTime.current) / 1000);
          
          // ✅ Use updatedSession which has latest data
          const sessionToUse = updatedSession || interviewSession;
          
          // Complete the session data
          const completeSession = {
            ...sessionToUse,
            endTime,
            duration: durationInSeconds,
            questionsAsked: sessionToUse?.questionsAsked || [],
            interviewer: {
              ...sessionToUse?.interviewer,
              yearsOfExperience: sessionToUse?.interviewer?.yearsOfExperience || 10,
              focusAreas: sessionToUse?.interviewer?.focusAreas || ['Technical Skills'],
              interviewStyle: sessionToUse?.interviewer?.interviewStyle || 'Professional'
            }
          };
          
          console.log('📊 Session stats:');
          console.log('  - Duration:', durationInSeconds, 'seconds');
          console.log('  - Transcript entries:', completeSession.transcript?.length || 0);
          console.log('  - Questions asked:', completeSession.questionsAsked?.length || 0);
          
          // Call AI assessment API
          const response = await axios.post('/api/assess-interview', {
            interviewSession: completeSession
          }, {
            timeout: 90000
          });
          
          if (response.data.success && response.data.assessment) {
            console.log('✅ Assessment generated successfully!');
            console.log('  - Overall Score:', response.data.assessment.overallScore);
            
            // Save assessment to sessionStorage
            sessionStorage.setItem('latestAssessment', JSON.stringify(response.data.assessment));
            sessionStorage.setItem('interviewSession', JSON.stringify(completeSession));
            
            console.log('💾 Saved assessment to sessionStorage');
          } else {
            console.error('❌ Assessment API error:', response.data.error);
            // Still save session data
            sessionStorage.setItem('interviewSession', JSON.stringify(completeSession));
          }
          
          // Chuyển đến trang báo cáo sau 2 giây
          setTimeout(() => {
            // Cleanup
            speechSynthesis.current.stop();
            resetState();
            setInputText("");
            setIsProcessing(false);
            setPlayingMessageId(null);
            router.push('/assessment-report');
          }, 2000);
          
        } catch (assessError) {
          console.error('❌ Error generating assessment:', assessError);
          // Still navigate even on error
          setTimeout(() => {
            resetState();
            router.push('/assessment-report');
          }, 2000);
        }
      }

    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage, isProcessing, selectedVoice, currentQuestionIndex, interviewQuestions, router, interviewSession, interviewLanguage, resetState]);

  // Khai báo handleTranscript - CHỈ update UI, KHÔNG submit
  const handleTranscript = useCallback((text: string) => {
    console.log('📝 Received transcript (not submitting):', text);
    setMicError(null);
    setInputText(text); // Chỉ update input text để hiển thị
    // ✅ BỎ tự động submit - để InterviewInput xử lý
  }, []);

  // ✅ SỬA DÒNG NÀY: Truyền handleTranscript và language code vào useSpeechRecognition
  const languageCodeMap: Record<string, string> = {
    vi: 'vi-VN',
    en: 'en-US',
    ja: 'ja-JP',
    zh: 'zh-CN',
    ko: 'ko-KR',
  };
  const speechLang = languageCodeMap[interviewLanguage] || 'en-US';
  
  console.log('🎤 Speech Recognition Language:', {
    interviewLanguage,
    speechLang,
    mapping: languageCodeMap
  });

   const { isListening, isSupported, startListening, stopListening, error: speechError } =
    useSpeechRecognition(handleTranscript, speechLang);
  
  // ✅ Sync speech recognition error to micError state
  useEffect(() => {
    if (speechError) {
      setMicError(speechError);
    }
  }, [speechError]);

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


  const handleStart = useCallback(async (questions: any[], language?: string) => {
    console.log('🚀 Starting interview with questions:', questions);
    console.log('🌐 handleStart language parameter:', language);
    
    const finalLanguage = language || interviewLanguage || 'en';
    console.log('🌐 Using language:', finalLanguage);
    
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
      language: finalLanguage, // Add language to session
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
      
      // ✅ Record first question in transcript AND track for scoring
      session.transcript.push({
        speaker: 'interviewer',
        message: firstQuestion.question,
        timestamp: 0, // First question at time 0
        isQuestion: true,
        questionId: firstQuestion?.id
      });
      
      // ✅ Initialize questionsAsked array with first question
      session.questionsAsked = [{
        questionId: firstQuestion?.id || 0,
        question: firstQuestion?.question || '',
        expectedAnswer: firstQuestion?.answer || '',
        candidateAnswer: undefined, // Will be filled when user answers
        timestamp: 0
      }];
      
      setInterviewSession({...session});
      
      const voiceGender = selectedVoice?.gender || 'female';
      console.log('🔊 Speaking with:', { 
        voiceGender, 
        language: finalLanguage,
        selectedVoice: {
          name: selectedVoice?.name,
          gender: selectedVoice?.gender,
          title: selectedVoice?.title
        }
      });
      await speechSynthesis.current.speak(firstQuestion.question, voiceGender, finalLanguage);
    }
  }, [setIsStarted, addMessage, selectedVoice, interviewLanguage]);

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
        // ✅ Show loading screen
        setIsLoadingInterview(true);
        setLoadingMessage("Preparing your interview...");
        
        console.log('⚙️ Setting up interview with ID:', interviewId);
        console.log('👤 Selected Interviewer:', voice.name, '-', voice.title);
        console.log('🎯 Focus Areas:', voice.focusAreas);
        
        setLoadingMessage(`Setting up interview with ${voice.name}...`);
        
        // Fetch interview set to get language
        const interviewSetResponse = await axios.get(`/api/prepare-hub?Id=${interviewId}`);
        const interviewSet = Array.isArray(interviewSetResponse.data) 
          ? interviewSetResponse.data.find((set: any) => set.id === parseInt(interviewId))
          : interviewSetResponse.data;
        
        const language = interviewSet?.language || 'en';
        console.log('🌐 Interview language:', language);
        setInterviewLanguage(language);
        setSelectedVoice(voice);
        
        // ✅ NEW: Generate questions based on interviewer type
        // Different interviewers ask different types of questions!
        setLoadingMessage(`${voice.name} is preparing questions for you...`);
        console.log('🤖 Generating interviewer-specific questions...');
        
        try {
          const interviewerResponse = await axios.post('/api/interview-set/generate-for-interviewer', {
            interviewSetId: interviewId,
            interviewer: {
              id: voice.id,
              name: voice.name,
              title: voice.title,
              expertise: voice.expertise,
              yearsOfExperience: voice.yearsOfExperience,
              interviewStyle: voice.interviewStyle,
              focusAreas: voice.focusAreas,
              questionTypes: voice.questionTypes,
              personality: voice.personality
            }
          });
          
          if (interviewerResponse.data && interviewerResponse.data.length > 0) {
            console.log('✅ Generated interviewer-specific questions:', interviewerResponse.data.length);
            console.log('📝 Question types:', interviewerResponse.data.map((q: any) => q.category));
            
            // ✅ FIX: Tắt loading TRƯỚC khi AI bắt đầu nói
            setIsLoadingInterview(false);
            setLoadingMessage("");
            
            await handleStart(interviewerResponse.data, language);
            return;
          }
        } catch (interviewerError) {
          console.warn('⚠️ Could not generate interviewer-specific questions, falling back to default:', interviewerError);
        }
        
        // Fallback: Fetch default questions if interviewer-specific generation fails
        setLoadingMessage("Loading interview questions...");
        console.log('📥 Fetching default questions as fallback...');
        const response = await axios.get(`/api/interview-set?id=${interviewId}`);
        console.log('📥 Received questions from API:', response.data);
        
        // ✅ FIX: Tắt loading TRƯỚC khi AI bắt đầu nói
        setIsLoadingInterview(false);
        setLoadingMessage("");
        
        // ✅ Truyền language trực tiếp vào handleStart để tránh race condition
        await handleStart(response.data, language);
      } catch (error) {
        console.error("❌ Error fetching interview questions:", error);
        setIsLoadingInterview(false);
        setLoadingMessage("");
      }
    },
    [handleStart] // ✅ Thêm handleStart vào dependency
  );
  const handleLeaveInterview = useCallback(async () => {
    if (!window.confirm('Are you sure you want to leave the interview?')) {
      return;
    }
    
    // ✅ Show loading screen for assessment generation
    setIsGeneratingAssessment(true);
    
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
      
      // Validate interview session data
      if (!interviewSession || !interviewSession.transcript || interviewSession.transcript.length === 0) {
        console.warn('⚠️ No interview data to assess');
        setIsGeneratingAssessment(false);
        alert('No interview data available for assessment. Please start and complete an interview first.');
        handleEnd();
        return;
      }
      
      // Complete the session data with proper defaults
      const completeSession = {
        ...interviewSession,
        endTime,
        duration: durationInSeconds,
        questionsAsked: interviewSession.questionsAsked || [],
        interviewer: {
          ...interviewSession.interviewer,
          yearsOfExperience: interviewSession.interviewer.yearsOfExperience || 10,
          focusAreas: interviewSession.interviewer.focusAreas || ['Technical Skills'],
          interviewStyle: interviewSession.interviewer.interviewStyle || 'Professional'
        }
      };
      
      console.log('📊 Session stats:');
      console.log('  - Duration:', durationInSeconds, 'seconds');
      console.log('  - Transcript entries:', completeSession.transcript.length);
      console.log('  - Questions asked:', completeSession.questionsAsked?.length || 0);
      
      // Call AI assessment API with timeout
      console.log('🤖 Calling assessment API...');
      const response = await axios.post('/api/assess-interview', {
        interviewSession: completeSession
      }, {
        timeout: 90000 // 90 seconds timeout (increased for retries)
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
        const errorMsg = response.data.error || 'Unknown error';
        
        // Special handling for rate limit
        if (errorMsg.includes('rate limit') || errorMsg.includes('quota')) {
          alert('⚠️ AI service is currently busy. Please wait a moment and try again.\n\nYour interview data has been saved.');
        } else {
          alert(`Failed to generate assessment: ${errorMsg}`);
        }
        
        // Still save the session data even if assessment failed
        sessionStorage.setItem('interviewSession', JSON.stringify(completeSession));
        setIsGeneratingAssessment(false);
        return;
      }
      
      // Clean up and navigate
      setIsGeneratingAssessment(false);
      handleEnd();
      setElapsedTime(0);
      router.push('/assessment-report');
      
    } catch (error: any) {
      console.error('❌ Error generating assessment:', error);
      
      // More detailed error message
      let errorMessage = 'Failed to generate assessment. ';
      let isRateLimit = false;
      
      if (error.response) {
        const status = error.response.status;
        const serverError = error.response.data?.error || 'Unknown error';
        
        if (status === 429 || serverError.includes('rate limit') || serverError.includes('quota')) {
          errorMessage = '⚠️ AI service is currently busy. Please wait a few moments and try again.\n\nYour interview data has been saved.';
          isRateLimit = true;
        } else {
          errorMessage += `Server error: ${status} - ${serverError}`;
        }
      } else if (error.request) {
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      alert(errorMessage + (isRateLimit ? '' : ' Redirecting to report page...'));
      
      // Still navigate even on error (unless it's rate limit)
      if (!isRateLimit) {
        setIsGeneratingAssessment(false);
        handleEnd();
        setElapsedTime(0);
        router.push('/assessment-report');
      } else {
        setIsGeneratingAssessment(false);
      }
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
    <>
      <NeuralNetworkBg />
      
      {/* ✅ Loading Screen for Starting Interview */}
      {isLoadingInterview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-3xl animate-pulse" />
              <motion.div 
                className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto shadow-2xl"
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </motion.div>
            </div>
            <motion.h2 
              className="text-2xl font-bold text-white mb-4"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {loadingMessage || "Preparing your interview..."}
            </motion.h2>
            <div className="flex items-center justify-center gap-2">
              <motion.div 
                className="w-3 h-3 rounded-full bg-purple-500"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-pink-500"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-purple-500"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-4">This may take a few seconds...</p>
          </motion.div>
        </div>
      )}
      
      {/* ✅ Loading Screen for Assessment Generation */}
      {isGeneratingAssessment && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md px-6"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-blue-600/30 blur-3xl animate-pulse" />
              <motion.div 
                className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center mx-auto shadow-2xl"
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </motion.div>
            </div>
            <motion.h2 
              className="text-2xl font-bold text-white mb-4"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Generating Your Assessment...
            </motion.h2>
            <p className="text-gray-300 mb-6">
              Our AI is analyzing your interview performance and preparing detailed feedback.
            </p>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
                <span className="text-sm text-gray-400">Analyzing responses...</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-blue-500"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                />
                <span className="text-sm text-gray-400">Evaluating skills...</span>
              </div>
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-purple-500"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                />
                <span className="text-sm text-gray-400">Preparing recommendations...</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-4">This may take up to 30 seconds...</p>
          </motion.div>
        </div>
      )}
      
      <div className="relative z-10 h-screen bg-background flex flex-col overflow-hidden">
        {/* Animated Stars Background */}
        <AnimatedStars />
        {/* Thêm scroll cho toàn bộ trang */}
        <div className="flex-1 relative z-10 overflow-y-auto custom-scrollbar">
        {!isStarted ? (
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center px-4 py-12 min-h-full"
            >
            <div className="max-w-7xl w-full">
              {/* Hero Section */}
              <div className="text-center mb-16">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative mb-8 inline-block"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-3xl animate-pulse" />
                  <motion.div 
                    className="relative h-32 w-32 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto shadow-2xl"
                    animate={{ 
                      y: [0, -20, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </motion.div>
                </motion.div>
                
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
                >
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Mock Interview
                  </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-base sm:text-lg md:text-xl text-gray-300 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-4"
                >
                  Practice your interview skills with our AI-powered interviewer. Get real-time feedback and improve your responses.
                </motion.p>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-400 mb-8 sm:mb-12 px-4"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span>Real-time Feedback</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span>Video Interview</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="px-4"
                >
                  <Button
                    variant={"default"}
                    size={"lg"}
                    onClick={() => setShowLanguageModal(true)}
                    className="relative group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-neon transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    <span className="relative flex items-center gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl">🎤</span>
                      <span className="hidden sm:inline">Start Your Interview</span>
                      <span className="sm:hidden">Start Interview</span>
                      <motion.svg 
                        className="h-4 w-4 sm:h-5 sm:w-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </motion.svg>
                    </span>
                  </Button>
                </motion.div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4">
                {[
                  {
                    icon: "🤖",
                    title: "AI Interviewer",
                    description: "Experience realistic interviews with our advanced AI that adapts to your responses",
                    color: "from-purple-500/20 to-purple-600/20",
                    delay: 0.6
                  },
                  {
                    icon: "📊",
                    title: "Detailed Analysis",
                    description: "Get comprehensive feedback on your performance with actionable insights",
                    color: "from-blue-500/20 to-blue-600/20",
                    delay: 0.7
                  },
                  {
                    icon: "🎯",
                    title: "Skill Assessment",
                    description: "Measure your technical and soft skills across multiple dimensions",
                    color: "from-pink-500/20 to-pink-600/20",
                    delay: 0.8
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: feature.delay }}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative glass-effect border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:border-purple-500/50 transition-all duration-300 h-full">
                      <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">{feature.icon}</div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* How It Works */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="relative glass-effect border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mx-4"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      How It Works
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {[
                      { step: "1", icon: "🎯", title: "Choose Topic", desc: "Select interview type" },
                      { step: "2", icon: "🎤", title: "Start Interview", desc: "Answer AI questions" },
                      { step: "3", icon: "💬", title: "Get Feedback", desc: "Real-time analysis" },
                      { step: "4", icon: "📈", title: "Improve", desc: "Track your progress" }
                    ].map((item, idx) => (
                      <div key={idx} className="text-center group">
                        <div className="relative inline-block mb-3 sm:mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                            <span className="text-xl sm:text-2xl md:text-3xl">{item.icon}</span>
                          </div>
                          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                            {item.step}
                          </div>
                        </div>
                        <h4 className="font-bold text-white text-sm sm:text-base mb-1 sm:mb-2">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-400">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          </div>
        ) : (
          <div className="h-full flex flex-col p-3 sm:p-4 lg:p-6">
            {/* Header */}
            <div className="glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 border border-white/10">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <h1 className="text-base sm:text-lg lg:text-xl font-semibold gradient-text">Mock Interview</h1>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <InterviewTimer 
                      isStarted={isStarted} 
                      onReset={() => setElapsedTime(0)} 
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    onClick={handleCameraToggle}
                    className={cn(
                      "rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 flex items-center justify-center transition-all duration-300",
                      isCameraOn 
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 hover:shadow-neon" 
                        : "glass-effect border border-white/10 hover:bg-white/5"
                    )}
                    aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
                  >
                    <Camera 
                      className={cn(
                        "h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200", 
                        isCameraOn ? "text-white" : "text-gray-400"
                      )} 
                    />
                  </Button>
                  <Button
                    onClick={handleLeaveInterview}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-300"
                  >
                    Leave
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 flex-1 min-h-0">
              {/* Video Section */}
              <div className="w-full lg:w-[30%] flex flex-row lg:flex-col gap-3 sm:gap-4 overflow-x-auto lg:overflow-y-auto custom-scrollbar lg:pr-2">
                {/* AI Interviewer Video */}
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-purple-500/30 bg-black/50 shadow-neon flex-shrink-0 min-w-[200px] sm:min-w-[250px] lg:min-w-0">
                  <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                    <div className="absolute inset-0">
                      <DIDTalkingHead
                        text={currentAIText}
                        avatarUrl={selectedVoice?.avatarUrl}
                        voiceGender={selectedVoice?.gender}
                        isSpeaking={playingMessageId !== null}
                        onVideoReady={() => console.log('✅ D-ID video ready')}
                        onVideoEnd={() => console.log('🎬 D-ID video ended')}
                      />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 glass-effect px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-purple-500/30">
                    <span className="text-[10px] sm:text-xs text-purple-300 font-semibold flex items-center gap-1.5 sm:gap-2">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-500 animate-pulse" />
                      AI Interviewer
                    </span>
                  </div>
                </div>
                
                {/* Your Camera */}
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-purple-500/30 bg-black/50 shadow-neon flex-shrink-0 min-w-[200px] sm:min-w-[250px] lg:min-w-0">
                  <WebcamStream 
                    ref={videoRef}
                    isActive={isCameraOn}
                    onStreamReady={handleStreamReady}
                  />
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 glass-effect px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-purple-500/30">
                    <span className="text-[10px] sm:text-xs text-blue-300 font-semibold flex items-center gap-1.5 sm:gap-2">
                      <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isCameraOn ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                      {isCameraOn ? 'Your Camera' : 'Camera Off'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Section */}
              <div className="w-full lg:w-[70%] flex flex-col gap-3 sm:gap-4 flex-1 lg:flex-initial" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className="flex-1 glass-effect rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden min-h-[200px] sm:min-h-[300px]" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                  <div className="h-full overflow-y-auto custom-scrollbar">
                    <InterviewTranscript
                      messages={messages.map((msg) => ({
                        ...msg,
                        isPlaying: msg.id === playingMessageId,
                      }))}
                    />
                  </div>
                </div>
                <div className="glass-effect rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
                  <InterviewInput
                    isProcessing={isProcessing}
                    onSubmit={handleSubmit}
                    error={micError}
                    language={interviewLanguage}
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
    </>
  );
};

export default MockInterviewPage;
