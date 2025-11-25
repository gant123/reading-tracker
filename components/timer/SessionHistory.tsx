import { Clock, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Session {
  id: string;
  startTime: Date;
  durationMinutes: number;
  pointsEarned: number;
  book: {
    title: string;
    author: string;
  };
  notes?: string | null;
}

interface SessionHistoryProps {
  sessions: Session[];
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No reading sessions yet. Start reading to see your history!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reading Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900">{session.book.title}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(session.startTime).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{session.book.author}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{session.durationMinutes} min</span>
                </div>
                <div className="flex items-center gap-1 text-amber-600">
                  <span>⭐</span>
                  <span>{session.pointsEarned} points</span>
                </div>
              </div>
              {session.notes && (
                <p className="text-sm text-gray-600 mt-2 italic">"{session.notes}"</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}