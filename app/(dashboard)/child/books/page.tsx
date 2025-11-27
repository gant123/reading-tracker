'use client';

import { useState } from 'react';
import { BookOpen, Plus, Search, X, Check, Clock, AlertCircle } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';

export default function ChildBooksPage() {
  const { books, loading, addBook, searchBooks } = useBooks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const data = await searchBooks(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddBook = async (book: any) => {
    try {
      await addBook(book);
      alert('Book added! Waiting for parent approval.');
      setSearchResults([]);
      setSearchQuery('');
      setShowSearch(false);
    } catch (error) {
      console.error('Failed to add book:', error);
      alert('Failed to add book');
    }
  };

  const approvedBooks = books.filter(b => b.status === 'APPROVED');
  const pendingBooks = books.filter(b => b.status === 'PENDING');
  const rejectedBooks = books.filter(b => b.status === 'REJECTED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-emerald-500" />
            My Books
          </h1>
          <p className="text-gray-600 mt-1">
            {approvedBooks.length} approved • {pendingBooks.length} pending
          </p>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
        >
          {showSearch ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showSearch ? 'Close Search' : 'Add Book'}
        </button>
      </div>

      {/* Search Section */}
      {showSearch && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Search for Books</h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or ISBN..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {searching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Found {searchResults.length} results
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((book, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
                    <div className="flex gap-3">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">{book.title}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">{book.author}</p>
                        {book.pageCount && (
                          <p className="text-xs text-gray-500 mt-1">{book.pageCount} pages</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddBook(book)}
                      className="w-full mt-3 bg-emerald-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pending Books */}
      {pendingBooks.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-amber-900">Waiting for Approval</h2>
              <p className="text-amber-700 text-sm">{pendingBooks.length} book{pendingBooks.length !== 1 ? 's' : ''} pending</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {pendingBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-xl p-3 shadow-sm">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full h-24 sm:h-32 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                <p className="font-medium text-sm text-gray-900 line-clamp-1">{book.title}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Books */}
      <div>
        <h2 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-500" />
          Ready to Read
        </h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading books...</p>
          </div>
        ) : approvedBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {approvedBooks.map((book) => (
              <div key={book.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-32 sm:h-40 bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-emerald-300" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base">{book.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-1">{book.author}</p>
                  {book.pageCount && (
                    <p className="text-gray-400 text-xs mt-2">{book.pageCount} pages</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Books Yet</h3>
            <p className="text-gray-600 mb-4">
              Search and add books to start your reading journey!
            </p>
            <button
              onClick={() => setShowSearch(true)}
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Book
            </button>
          </div>
        )}
      </div>

      {/* Rejected Books */}
      {rejectedBooks.length > 0 && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-red-900">Not Approved</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {rejectedBooks.map((book) => (
              <div key={book.id} className="bg-white/80 rounded-xl p-3 opacity-75">
                <p className="font-medium text-sm text-gray-700 line-clamp-1">{book.title}</p>
                <p className="text-xs text-gray-500">{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}