'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface BookSearchProps {
  onBookAdd?: (book: any) => void;
}

export function BookSearch({ onBookAdd }: BookSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
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
        alert('Book added successfully!');
        setResults([]);
        setQuery('');
        onBookAdd?.(book);
      }
    } catch (error) {
      console.error('Failed to add book:', error);
      alert('Failed to add book');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-3">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or ISBN..."
          className="flex-1"
        />
        <Button type="submit" disabled={searching}>
          <Search className="w-4 h-4 mr-2" />
          {searching ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((book, index) => (
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
              <Button
                onClick={() => handleAddBook(book)}
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Book
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}