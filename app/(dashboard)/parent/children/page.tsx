import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Users, BookOpen, Clock, Flame, Trophy, Star, TrendingUp, Award } from 'lucide-react';

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
        include: { book: true },
      },
      achievements: {
        include: { achievement: true },
        orderBy: { earnedAt: 'desc' },
      },
    },
  });

  const getAvatarUrl = (child: any) => {
    const seed = child.avatarSeed || child.name;
    const style = child.avatarStyle || 'adventurer';
    const bgColor = (child.avatarColor || '60a5fa').replace('#', '');
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=128&backgroundColor=${bgColor}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-500" />
          Children Progress
        </h1>
        <p className="text-gray-600 mt-1">
          Track reading statistics and achievements for each child
        </p>
      </div>

      {/* Children List */}
      {children.length > 0 ? (
        <div className="space-y-6">
          {children.map((child) => (
            <div key={child.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Child Header */}
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={getAvatarUrl(child)}
                    alt={child.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-white/30 shadow-lg"
                  />
                  <div className="text-white min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold truncate">{child.name}</h2>
                    <p className="text-white/80 text-sm truncate">{child.email}</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-gradient-to-b from-gray-50 to-white">
                {[
                  { icon: Star, label: 'Points', value: child.points.toLocaleString(), color: 'amber' },
                  { icon: Clock, label: 'Minutes', value: child.totalMinutes.toLocaleString(), color: 'blue' },
                  { icon: Flame, label: 'Streak', value: `${child.streakDays} days`, color: 'orange' },
                  { icon: BookOpen, label: 'Books', value: child.books.length, color: 'emerald' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-white rounded-xl border border-gray-100">
                    <stat.icon className={`w-5 h-5 text-${stat.color}-500 mx-auto mb-1`} />
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Content Grid */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Sessions */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Recent Sessions
                  </h3>
                  {child.sessions.length > 0 ? (
                    <div className="space-y-3">
                      {child.sessions.slice(0, 5).map((s: any) => (
                        <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{s.book.title}</p>
                            <p className="text-xs text-gray-500">
                              {s.durationMinutes} min • {s.pointsEarned} pts • {new Date(s.startTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No reading sessions yet</p>
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Achievements ({child.achievements.length})
                  </h3>
                  {child.achievements.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {child.achievements.slice(0, 6).map((ua: any) => (
                        <div
                          key={ua.id}
                          className="flex flex-col items-center p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200/50"
                          title={ua.achievement.description}
                        >
                          <span className="text-2xl mb-1">{ua.achievement.icon}</span>
                          <span className="text-[10px] font-semibold text-center text-gray-700 line-clamp-2">
                            {ua.achievement.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No achievements yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Books Section */}
              {child.books.length > 0 && (
                <div className="p-5 pt-0">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    Approved Books ({child.books.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {child.books.slice(0, 6).map((book: any) => (
                      <div key={book.id} className="bg-gray-50 rounded-xl p-2 hover:bg-gray-100 transition-colors">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-20 object-cover rounded-lg mb-2"
                          />
                        ) : (
                          <div className="w-full h-20 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <p className="text-xs font-medium text-gray-900 line-clamp-2">{book.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Children Linked</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Have your children register with your email address to link their accounts
          </p>
        </div>
      )}
    </div>
  );
}