"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Upload,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  BarChart3
} from "lucide-react";
import FileUpload from "./components/fileUpload";
import { 
  getRandomQuestions, 
  validateAnswer,
  type QuizQuestion,
  type QuizLevel,
  type QuizCategory 
} from "@/data/quiz-questions";
import { generateQuestionsWithAI } from "./services/questionService";

interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
}

interface QuizResult {
  questionId: string;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
  options: string[];
}

type QuizMode = 'select' | 'quiz' | 'result';

const EnhancedQuizPage = () => {
  // State Management
  const [mode, setMode] = useState<QuizMode>('select');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>('javascript');
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel>('mid');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Timer
  useEffect(() => {
    if (mode === 'quiz' && startTime > 0) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, startTime]);

  // Start Quiz Handler
  const handleStartQuiz = async () => {
    setIsLoadingQuestions(true);
    
    try {
      // Get 20 random questions from 1000 question pool
      // Distribution: 6 low, 8 mid, 6 high
      const selectedQuestions = getRandomQuestions(selectedCategory, 20, {
        low: 6,
        mid: 8,
        high: 6
      });

      // If skills from resume don't match, generate with AI
      if (uploadedResume && extractedSkills.length > 0) {
        const needsAIGeneration = !extractedSkills.includes(selectedCategory);
        
        if (needsAIGeneration) {
          const aiQuestions = await generateQuestionsWithAI(
            extractedSkills,
            selectedLevel,
            20
          );
          setQuestions(aiQuestions);
        } else {
          setQuestions(selectedQuestions);
        }
      } else {
        setQuestions(selectedQuestions);
      }

      setMode('quiz');
      setStartTime(Date.now());
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Answer Selection Handler
  const handleAnswerSelect = (answerIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    setUserAnswers([
      ...userAnswers,
      {
        questionId: currentQuestion.id,
        selectedAnswer: answerIndex,
        timeSpent
      }
    ]);

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  // Submit Quiz Handler
  const handleSubmitQuiz = () => {
    const results: QuizResult[] = questions.map((question, index) => {
      const userAnswer = userAnswers[index];
      const validation = validateAnswer(question.id, userAnswer?.selectedAnswer || -1);

      return {
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswer?.selectedAnswer || -1,
        correctAnswer: validation.correctAnswer,
        isCorrect: validation.isCorrect,
        explanation: validation.explanation,
        options: question.options
      };
    });

    setQuizResults(results);
    setMode('result');
  };

  // Calculate Score
  const calculateScore = () => {
    const correct = quizResults.filter(r => r.isCorrect).length;
    const total = quizResults.length;
    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage };
  };

  // Get Performance Level
  const getPerformanceLevel = (percentage: number): { level: string; color: string; icon: any } => {
    if (percentage >= 90) return { level: 'Xuất sắc', color: 'text-green-500', icon: Award };
    if (percentage >= 75) return { level: 'Giỏi', color: 'text-blue-500', icon: TrendingUp };
    if (percentage >= 60) return { level: 'Khá', color: 'text-purple-500', icon: Target };
    return { level: 'Cần cố gắng', color: 'text-orange-500', icon: BarChart3 };
  };

  // Format Time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render Mode: Selection
  if (mode === 'select') {
    return (
      <div className="relative min-h-screen">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block mb-4">
            <Brain className="h-16 w-16 text-purple-500 animate-float mx-auto" />
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            Enhanced Quiz System
          </h1>
          <p className="text-lg text-gray-400">
            Test your knowledge with 1000+ questions • Smart level distribution • AI-powered
          </p>
        </div>

        {/* Resume Upload (Optional) */}
        <div className="glass-effect rounded-2xl p-8 mb-8 hover-scale">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="h-6 w-6 text-purple-500" />
            <h3 className="text-xl font-semibold">Upload Resume (Optional)</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Upload your resume to get personalized questions based on your skills
          </p>
          <FileUpload
            onFileChange={setUploadedResume}
            maxSizeInMB={10}
            validTypes={["application/pdf"]}
            title="Drag & drop your resume"
            description="PDF format only"
            icon={<Upload className="h-12 w-12 text-purple-500" />}
          />
        </div>

        {/* Category Selection */}
        <div className="glass-effect rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 gradient-text">Select Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(['javascript', 'typescript', 'react', 'nodejs', 'python', 
               'java', 'database', 'algorithms', 'system-design', 'devops'] as QuizCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-4 rounded-xl border-2 transition-all hover-scale ${
                  selectedCategory === cat
                    ? 'border-purple-500 bg-purple-500/20 neon-shadow'
                    : 'border-white/10 bg-white/5 hover:border-purple-400'
                }`}
              >
                <div className="text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="font-semibold capitalize">{cat}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Level Selection */}
        <div className="glass-effect rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 gradient-text">Select Difficulty</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['low', 'mid', 'high'] as QuizLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`p-6 rounded-xl border-2 transition-all hover-scale ${
                  selectedLevel === level
                    ? 'border-green-500 bg-green-500/20 neon-shadow'
                    : 'border-white/10 bg-white/5 hover:border-green-400'
                }`}
              >
                <div className="text-center">
                  <Target className={`h-10 w-10 mx-auto mb-3 ${
                    level === 'low' ? 'text-green-500' :
                    level === 'mid' ? 'text-yellow-500' :
                    'text-red-500'
                  }`} />
                  <h4 className="text-xl font-bold mb-2 capitalize">{level}</h4>
                  <p className="text-sm text-gray-400">
                    {level === 'low' && 'Basic concepts & fundamentals'}
                    {level === 'mid' && 'Intermediate topics & patterns'}
                    {level === 'high' && 'Advanced & expert level'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Info */}
        <div className="glass-effect rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 gradient-text">📊 Quiz Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
              <p className="text-3xl font-bold text-purple-500">20</p>
              <p className="text-sm text-gray-400 mt-2">Total Questions</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/30">
              <p className="text-3xl font-bold text-green-500">6</p>
              <p className="text-sm text-gray-400 mt-2">Easy Questions</p>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
              <p className="text-3xl font-bold text-yellow-500">8</p>
              <p className="text-sm text-gray-400 mt-2">Medium Questions</p>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/30">
              <p className="text-3xl font-bold text-red-500">6</p>
              <p className="text-sm text-gray-400 mt-2">Hard Questions</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleStartQuiz}
            disabled={isLoadingQuestions}
            className="btn-neon text-white px-12 py-8 text-xl rounded-2xl animate-pulse-glow"
            size="lg"
          >
            {isLoadingQuestions ? (
              <>
                <Clock className="animate-spin mr-3 h-6 w-6" />
                Loading Questions...
              </>
            ) : (
              <>
                <Sparkles className="mr-3 h-6 w-6" />
                Start Quiz (20 Questions)
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Render Mode: Quiz
  if (mode === 'quiz' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="relative min-h-screen">
        {/* Progress Bar */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-500" />
              <span className="text-lg font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-purple-500 animate-pulse" />
              <span className="text-lg font-semibold">{formatTime(timeElapsed)}</span>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 neon-shadow"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-effect rounded-2xl p-8 mb-8 hover-scale animate-fade-in-up">
          {/* Level Badge */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              currentQuestion.level === 'low' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
              currentQuestion.level === 'mid' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
              'bg-red-500/20 text-red-500 border border-red-500/30'
            }`}>
              {currentQuestion.level.toUpperCase()} LEVEL
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl font-bold mb-8 text-white leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className="w-full p-6 rounded-xl border-2 border-white/10 bg-white/5 hover:border-purple-500 hover:bg-purple-500/10 transition-all hover-scale text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <p className="text-gray-400">
            {currentQuestionIndex === questions.length - 1 
              ? 'Last question - Choose an answer to finish' 
              : 'Choose an answer to continue'}
          </p>
          <Button
            onClick={handleSubmitQuiz}
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-500/20"
          >
            Finish Quiz
          </Button>
        </div>
      </div>
    );
  }

  // Render Mode: Results
  if (mode === 'result') {
    const score = calculateScore();
    const performance = getPerformanceLevel(score.percentage);
    const PerformanceIcon = performance.icon;

    return (
      <div className="relative min-h-screen">
        {/* Score Card */}
        <div className="glass-effect rounded-2xl p-12 mb-8 text-center animate-fade-in-up">
          <div className="mb-6">
            <PerformanceIcon className={`h-24 w-24 mx-auto ${performance.color} animate-float`} />
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            {score.percentage}%
          </h1>
          <p className={`text-2xl font-semibold mb-6 ${performance.color}`}>
            {performance.level}
          </p>
          <div className="flex justify-center gap-8 text-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <span>{score.correct} Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              <span>{score.total - score.correct} Wrong</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-purple-500" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="glass-effect rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-8 gradient-text">📝 Detailed Results</h2>
          <div className="space-y-6">
            {quizResults.map((result, index) => (
              <div
                key={result.questionId}
                className={`p-6 rounded-xl border-2 ${
                  result.isCorrect
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-red-500/30 bg-red-500/5'
                }`}
              >
                {/* Question Number & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    {result.isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-lg font-semibold mb-4">{result.question}</p>

                {/* Options */}
                <div className="space-y-3 mb-4">
                  {result.options.map((option, optIndex) => {
                    const isUserAnswer = optIndex === result.userAnswer;
                    const isCorrectAnswer = optIndex === result.correctAnswer;

                    return (
                      <div
                        key={optIndex}
                        className={`p-4 rounded-lg border ${
                          isCorrectAnswer
                            ? 'border-green-500 bg-green-500/10'
                            : isUserAnswer
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span className="flex-1">{option}</span>
                          {isCorrectAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-purple-500 mb-2">Explanation:</p>
                      <p className="text-gray-300">{result.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6">
          <Button
            onClick={() => {
              setMode('select');
              setQuestions([]);
              setUserAnswers([]);
              setQuizResults([]);
              setCurrentQuestionIndex(0);
              setTimeElapsed(0);
            }}
            className="btn-neon text-white px-8 py-6 text-lg rounded-xl"
            size="lg"
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Take Another Quiz
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default EnhancedQuizPage;
