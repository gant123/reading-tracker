import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { User, BookOpen, Clock, Flame, Trophy } from 'lucide-react';
import Link from 'next/link';

export default async function ParentChildrenPage() {
  const session = await auth();

  if (!session || session.user.role !== 'PARENT') {
    redirect('/login');
  }

  const children = await prisma.user.findMany({
    where: { parentId: session.user.id },
    include: {
      books: {
        where: { status: 'APPROVED' },
      },
      sessions: {
        orderBy: { startTime: 'desc' },
        take: 10,
        include: {
          book: true,
        },
      },
      achievements: {
        include: {
          achievement: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/parent" className="text-gray-600 hover:text-gray-900">
                ← Back
              </Link>
              <User className="w-8 h-8 text-indigo-600" />
              <span className="font-bold text-xl">Children Progress</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Children's Progress
          </h1>
          <p className="text-gray-600">
            Track reading statistics and achievements for each child
          </p>
        </div>

        {children.length > 0 ? (
          <div className="space-y-8">
            {children.map((child:any) => (
              <div key={child.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Child Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-indigo-600">
                      {child.name[0].toUpperCase()}
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold">{child.name}</h2>
                      <p className="text-indigo-100">{child.email}</p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <span className="text-2xl font-bold text-gray-900">{child.points}</span>
                    </div>
                    <p className="text-sm text-gray-600">Points</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="text-2xl font-bold text-gray-900">{child.totalMinutes}</span>
                    </div>
                    <p className="text-sm text-gray-600">Minutes</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-2xl font-bold text-gray-900">{child.streakDays}</span>
                    </div>
                    <p className="text-sm text-gray-600">Day Streak</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      <span className="text-2xl font-bold text-gray-900">{child.books.length}</span>
                    </div>
                    <p className="text-sm text-gray-600">Books</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Sessions */}
                    <div>
                      <h3 className="text-lg font-bold mb-4">Recent Reading Sessions</h3>
                      {child.sessions.length > 0 ? (
                        <div className="space-y-3">
                          {child.sessions.slice(0, 5).map((session:any) => (
                            <div key={session.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                              <p className="font-semibold text-gray-900">{session.book.title}</p>
                              <p className="text-sm text-gray-600">
                                {session.durationMinutes} min • {session.pointsEarned} points
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(session.startTime).toLocaleDateString()} at{' '}
                                {new Date(session.startTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No reading sessions yet</p>
                      )}
                    </div>

                    {/* Achievements */}
                    <div>
                      <h3 className="text-lg font-bold mb-4">
                        Achievements ({child.achievements.length})
                      </h3>
                      {child.achievements.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                          {child.achievements.map((ua:any) => (
                            <div
                              key={ua.id}
                              className="flex flex-col items-center p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-200"
                            >
                              <span className="text-3xl mb-1">{ua.achievement.icon}</span>
                              <span className="text-xs font-semibold text-center text-gray-700">
                                {ua.achievement.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No achievements unlocked yet</p>
                      )}
                    </div>
                  </div>

                  {/* Books */}
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-4">Current Books</h3>
                    {child.books.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {child.books.map((book:any) => (
                          <div key={book.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                            {book.coverUrl && (
                              <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="w-full h-24 object-cover rounded mb-2"
                              />
                            )}
                            <p className="text-xs font-semibold line-clamp-2">{book.title}</p>
                            <p className="text-xs text-gray-600 line-clamp-1">{book.author}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No books added yet</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Children Linked
            </h3>
            <p className="text-gray-600">
              Have your children register with your email address to link their accounts
            </p>
          </div>
        )}
      </main>
    </div>
  );
}