'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { showToast } from '@/lib/utils';

interface BookApprovalProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl?: string | null;
    description?: string | null;
    pageCount?: number | null;
    user: {
      name: string;
      email: string;
    };
  };
  onApprove?: () => void;
  onReject?: () => void;
}

export function BookApproval({ book, onApprove, onReject }: BookApprovalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
    setIsProcessing(true);
    const actionText = status === 'APPROVED' ? 'Approving' : 'Rejecting';
    const toastId = showToast.loading(`${actionText} book...`);

    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      showToast.dismiss(toastId);

      if (response.ok) {
        if (status === 'APPROVED') {
          showToast.success('Book approved! ✅');
          onApprove?.();
        } else {
          showToast.success('Book rejected');
          onReject?.();
        }
      } else {
        const error = await response.json();
        showToast.error(error.error || 'Failed to update book');
      }
    } catch (error) {
      console.error('Failed to update book:', error);
      showToast.dismiss(toastId);
      showToast.error('Failed to update book');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      {book.coverUrl && (
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
        <CardDescription>by {book.author}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {book.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-3">
            {book.description}
          </p>
        )}
        
        {book.pageCount && (
          <p className="text-sm text-gray-500 mb-4">
            {book.pageCount} pages
          </p>
        )}
        
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Requested by:</span> {book.user.name}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-3">
        <Button
          onClick={() => handleAction('APPROVED')}
          className="flex-1"
          variant="default"
          disabled={isProcessing}
        >
          <Check className="w-4 h-4 mr-2" />
          Approve
        </Button>
        <Button
          onClick={() => handleAction('REJECTED')}
          className="flex-1"
          variant="destructive"
          disabled={isProcessing}
        >
          <X className="w-4 h-4 mr-2" />
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
}