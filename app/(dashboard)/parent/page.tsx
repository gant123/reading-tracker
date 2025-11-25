import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Users, BookOpen, Gift, TrendingUp, Award, Clock, Star } from 'lucide-react';
import Link from 'next/link';

export default async function ParentDashboard() {
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
        take: 5,
        include: {
          book: true,
        },
      },
      achievements: {
        include: { achievement: true },
      },
    },
  });

  const pendingBooks = await prisma.book.count({
    where: {
      userId: { in: children.map(c => c.id) },
      status: 'PENDING',
    },
  });

  const totalRewards = await prisma.reward.count({
    where: { parentId: session.user.id },
  });

  const pendingRedemptions = await prisma.userReward.count({
    where: {
      userId: { in: children.map(c => c.id) },
      status: 'REDEEMED',
    },
  });

  // Calculate total family stats
  const familyStats = {
    totalPoints: children.reduce((sum, child) => sum + child.points, 0),
    totalMinutes: children.reduce((sum, child) => sum + child.totalMinutes, 0),
    totalBooks: children.reduce((sum, child) => sum + child.books.length, 0),
    averageStreak: children.length > 0 
      ? Math.round(children.reduce((sum, child) => sum + child.streakDays, 0) / children.length)
      : 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name}! 👋
          </h1>
          <p className="text-lg text-gray-600">Manage your children's reading journey</p>
        </div>

        {/* Family Stats Overview */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-8 mb-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-8 h-8" />
            Family Reading Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold">{familyStats.totalPoints}</div>
              <div className="text-purple-100">Total Points</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{familyStats.totalMinutes}</div>
              <div className="text-purple-100">Total Minutes</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{familyStats.totalBooks}</div>
              <div className="text-purple-100">Total Books</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{familyStats.averageStreak}</div>
              <div className="text-purple-100">Avg Streak Days</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Children</span>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{children.length}</div>
            <p className="text-sm text-gray-500 mt-1">Registered accounts</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Pending Books</span>
              <BookOpen className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{pendingBooks}</div>
            <p className="text-sm text-gray-500 mt-1">Need approval</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Active Rewards</span>
              <Gift className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{totalRewards}</div>
            <p className="text-sm text-gray-500 mt-1">Available to redeem</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">To Complete</span>
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{pendingRedemptions}</div>
            <p className="text-sm text-gray-500 mt-1">Redeemed rewards</p>
          </div>
        </div>

        {/* Action Items Alert */}
        {(pendingBooks > 0 || pendingRedemptions > 0) && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-amber-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">Action Required</h3>
                <p className="text-amber-700">
                  {pendingBooks > 0 && `${pendingBooks} book${pendingBooks > 1 ? 's' : ''} awaiting approval`}
                  {pendingBooks > 0 && pendingRedemptions > 0 && ' • '}
                  {pendingRedemptions > 0 && `${pendingRedemptions} reward${pendingRedemptions > 1 ? 's' : ''} to complete`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/parent/books"
            className="group bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl p-8 hover:shadow-xl transition-all hover:scale-105 transform"
          >
            <BookOpen className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-2">Review Books</h3>
            <p className="text-orange-100">Approve or reject pending book requests</p>
            {pendingBooks > 0 && (
              <div className="mt-3 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="font-semibold">{pendingBooks} pending</span>
              </div>
            )}
          </Link>

          <Link
            href="/parent/rewards"
            className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-8 hover:shadow-xl transition-all hover:scale-105 transform"
          >
            <Gift className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-2">Manage Rewards</h3>
            <p className="text-green-100">Create and track reward redemptions</p>
            {pendingRedemptions > 0 && (
              <div className="mt-3 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="font-semibold">{pendingRedemptions} to complete</span>
              </div>
            )}
          </Link>

          <Link
            href="/parent/children"
            className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-8 hover:shadow-xl transition-all hover:scale-105 transform"
          >
            <Users className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-2">View Children</h3>
            <p className="text-blue-100">Track detailed progress and statistics</p>
          </Link>
        </div>

        {/* Children Overview */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-600" />
            Your Children
          </h2>
          {children.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => (
                <div key={child.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      {child.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{child.name}</h3>
                      <p className="text-sm text-gray-600">{child.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500" />
                        Points:
                      </span>
                      <span className="font-semibold text-lg">{child.points}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-600" />
                        Minutes:
                      </span>
                      <span className="font-semibold text-lg">{child.totalMinutes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-1">
                        🔥 Streak:
                      </span>
                      <span className="font-semibold text-lg">{child.streakDays} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-green-600" />
                        Books:
                      </span>
                      <span className="font-semibold text-lg">{child.books.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Award className="w-4 h-4 text-purple-600" />
                        Achievements:
                      </span>
                      <span className="font-semibold text-lg">{child.achievements.length}</span>
                    </div>
                  </div>

                  <Link
                    href={`/parent/children#child-${child.id}`}
                    className="mt-4 block w-full bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Children Linked Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Have your children register with your email address to link their accounts
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-900 font-medium mb-1">📧 Your Email:</p>
                <p className="text-sm text-blue-700">{session.user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
   
  );
}