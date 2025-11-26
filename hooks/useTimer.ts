import { useState, useEffect, useRef } from 'react';

interface UseTimerReturn {
  isRunning: boolean;
  elapsedSeconds: number;
  startTime: Date | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => { startTime: Date; endTime: Date; durationMinutes: number } | null;
  reset: () => void;
  formatTime: () => string;
}

export function useTimer(): UseTimerReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = () => {
    setStartTime(new Date());
    setElapsedSeconds(0);
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const resume = () => {
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    
    if (!startTime) return null;

    const endTime = new Date();
    const durationMinutes = Math.floor(elapsedSeconds / 60);

    return {
      startTime,
      endTime,
      durationMinutes: Math.max(durationMinutes, 1), // Minimum 1 minute
    };
  };

  const reset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setStartTime(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = () => {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    isRunning,
    elapsedSeconds,
    startTime,
    start,
    pause,
    resume,
    stop,
    reset,
    formatTime,
  };
}