import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl?: string | null;
    pageCount?: number | null;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  };
  showActions?: boolean;
  onSelect?: () => void;
}

export function BookCard({ book, showActions, onSelect }: BookCardProps) {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-gray-400" />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[book.status]}`}>
            {book.status}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        {book.pageCount && (
          <p className="text-gray-500 text-xs">{book.pageCount} pages</p>
        )}
      </CardContent>
      
      {showActions && onSelect && (
        <CardFooter>
          <button
            onClick={onSelect}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Select Book
          </button>
        </CardFooter>
      )}
    </Card>
  );
}