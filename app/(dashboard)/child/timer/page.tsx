'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTimer } from '../../../../hooks/useTimer';
import { Play, Pause, Square, BookOpen, Clock } from 'lucide-react';

export default function TimerPage() {
  const router = useRouter();
  const timer = useTimer();
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books?status=APPROVED');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

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

      if (!response.ok) {
        throw new Error('Failed to save session');
      }

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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-green-600" />
              <span className="font-bold text-xl">Reading Timer</span>
            </div>
            <a href="/child" className="text-gray-600 hover:text-gray-900">
              Back to Dashboard
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Reading
          </h1>
          <p className="text-gray-600">Select a book and start the timer when you begin reading</p>
        </div>

        {/* Book Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Book
          </label>
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            disabled={timer.isRunning}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Choose a book...</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} - {book.author}
              </option>
            ))}
          </select>
          
          {books.length === 0 && (
            <p className="mt-3 text-sm text-amber-600">
              No approved books available. Add and get books approved by your parent first.
            </p>
          )}
        </div>

        {/* Timer Display */}
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg p-12 mb-6">
          <div className="text-center">
            <div className={`text-7xl font-mono font-bold text-white mb-8 ${timer.isRunning ? 'animate-pulse' : ''}`}>
              {timer.formatTime()}
            </div>
            
            <div className="flex gap-4 justify-center">
              {!timer.isRunning && timer.elapsedSeconds === 0 && (
                <button
                  onClick={handleStart}
                  disabled={!selectedBook}
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Play className="w-6 h-6" />
                  Start Reading
                </button>
              )}
              
              {timer.isRunning && (
                <button
                  onClick={timer.pause}
                  className="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Pause className="w-6 h-6" />
                  Pause
                </button>
              )}
              
              {!timer.isRunning && timer.elapsedSeconds > 0 && (
                <>
                  <button
                    onClick={timer.resume}
                    className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-6 h-6" />
                    Resume
                  </button>
                  <button
                    onClick={handleStop}
                    disabled={saving}
                    className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Square className="w-6 h-6" />
                    {saving ? 'Saving...' : 'Stop & Save'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        {timer.elapsedSeconds > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you read about? Any thoughts?"
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
            <p className="mt-2 text-sm text-gray-500">
              {notes.length}/500 characters
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-3 text-blue-900">Reading Tips 📖</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Find a quiet, comfortable place to read</li>
            <li>• Take short breaks every 20-30 minutes</li>
            <li>• Try to read at the same time each day to build a habit</li>
            <li>• Read for at least 3 days in a row to earn streak bonuses!</li>
          </ul>
        </div>
      </main>
    </div>
  );
}