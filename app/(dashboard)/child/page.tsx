import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BookOpen, Trophy, Flame, Star, Clock, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';

export default async function ChildDashboard() {
  const session = await auth();

  if (!session || session.user.role !== 'CHILD') {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      books: {
        where: { status: 'APPROVED' },
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
      sessions: {
        take: 5,
        orderBy: { startTime: 'desc' },
        include: { book: true },
      },
      achievements: {
        include: { achievement: true },
        orderBy: { earnedAt: 'desc' },
        take: 6,
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  // Calculate streak status
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastReadDate = user.lastReadDate ? new Date(user.lastReadDate) : null;
  let streakStatus = 'No streak yet';
  
  if (lastReadDate) {
    lastReadDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - lastReadDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      streakStatus = '🔥 On fire! Read today!';
    } else if (diffDays === 1) {
      streakStatus = '⚠️ Read today to keep your streak!';
    } else {
      streakStatus = '💔 Streak broken. Start a new one!';
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-lg text-gray-600">{streakStatus}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Points</span>
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{user.points}</div>
            <p className="text-sm text-gray-500 mt-1">Total earned</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Minutes</span>
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{user.totalMinutes}</div>
            <p className="text-sm text-gray-500 mt-1">Time reading</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Streak</span>
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{user.streakDays}</div>
            <p className="text-sm text-gray-500 mt-1">Days in a row</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Books</span>
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{user.books.length}</div>
            <p className="text-sm text-gray-500 mt-1">Approved books</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/child/timer"
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-8 hover:shadow-xl transition-all hover:scale-105 transform"
          >
            <Clock className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-2">Start Reading</h3>
            <p className="text-blue-100">Track your reading session with the timer</p>
          </Link>

          <Link
            href="/child/books"
            className="group bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-8 hover:shadow-xl transition-all hover:scale-105 transform"
          >
            <BookOpen className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-2">My Books</h3>
            <p className="text-green-100">Search and manage your book collection</p>
          </Link>

          <Link
            href="/child/rewards"
            className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-8 hover:shadow-xl transition-all hover:scale-105 transform"
          >
            <Trophy className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-2">Reward Shop</h3>
            <p className="text-purple-100">Redeem your points for awesome rewards</p>
          </Link>
        </div>

        {/* Progress Section */}
        {user.streakDays >= 3 && (
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-6 mb-8 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <Award className="w-16 h-16" />
              <div>
                <h3 className="text-2xl font-bold mb-1">Streak Bonus Active! 🔥</h3>
                <p className="text-amber-100">
                  You're earning {user.streakDays >= 7 ? '50%' : '25%'} bonus points for your {user.streakDays}-day streak!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sessions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Recent Reading</h2>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            {user.sessions.length > 0 ? (
              <div className="space-y-4">
                {user.sessions.map((session) => (
                  <div key={session.id} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-blue-50 rounded-r transition-colors">
                    <div className="font-semibold text-gray-900 text-lg">{session.book.title}</div>
                    <div className="text-sm text-gray-600 mb-1">by {session.book.author}</div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-blue-600">
                        <Clock className="w-4 h-4" />
                        {session.durationMinutes} min
                      </span>
                      <span className="flex items-center gap-1 text-amber-600">
                        <Star className="w-4 h-4" />
                        {session.pointsEarned} pts
                      </span>
                      <span className="text-gray-500">
                        {new Date(session.startTime).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No reading sessions yet</p>
                <p className="text-sm text-gray-400">Start reading to see your progress here!</p>
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Achievements</h2>
              <Award className="w-6 h-6 text-amber-500" />
            </div>
            {user.achievements.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {user.achievements.map((ua) => (
                  <div
                    key={ua.id}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-200 hover:border-amber-400 transition-colors cursor-pointer"
                    title={ua.achievement.description}
                  >
                    <span className="text-5xl mb-2">{ua.achievement.icon}</span>
                    <span className="text-xs font-semibold text-center text-gray-700">
                      {ua.achievement.name}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(ua.earnedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No achievements unlocked yet</p>
                <p className="text-sm text-gray-400">Keep reading to earn your first badge!</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-3 text-blue-900 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Reading Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <p className="font-semibold mb-1">📖 Build a Habit</p>
              <p className="text-sm">Try to read at the same time every day!</p>
            </div>
            <div>
              <p className="font-semibold mb-1">🔥 Maintain Streaks</p>
              <p className="text-sm">Read 3+ days in a row for bonus points!</p>
            </div>
            <div>
              <p className="font-semibold mb-1">⏰ Use the Timer</p>
              <p className="text-sm">Track every reading session to earn points!</p>
            </div>
            <div>
              <p className="font-semibold mb-1">🎯 Set Goals</p>
              <p className="text-sm">Try to read at least 20 minutes per day!</p>
            </div>
          </div>
        </div>
      </div>
   
  );
}