'use client';

import { useState, useEffect } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  googleBooksId?: string | null;
  pageCount?: number | null;
  description?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useBooks(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = status ? `/api/books?status=${status}` : '/api/books';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [status]);

  const addBook = async (bookData: {
    title: string;
    author: string;
    coverUrl?: string;
    googleBooksId?: string;
    pageCount?: number;
    description?: string;
  }) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error('Failed to add book');
      }

      const newBook = await response.json();
      setBooks((prev) => [newBook, ...prev]);
      return newBook;
    } catch (err: any) {
      setError(err.message || 'Failed to add book');
      throw err;
    }
  };

  const updateBookStatus = async (
    bookId: string,
    status: 'APPROVED' | 'REJECTED'
  ) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update book status');
      }

      const updatedBook = await response.json();
      setBooks((prev) =>
        prev.map((book) => (book.id === bookId ? updatedBook : book))
      );
      return updatedBook;
    } catch (err: any) {
      setError(err.message || 'Failed to update book status');
      throw err;
    }
  };

  const deleteBook = async (bookId: string) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      setBooks((prev) => prev.filter((book) => book.id !== bookId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete book');
      throw err;
    }
  };

  const searchBooks = async (query: string) => {
    try {
      const response = await fetch(
        `/api/books/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Failed to search books');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message || 'Failed to search books');
      throw err;
    }
  };

  const refresh = () => {
    fetchBooks();
  };

  return {
    books,
    loading,
    error,
    addBook,
    updateBookStatus,
    deleteBook,
    searchBooks,
    refresh,
  };
}