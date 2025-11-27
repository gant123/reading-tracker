'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { showToast } from '@/lib/utils';
import { Brain, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function BookQuiz({ title, author }: { title: string, author: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        body: JSON.stringify({ title, author })
      });
      const data = await res.json();
      setQuestions(data);
      setLoading(false);
    } catch (e) {
      showToast.error("Couldn't start quiz right now");
      setIsOpen(false);
    }
  };

  const handleAnswer = async (index: number) => {
    const isCorrect = index === questions[currentQ].correctAnswer;
    if (isCorrect) setScore(s => s + 1);

    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      setFinished(true);
      if (score + (isCorrect ? 1 : 0) === questions.length) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        await fetch('/api/quiz/reward', { method: 'POST' });
        showToast.success("+50 Points earned!");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if(open && questions.length === 0) startQuiz();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 border-purple-200 text-purple-700 hover:bg-purple-50">
          <Brain className="w-4 h-4" /> Take Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Quiz: {title}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
            <p className="text-sm text-gray-500">Generating questions with AI...</p>
          </div>
        ) : finished ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">{score === questions.length ? '🏆' : '📚'}</div>
            <h3 className="text-xl font-bold mb-2">
              You got {score} out of {questions.length} correct!
            </h3>
            {score === questions.length ? (
              <p className="text-green-600 font-medium">Perfect score! +50 Points!</p>
            ) : (
              <p className="text-gray-500">Good try! Read it again to get a perfect score.</p>
            )}
          </div>
        ) : (
          questions.length > 0 && (
            <div className="py-4">
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Question {currentQ + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>
              
              <h3 className="text-lg font-medium mb-6">{questions[currentQ].question}</h3>
              
              <div className="space-y-3">
                {questions[currentQ].options.map((opt: string, idx: number) => (
                  <Button 
                    key={idx} 
                    variant="secondary" 
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleAnswer(idx)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}