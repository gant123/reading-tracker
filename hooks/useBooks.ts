'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  user?: { name: string; email: string };
}

export function useBooks(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
  const queryClient = useQueryClient();
  const queryKey = ['books', status || 'all'];

  // 1. FETCHING (with Real-time Polling)
  const { data: books = [], isLoading: loading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const url = status ? `/api/books?status=${status}` : '/api/books';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch books');
      return response.json() as Promise<Book[]>;
    },
    refetchInterval: 2000, // Poll every 2 seconds for updates
  });

  // 2. ADD BOOK
  const addBook = useMutation({
    mutationFn: async (bookData: any) => {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      if (!response.ok) throw new Error('Failed to add book');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  // 3. UPDATE STATUS
  const updateBookStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'APPROVED' | 'REJECTED' }) => {
      const response = await fetch(`/api/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update book status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  // 4. SEARCH (Helper function)
  const searchBooks = async (query: string) => {
    const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search books');
    return response.json();
  };

  return {
    books,
    loading,
    error,
    addBook: addBook.mutateAsync,
    updateBookStatus: updateBookStatus.mutateAsync,
    searchBooks,
    refresh: refetch,
  };
}