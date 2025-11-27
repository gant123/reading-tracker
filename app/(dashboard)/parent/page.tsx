import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Users, BookOpen, Gift, TrendingUp, Award, Clock, Star, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
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
        include: { book: true },
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

  const totalActionItems = pendingBooks + pendingRedemptions;

  const getAvatarUrl = (child: any) => {
    const seed = child.avatarSeed || child.name;
    const style = child.avatarStyle || 'adventurer';
    const bgColor = (child.avatarColor || '60a5fa').replace('#', '');
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=128&backgroundColor=${bgColor}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your family's reading journey
        </p>
      </div>

      {/* Action Required Banner */}
      {totalActionItems > 0 && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-amber-500/25">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg">Action Required</p>
              <p className="text-amber-100 text-sm">
                {pendingBooks > 0 && `${pendingBooks} book${pendingBooks > 1 ? 's' : ''} awaiting approval`}
                {pendingBooks > 0 && pendingRedemptions > 0 && ' • '}
                {pendingRedemptions > 0 && `${pendingRedemptions} reward${pendingRedemptions > 1 ? 's' : ''} to complete`}
              </p>
            </div>
            <Link
              href={pendingBooks > 0 ? '/parent/books' : '/parent/rewards'}
              className="flex-shrink-0 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Review
            </Link>
          </div>
        </div>
      )}

      {/* Family Stats */}
      <div className="bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        
        <div className="relative">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Family Reading Stats
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Points', value: familyStats.totalPoints.toLocaleString() },
              { label: 'Total Minutes', value: familyStats.totalMinutes.toLocaleString() },
              { label: 'Books Read', value: familyStats.totalBooks },
              { label: 'Avg Streak', value: `${familyStats.averageStreak} days` },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <p className="text-purple-200 text-xs sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Children', value: children.length, icon: Users, color: 'blue' },
          { label: 'Pending Books', value: pendingBooks, icon: BookOpen, color: 'amber', urgent: pendingBooks > 0 },
          { label: 'Rewards', value: totalRewards, icon: Gift, color: 'emerald' },
          { label: 'To Complete', value: pendingRedemptions, icon: TrendingUp, color: 'purple', urgent: pendingRedemptions > 0 },
        ].map((stat) => (
          <div key={stat.label} className={`relative bg-white rounded-2xl p-4 sm:p-5 shadow-sm border ${
            stat.urgent ? 'border-amber-200 bg-amber-50/50' : 'border-gray-100'
          } hover:shadow-md transition-all`}>
            {stat.urgent && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-medium text-xs sm:text-sm">{stat.label}</span>
              <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/parent/books"
          className="group relative bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all hover:-translate-y-1"
        >
          <BookOpen className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-lg sm:text-xl">Review Books</h3>
          <p className="text-amber-100 text-sm mt-1">Approve or reject requests</p>
          {pendingBooks > 0 && (
            <span className="absolute top-4 right-4 bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">
              {pendingBooks}
            </span>
          )}
          <ChevronRight className="absolute bottom-5 right-5 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/parent/rewards"
          className="group relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:-translate-y-1"
        >
          <Gift className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-lg sm:text-xl">Manage Rewards</h3>
          <p className="text-emerald-100 text-sm mt-1">Create & complete rewards</p>
          {pendingRedemptions > 0 && (
            <span className="absolute top-4 right-4 bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">
              {pendingRedemptions}
            </span>
          )}
          <ChevronRight className="absolute bottom-5 right-5 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/parent/children"
          className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-1"
        >
          <Users className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-lg sm:text-xl">View Children</h3>
          <p className="text-blue-100 text-sm mt-1">Track detailed progress</p>
          <ChevronRight className="absolute bottom-5 right-5 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Children Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-lg sm:text-xl text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Your Children
          </h2>
          {children.length > 0 && (
            <Link href="/parent/children" className="text-purple-600 text-sm font-medium hover:underline">
              View all
            </Link>
          )}
        </div>
        <div className="p-4 sm:p-5">
          {children.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child) => (
                <div key={child.id} className="group bg-gray-50 rounded-xl p-4 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 hover:shadow-md border border-gray-100 hover:border-purple-200 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={getAvatarUrl(child)}
                      alt={child.name}
                      className="w-12 h-12 rounded-full ring-2 ring-white shadow"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 truncate">{child.name}</p>
                      <p className="text-xs text-gray-500 truncate">{child.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold">{child.points}</span>
                      <span className="text-gray-500 text-xs">pts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold">{child.totalMinutes}</span>
                      <span className="text-gray-500 text-xs">min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500">🔥</span>
                      <span className="font-semibold">{child.streakDays}</span>
                      <span className="text-gray-500 text-xs">days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold">{child.books.length}</span>
                      <span className="text-gray-500 text-xs">books</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Children Linked Yet</h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Have your children create accounts using your email as the parent email to link their accounts.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-sm mx-auto">
                <p className="text-sm text-blue-900 font-medium mb-1">📧 Your Email:</p>
                <p className="text-sm text-blue-700 font-mono break-all">{session.user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-purple-100/50">
        <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-purple-500" />
          Parent Tips
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { emoji: '📚', text: 'Review book requests regularly to keep kids engaged' },
            { emoji: '🎁', text: 'Create meaningful rewards to motivate reading' },
            { emoji: '🔥', text: 'Encourage daily reading to build streaks' },
            { emoji: '🏆', text: 'Celebrate achievements together!' },
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/60 rounded-xl p-3">
              <span className="text-lg">{tip.emoji}</span>
              <p className="text-purple-800">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}