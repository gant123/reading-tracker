'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function ChildBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddBook = async (book: any) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });

      if (response.ok) {
        alert('Book added! Waiting for parent approval.');
        setSearchResults([]);
        setSearchQuery('');
        fetchBooks();
      }
    } catch (error) {
      console.error('Failed to add book:', error);
      alert('Failed to add book');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl">My Books</span>
            </div>
            <Link href="/child" className="text-gray-600 hover:text-gray-900">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Search for Books</h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={searching}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((book, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  {book.coverUrl && (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-sm mb-1">{book.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                  {book.pageCount && (
                    <p className="text-xs text-gray-500 mb-3">{book.pageCount} pages</p>
                  )}
                  <button
                    onClick={() => handleAddBook(book)}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add Book
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Books */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Books</h2>
          
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div key={book.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {book.coverUrl && (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{book.title}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          book.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : book.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {book.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                    {book.pageCount && (
                      <p className="text-gray-500 text-xs">{book.pageCount} pages</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Books Yet
              </h3>
              <p className="text-gray-600">
                Search for books above to get started!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}