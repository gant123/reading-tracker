'use client';

import { useState, useEffect } from 'react';
import { Trophy, Clock, HelpCircle, Loader2 } from 'lucide-react';

interface QuizStatusBadgeProps {
  bookId: string;
  compact?: boolean;
}

interface QuizStatus {
  status: 'AVAILABLE' | 'COOLDOWN' | 'PASSED';
  canRetryAt?: string;
  timeRemaining?: number;
}

export default function QuizStatusBadge({ bookId, compact = false }: QuizStatusBadgeProps) {
  const [status, setStatus] = useState<QuizStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  useEffect(() => {
    fetchStatus();
  }, [bookId]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemaining(prev => {
        if (prev <= 1000) {
          fetchStatus();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/quiz/status?bookId=${bookId}`);
      const data = await res.json();
      setStatus(data);
      
      if (data.status === 'COOLDOWN' && data.timeRemaining) {
        setCooldownRemaining(data.timeRemaining);
      }
    } catch (err) {
      console.error('Failed to fetch quiz status:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    if (compact) return null;
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
        <Loader2 className="w-3 h-3 animate-spin" />
      </span>
    );
  }

  if (!status) return null;

  if (status.status === 'PASSED') {
    return (
      <span className={`inline-flex items-center gap-1 ${
        compact 
          ? 'text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full'
          : 'text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200'
      }`}>
        <Trophy className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
        <span className="font-medium">Quiz Passed</span>
      </span>
    );
  }

  if (status.status === 'COOLDOWN' && cooldownRemaining > 0) {
    return (
      <span className={`inline-flex items-center gap-1 ${
        compact 
          ? 'text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full'
          : 'text-sm bg-amber-50 text-amber-700 px-3 py-1 rounded-lg border border-amber-200'
      }`}>
        <Clock className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
        <span className="font-medium">
          {compact ? formatTime(cooldownRemaining) : `Retry in ${formatTime(cooldownRemaining)}`}
        </span>
      </span>
    );
  }

  // Available
  return (
    <span className={`inline-flex items-center gap-1 ${
      compact 
        ? 'text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full'
        : 'text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-lg border border-purple-200'
    }`}>
      <HelpCircle className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
      <span className="font-medium">{compact ? 'Quiz' : 'Take Quiz'}</span>
    </span>
  );
}