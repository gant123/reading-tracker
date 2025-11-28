'use client';

import { useState, useEffect } from 'react';
import { 
  X, Loader2, AlertCircle, CheckCircle, XCircle, Trophy, 
  Star, BookOpen, Clock, RefreshCw, PartyPopper, Lock
} from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizStatus {
  status: 'AVAILABLE' | 'COOLDOWN' | 'PASSED';
  locked: boolean;
  canTakeQuiz: boolean;
  canRetryAt?: string;
  timeRemaining?: number;
  lastAttempt?: {
    score: number;
    totalQuestions: number;
  };
  message: string;
}

interface BookQuizProps {
  bookId: string;
  bookTitle: string;
  onClose: () => void;
  onQuizComplete?: (passed: boolean, pointsEarned: number) => void;
}

export default function BookQuiz({ bookId, bookTitle, onClose, onQuizComplete }: BookQuizProps) {
  // Quiz status state
  const [quizStatus, setQuizStatus] = useState<QuizStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  
  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Result state
  const [quizResult, setQuizResult] = useState<{
    passed: boolean;
    pointsEarned: number;
    canRetryAt?: string;
  } | null>(null);

  // Cooldown timer
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Check quiz status on mount
  useEffect(() => {
    checkQuizStatus();
  }, [bookId]);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemaining(prev => {
        if (prev <= 1000) {
          // Cooldown finished, refresh status
          checkQuizStatus();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const checkQuizStatus = async () => {
    try {
      setStatusLoading(true);
      const res = await fetch(`/api/quiz/status?bookId=${bookId}`);
      const data = await res.json();
      
      setQuizStatus(data);
      
      if (data.status === 'COOLDOWN' && data.timeRemaining) {
        setCooldownRemaining(data.timeRemaining);
      }
    } catch (err) {
      console.error('Failed to check quiz status:', err);
      // Set a default status so the component doesn't get stuck
      setQuizStatus({ status: 'AVAILABLE', locked: false, canTakeQuiz: true, message: '' });
    } finally {
      setStatusLoading(false);
    }
  };

  const generateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: bookTitle }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data = await res.json();
     
      // Validate questions before setting
      if (!data|| !Array.isArray(data) || data.length === 0) {
        throw new Error('No questions received from server');
      }
      
      setQuestions(data);
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuizResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const submitQuizResult = async (finalScore: number, totalQuestions: number) => {
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          score: finalScore,
          totalQuestions,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setQuizResult({
          passed: data.passed,
          pointsEarned: data.pointsEarned,
          canRetryAt: data.canRetryAt,
        });
        
        if (data.canRetryAt) {
          const retryTime = new Date(data.canRetryAt).getTime();
          setCooldownRemaining(retryTime - Date.now());
        }
        
        onQuizComplete?.(data.passed, data.pointsEarned);
      } else {
        console.error('Submit error:', data.error);
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null || !questions[currentQuestion]) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Move to next question or show results after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        const finalScore = isCorrect ? score + 1 : score;
        setShowResult(true);
        submitQuizResult(finalScore, questions.length);
      }
    }, 1500);
  };

  const formatTimeRemaining = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  };

  // Loading status
  if (statusLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600">Checking quiz status...</p>
        </div>
      </div>
    );
  }

  // Quiz already passed (locked)
  if (quizStatus?.status === 'PASSED') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed! 🎉</h2>
          <p className="text-gray-600 mb-6">
            You've already aced this quiz and earned your points!
          </p>
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-emerald-700">
              <Lock className="w-5 h-5" />
              <span className="font-semibold">+50 points earned</span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Quiz on cooldown
  if (quizStatus?.status === 'COOLDOWN' && cooldownRemaining > 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Clock className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Cooldown</h2>
          <p className="text-gray-600 mb-6">
            Take some time to re-read the book and try again!
          </p>
          
          {quizStatus.lastAttempt && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500 mb-1">Last attempt</p>
              <p className="text-lg font-bold text-gray-900">
                {quizStatus.lastAttempt.score}/{quizStatus.lastAttempt.totalQuestions} correct
              </p>
            </div>
          )}
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-600 mb-1">Try again in</p>
            <p className="text-3xl font-bold text-amber-700">
              {formatTimeRemaining(cooldownRemaining)}
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> Read the book again and pay attention to the main characters, events, and lessons!
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setError(null);
                generateQuiz();
              }}
              className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading quiz
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600">Generating quiz questions...</p>
          <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // Show results
  if (showResult && quizResult) {
    const isPerfect = quizResult.passed;
    const totalQuestions = questions.length || 3; // Fallback to 3 if somehow empty
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
          {/* Confetti background for winners */}
          {isPerfect && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 text-2xl animate-bounce">🎉</div>
              <div className="absolute top-8 right-8 text-2xl animate-bounce delay-100">⭐</div>
              <div className="absolute bottom-20 left-8 text-2xl animate-bounce delay-200">🌟</div>
              <div className="absolute bottom-24 right-4 text-2xl animate-bounce delay-300">🎊</div>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
            isPerfect 
              ? 'bg-gradient-to-br from-amber-400 to-yellow-500' 
              : 'bg-gradient-to-br from-blue-400 to-indigo-500'
          }`}>
            {isPerfect ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <BookOpen className="w-12 h-12 text-white" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isPerfect ? 'Perfect Score! 🏆' : 'Nice Try! 📚'}
          </h2>
          
          <p className="text-4xl font-bold mb-2">
            {score}/{totalQuestions}
          </p>
          <p className="text-gray-600 mb-6">questions correct</p>
          
          {isPerfect ? (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-amber-700 mb-1">
                <PartyPopper className="w-5 h-5" />
                <span className="font-bold text-lg">+{quizResult.pointsEarned} Points!</span>
              </div>
              <p className="text-sm text-amber-600">
                Congratulations! You've mastered this book!
              </p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <p className="text-blue-700 font-semibold mb-1">
                  Don't give up!
                </p>
                <p className="text-sm text-blue-600">
                  Re-read the book and try again. You've got this! 💪
                </p>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-amber-700">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Try again in 12 hours</span>
                </div>
              </div>
            </>
          )}
          
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-bold transition-colors ${
              isPerfect 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg shadow-amber-500/25' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {isPerfect ? 'Awesome! Close' : 'Close'}
          </button>
        </div>
      </div>
    );
  }

  // No questions yet - show start screen (MUST come before quiz in progress)
  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Quiz</h2>
          <p className="text-gray-600 mb-2">{bookTitle}</p>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 my-6">
            <div className="flex items-center justify-center gap-2 text-purple-700 mb-2">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">Earn 50 Points!</span>
            </div>
            <p className="text-sm text-purple-600">
              Get all 3 questions right to earn points
            </p>
          </div>
          
          <div className="text-left bg-gray-50 rounded-xl p-4 mb-6 text-sm">
            <p className="font-semibold text-gray-900 mb-2">Quiz Rules:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• 3 multiple choice questions</li>
              <li>• Must get <strong>all 3 correct</strong> to pass</li>
              <li>• If you don't pass, try again in 12 hours</li>
              <li>• Once passed, quiz is locked</li>
            </ul>
          </div>
          
          <button
            onClick={generateQuiz}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-purple-500/25"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz in progress - only reached if questions.length > 0
  const question = questions[currentQuestion];
  
  // Safety check - if somehow we don't have a valid question, show error
  if (!question) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">Unable to load quiz question</p>
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500" />
              {score} correct
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Question */}
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          {question.question}
        </h3>
        
        {/* Options */}
        <div className="space-y-3">
          {question.options && question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showCorrect = selectedAnswer !== null && isCorrect;
            const showIncorrect = isSelected && !isCorrect;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                  showCorrect
                    ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-900'
                    : showIncorrect
                    ? 'bg-red-100 border-2 border-red-500 text-red-900'
                    : selectedAnswer !== null
                    ? 'bg-gray-50 border-2 border-gray-200 text-gray-400'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  showCorrect
                    ? 'bg-emerald-500 text-white'
                    : showIncorrect
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {showCorrect ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : showIncorrect ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span className="flex-1 font-medium">{option}</span>
              </button>
            );
          })}
        </div>
        
        {/* Feedback Message */}
        {selectedAnswer !== null && (
          <div className={`mt-4 p-3 rounded-xl text-center font-semibold ${
            selectedAnswer === question.correctAnswer
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {selectedAnswer === question.correctAnswer
              ? '✨ Correct! Great job!'
              : `Not quite. The answer was: ${question.options[question.correctAnswer]}`
            }
          </div>
        )}
      </div>
    </div>
  );
}