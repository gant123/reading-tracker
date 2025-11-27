'use client';

import { useBooks } from '@/hooks/useBooks';
import { BookOpen, Check, X, User, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ParentBooksPage() {
  const { books: pendingBooks, loading, refresh } = useBooks('PENDING');
  const [processing, setProcessing] = useState<string | null>(null);

  const handleAction = async (bookId: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessing(bookId);
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update book');
      }
    } catch (error) {
      console.error('Failed to update book:', error);
      alert('Failed to update book');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-amber-500" />
          Book Approvals
        </h1>
        <p className="text-gray-600 mt-1">
          Review and approve books your children want to read
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading book requests...</p>
          </div>
        </div>
      ) : pendingBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {pendingBooks.map((book: any) => (
            <div key={book.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all">
              {/* Book Cover */}
              {book.coverUrl ? (
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              ) : (
                <div className="h-40 sm:h-48 bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-amber-300" />
                </div>
              )}
              
              {/* Book Info */}
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                
                {book.description && (
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                    {book.description}
                  </p>
                )}

                {book.pageCount && (
                  <p className="text-gray-400 text-xs mb-4">{book.pageCount} pages</p>
                )}
                
                {/* Requested By */}
                <div className="bg-blue-50 rounded-xl p-3 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-blue-600 font-medium">Requested by</p>
                    <p className="text-sm text-blue-900 font-semibold truncate">{book.user?.name || 'Child'}</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(book.id, 'APPROVED')}
                    disabled={processing === book.id}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing === book.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleAction(book.id, 'REJECTED')}
                    disabled={processing === book.id}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            No pending book requests. New requests from your children will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}