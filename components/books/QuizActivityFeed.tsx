'use client';

import { useState, useEffect } from 'react';
import { Trophy, BookOpen, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface QuizAttempt {
  id: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  pointsEarned: number;
  attemptedAt: string;
  user: {
    id: string;
    name: string;
    avatarSeed?: string;
    avatarStyle?: string;
    avatarColor?: string;
  };
  book: {
    id: string;
    title: string;
  };
}

interface QuizActivityFeedProps {
  childIds: string[];
  limit?: number;
}

export default function QuizActivityFeed({ childIds, limit = 10 }: QuizActivityFeedProps) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (childIds.length > 0) {
      fetchAttempts();
    } else {
      setLoading(false);
    }
  }, [childIds]);

  const fetchAttempts = async () => {
    try {
      const res = await fetch(`/api/quiz/activity?childIds=${childIds.join(',')}&limit=${limit}`);
      const data = await res.json();
      setAttempts(data.attempts || []);
    } catch (err) {
      console.error('Failed to fetch quiz activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = (user: QuizAttempt['user']) => {
    const seed = user.avatarSeed || user.name;
    const style = user.avatarStyle || 'adventurer';
    const bgColor = (user.avatarColor || '60a5fa').replace('#', '');
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=64&backgroundColor=${bgColor}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-lg sm:text-xl text-gray-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-500" />
          Quiz Activity
        </h2>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
          {attempts.filter(a => a.passed).length} passed
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {attempts.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No quiz attempts yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Quizzes will appear here when your children take them
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((attempt) => (
              <div
                key={attempt.id}
                className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                  attempt.passed 
                    ? 'bg-emerald-50 border border-emerald-100' 
                    : 'bg-gray-50 border border-gray-100'
                }`}
              >
                {/* Avatar */}
                <img
                  src={getAvatarUrl(attempt.user)}
                  alt={attempt.user.name}
                  className="w-10 h-10 rounded-full ring-2 ring-white shadow flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">
                      {attempt.user.name}
                    </span>
                    {attempt.passed ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" />
                        {attempt.score}/{attempt.totalQuestions}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-0.5">
                    {attempt.book.title}
                  </p>
                </div>

                {/* Points & Time */}
                <div className="text-right flex-shrink-0">
                  {attempt.passed && (
                    <p className="text-sm font-bold text-emerald-600">
                      +{attempt.pointsEarned} pts
                    </p>
                  )}
                  <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {formatDate(attempt.attemptedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}