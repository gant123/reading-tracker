'use client';

import { useBooks } from '@/hooks/useBooks'; //
import { BookApproval } from '@/components/books/BookApproval';
import { BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ParentBooksPage() {
  const router = useRouter();
  
  // Use the hook for real-time pending books
  const { books: pendingBooks, loading, refresh } = useBooks('PENDING');

  const handleActionComplete = () => {
    // Refresh the list immediately when an action is taken
    refresh();
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pending Book Approvals
        </h1>
        <p className="text-gray-600">
          Review and approve books your children want to read
        </p>
      </div>

      {pendingBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingBooks.map((book) => (
            <BookApproval
              key={book.id}
              book={book}
              onApprove={handleActionComplete}
              onReject={handleActionComplete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Pending Books
          </h3>
          <p className="text-gray-600">
            All books have been reviewed. New requests will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}