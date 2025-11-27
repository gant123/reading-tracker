'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTimer } from '@/hooks/useTimer';
import { useBooks } from '@/hooks/useBooks';
import { Play, Pause, Square, BookOpen, Clock, ChevronDown, Sparkles, Star } from 'lucide-react';

export default function TimerPage() {
  const router = useRouter();
  const timer = useTimer();
  const { books, loading } = useBooks('APPROVED');
  
  const [selectedBook, setSelectedBook] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedBookData = books.find(b => b.id === selectedBook);

  const handleStart = () => {
    if (!selectedBook) {
      alert('Please select a book first');
      return;
    }
    timer.start();
  };

  const handleStop = async () => {
    const sessionData = timer.stop();
    if (!sessionData) return;

    setSaving(true);
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: selectedBook,
          startTime: sessionData.startTime.toISOString(),
          endTime: sessionData.endTime.toISOString(),
          durationMinutes: sessionData.durationMinutes,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to save session');

      const result = await response.json();
      alert(`Great job! You earned ${result.pointsEarned} points! 🎉`);
      timer.reset();
      setNotes('');
      router.push('/child');
    } catch (error) {
      console.error('Failed to save session:', error);
      alert('Failed to save reading session. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Reading Timer
        </h1>
        <p className="text-gray-600">
          Select a book and start tracking your reading session
        </p>
      </div>

      {/* Book Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          What are you reading?
        </label>
        <div className="relative">
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            disabled={timer.isRunning}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-medium"
          >
            <option value="">Choose a book...</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} — {book.author}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        {selectedBookData && (
          <div className="mt-4 flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            {selectedBookData.coverUrl && (
              <img
                src={selectedBookData.coverUrl}
                alt={selectedBookData.title}
                className="w-16 h-20 object-cover rounded-lg shadow-sm"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{selectedBookData.title}</p>
              <p className="text-sm text-gray-600">{selectedBookData.author}</p>
              {selectedBookData.pageCount && (
                <p className="text-xs text-gray-500 mt-1">{selectedBookData.pageCount} pages</p>
              )}
            </div>
          </div>
        )}
        
        {books.length === 0 && (
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-amber-800 text-sm font-medium">
              No approved books available. Add books and get them approved by your parent first.
            </p>
          </div>
        )}
      </div>

      {/* Timer Display */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl shadow-2xl shadow-blue-500/30 p-8 sm:p-12">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        
        <div className="relative text-center">
          {/* Timer */}
          <div className={`text-6xl sm:text-8xl font-mono font-bold text-white mb-8 tracking-wider ${
            timer.isRunning ? 'animate-pulse' : ''
          }`}>
            {timer.formatTime()}
          </div>

          {/* Points preview */}
          {timer.elapsedSeconds > 0 && (
            <div className="flex items-center justify-center gap-2 mb-8 text-white/80">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-lg">
                ~{Math.floor(timer.elapsedSeconds / 60)} points earned
              </span>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-center">
            {!timer.isRunning && timer.elapsedSeconds === 0 && (
              <button
                onClick={handleStart}
                disabled={!selectedBook}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Play className="w-6 h-6" />
                Start Reading
              </button>
            )}
            
            {timer.isRunning && (
              <button
                onClick={timer.pause}
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all flex items-center gap-3 border border-white/30"
              >
                <Pause className="w-6 h-6" />
                Pause
              </button>
            )}
            
            {!timer.isRunning && timer.elapsedSeconds > 0 && (
              <>
                <button
                  onClick={timer.resume}
                  className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Play className="w-6 h-6" />
                  Resume
                </button>
                <button
                  onClick={handleStop}
                  disabled={saving}
                  className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-emerald-500 hover:to-green-600 transition-all disabled:opacity-50 flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Square className="w-6 h-6" />
                  {saving ? 'Saving...' : 'Save Session'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {timer.elapsedSeconds > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Session Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you read about? Any thoughts or favorite parts?"
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
          />
          <p className="mt-2 text-sm text-gray-500 text-right">
            {notes.length}/500
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-indigo-100/50">
        <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          Reading Tips
        </h3>
        <ul className="space-y-2 text-sm text-indigo-800">
          <li className="flex items-start gap-2">
            <span className="text-indigo-400">•</span>
            Find a quiet, comfortable spot to read
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400">•</span>
            Take short breaks every 20-30 minutes
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400">•</span>
            Read 3+ days in a row for bonus points!
          </li>
        </ul>
      </div>
    </div>
  );
}