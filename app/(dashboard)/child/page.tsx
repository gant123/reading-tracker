import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma} from '@/lib/prisma';
import { BookOpen, Trophy, Flame, Star, Clock, TrendingUp, Award, Sparkles } from 'lucide-react';
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

  // Generate avatar URL
  const avatarSeed = user.avatarSeed || user.name;
  const avatarStyle = user.avatarStyle || 'adventurer';
  const avatarColor = (user.avatarColor || '60a5fa').replace('#', '');
  const avatarUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(avatarSeed)}&size=128&backgroundColor=${avatarColor}`;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section with Avatar - Responsive */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
        <Link href="/child/avatar" className="relative group">
          <img
            src={avatarUrl}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-white shadow-lg group-hover:ring-purple-300 transition-all"
          />
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-1 sm:p-1.5 shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">{streakStatus}</p>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">Points</span>
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{user.points}</div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Total earned</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">Minutes</span>
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{user.totalMinutes}</div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Time reading</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">Streak</span>
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{user.streakDays}</div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Days in a row</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">Books</span>
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{user.books.length}</div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Approved books</p>
        </div>
      </div>

      {/* Quick Actions - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <Link
          href="/child/timer"
          className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all hover:scale-105 transform"
        >
          <Clock className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1">Start Reading</h3>
          <p className="text-blue-100 text-xs sm:text-sm hidden sm:block">Track your session</p>
        </Link>

        <Link
          href="/child/books"
          className="group bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all hover:scale-105 transform"
        >
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1">My Books</h3>
          <p className="text-green-100 text-xs sm:text-sm hidden sm:block">Your collection</p>
        </Link>

        <Link
          href="/child/rewards"
          className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all hover:scale-105 transform"
        >
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1">Rewards</h3>
          <p className="text-purple-100 text-xs sm:text-sm hidden sm:block">Redeem points</p>
        </Link>

        <Link
          href="/child/avatar"
          className="group relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all hover:scale-105 transform overflow-hidden"
        >
          <div className="absolute top-2 right-2 opacity-50">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
          </div>
          
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1">Avatar</h3>
          <p className="text-pink-100 text-xs sm:text-sm hidden sm:block">Customize!</p>
          <span className="absolute top-2 left-2 bg-white/20 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
            NEW
          </span>
        </Link>
      </div>

      {/* Progress Section */}
      {user.streakDays >= 3 && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white shadow-lg">
          <div className="flex items-center gap-3 sm:gap-4">
            <Award className="w-10 h-10 sm:w-16 sm:h-16 flex-shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-0.5 sm:mb-1">Streak Bonus Active! 🔥</h3>
              <p className="text-amber-100 text-sm sm:text-base">
                You're earning {user.streakDays >= 7 ? '50%' : '25%'} bonus points for your {user.streakDays}-day streak!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Recent Sessions */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Recent Reading</h2>
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          {user.sessions.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {user.sessions.map((session) => (
                <div key={session.id} className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-2 hover:bg-blue-50 rounded-r transition-colors">
                  <div className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg">{session.book.title}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">by {session.book.author}</div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="flex items-center gap-1 text-blue-600">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      {session.durationMinutes} min
                    </span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                      {session.pointsEarned} pts
                    </span>
                    <span className="text-gray-500 hidden sm:inline">
                      {new Date(session.startTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 mb-1 sm:mb-2 text-sm sm:text-base">No reading sessions yet</p>
              <p className="text-xs sm:text-sm text-gray-400">Start reading to see your progress here!</p>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Achievements</h2>
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          </div>
          {user.achievements.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {user.achievements.map((ua) => (
                <div
                  key={ua.id}
                  className="flex flex-col items-center p-2 sm:p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-200 hover:border-amber-400 transition-colors cursor-pointer"
                  title={ua.achievement.description}
                >
                  <span className="text-2xl sm:text-4xl lg:text-5xl mb-1 sm:mb-2">{ua.achievement.icon}</span>
                  <span className="text-[10px] sm:text-xs font-semibold text-center text-gray-700 line-clamp-2">
                    {ua.achievement.name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">
                    {new Date(ua.earnedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Award className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 mb-1 sm:mb-2 text-sm sm:text-base">No achievements unlocked yet</p>
              <p className="text-xs sm:text-sm text-gray-400">Keep reading to earn your first badge!</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section - Hidden on very small screens to reduce clutter */}
      <div className="mt-6 sm:mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6 hidden sm:block">
        <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-blue-900 flex items-center gap-2">
          <Star className="w-4 h-4 sm:w-5 sm:h-5" />
          Reading Tips
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-blue-800 text-sm">
          <div>
            <p className="font-semibold mb-0.5 sm:mb-1">📖 Build a Habit</p>
            <p className="text-xs sm:text-sm">Try to read at the same time every day!</p>
          </div>
          <div>
            <p className="font-semibold mb-0.5 sm:mb-1">🔥 Maintain Streaks</p>
            <p className="text-xs sm:text-sm">Read 3+ days in a row for bonus points!</p>
          </div>
          <div>
            <p className="font-semibold mb-0.5 sm:mb-1">⏰ Use the Timer</p>
            <p className="text-xs sm:text-sm">Track every reading session to earn points!</p>
          </div>
          <div>
            <p className="font-semibold mb-0.5 sm:mb-1">✨ Customize Your Avatar</p>
            <p className="text-xs sm:text-sm">Visit the Avatar Shop to unlock cool styles!</p>
          </div>
        </div>
      </div>
    </div>
  );
}