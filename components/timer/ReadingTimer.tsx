'use client';

import { useTimer } from '@/hooks/useTimer';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReadingTimerProps {
  onComplete?: (data: { startTime: Date; endTime: Date; durationMinutes: number }) => void;
}

export function ReadingTimer({ onComplete }: ReadingTimerProps) {
  const timer = useTimer();

  const handleStop = () => {
    const result = timer.stop();
    if (result && onComplete) {
      onComplete(result);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-400 to-emerald-500 text-white border-none">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Reading Timer</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className={`text-7xl font-mono font-bold text-center mb-8 ${timer.isRunning ? 'animate-pulse' : ''}`}>
          {timer.formatTime()}
        </div>
        
        <div className="flex gap-4 justify-center">
          {!timer.isRunning && timer.elapsedSeconds === 0 && (
            <Button
              onClick={timer.start}
              size="lg"
              variant="secondary"
              className="text-green-600"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Reading
            </Button>
          )}
          
          {timer.isRunning && (
            <Button
              onClick={timer.pause}
              size="lg"
              variant="secondary"
              className="text-amber-600"
            >
              <Pause className="w-6 h-6 mr-2" />
              Pause
            </Button>
          )}
          
          {!timer.isRunning && timer.elapsedSeconds > 0 && (
            <>
              <Button
                onClick={timer.resume}
                size="lg"
                variant="secondary"
                className="text-green-600"
              >
                <Play className="w-6 h-6 mr-2" />
                Resume
              </Button>
              <Button
                onClick={handleStop}
                size="lg"
                variant="secondary"
                className="text-red-600"
              >
                <Square className="w-6 h-6 mr-2" />
                Stop & Save
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}