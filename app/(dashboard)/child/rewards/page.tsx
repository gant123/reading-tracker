'use client';

import { useQuery } from '@tanstack/react-query';
import { Gift, Star, Lock, Clock, CheckCircle2, Sparkles, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRewards } from '@/hooks/useRewards';
import { useState } from 'react';

export default function ChildRewardsPage() {
  const { rewards, redeemedRewards, loading: loadingRewards, redeemReward } = useRewards();
  const [redeeming, setRedeeming] = useState<string | null>(null);

  // Fetch user points
  const { data: pointData, isLoading: loadingPoints } = useQuery({
    queryKey: ['user-points'],
    queryFn: async () => {
      const res = await fetch('/api/avatar/points');
      if (!res.ok) return { points: 0 };
      return res.json();
    },
    refetchInterval: 5000,
  });

  const userPoints = pointData?.points || 0;
  const loading = loadingRewards || loadingPoints;

  // Separate redeemed rewards by status
  const pendingRewards = redeemedRewards.filter((ur: any) => ur.status === 'REDEEMED');
  const completedRewards = redeemedRewards.filter((ur: any) => ur.status === 'COMPLETED');

  const handleRedeem = async (rewardId: string, rewardTitle: string, pointsCost: number) => {
    if (!confirm(`Redeem "${rewardTitle}" for ${pointsCost} points?\n\nYour parent will need to approve and complete this reward.`)) return;

    setRedeeming(rewardId);
    try {
      await redeemReward(rewardId);
      // Success - the hook will refresh the data
    } catch (error: any) {
      console.error('Failed to redeem reward:', error);
      alert(error.message || 'Failed to redeem reward');
    } finally {
      setRedeeming(null);
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Gift className="w-8 h-8 text-purple-600" />
          Reward Shop
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Spend your hard-earned points on awesome rewards!
        </p>
      </div>

      {/* Points Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-amber-100 font-medium mb-1">Your Balance</p>
            <div className="flex items-center gap-3">
              <Star className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 fill-yellow-300" />
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black">{userPoints}</span>
              <span className="text-xl sm:text-2xl text-amber-100">points</span>
            </div>
          </div>
          <Link
            href="/child/timer"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Earn More Points
          </Link>
        </div>
      </div>

      {/* Pending Rewards - Waiting for Parent */}
      {pendingRewards.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-900">Waiting for Parent</h2>
              <p className="text-blue-700 text-sm">Your parent will complete these rewards soon!</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingRewards.map((ur: any) => (
              <div key={ur.id} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <span className="text-3xl">{ur.reward.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{ur.reward.title}</p>
                  <p className="text-xs text-blue-600">Redeemed {formatDate(ur.redeemedAt)}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Rewards */}
      {completedRewards.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-bold text-green-900">Completed Rewards</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {completedRewards.slice(0, 8).map((ur: any) => (
              <div key={ur.id} className="bg-white/80 rounded-lg p-3 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">{ur.reward.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{ur.reward.title}</p>
                  <p className="text-xs text-green-600">{formatDate(ur.completedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Rewards */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-purple-600" />
          Available Rewards
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading rewards...</p>
        </div>
      ) : rewards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {rewards.map((reward: any) => {
            const canAfford = userPoints >= reward.pointsCost;
            
            return (
              <div
                key={reward.id}
                className={`bg-white rounded-2xl shadow-md overflow-hidden border-2 transition-all hover:shadow-lg group ${
                  canAfford ? 'border-gray-100 hover:border-purple-200' : 'border-gray-100 opacity-75'
                }`}
              >
                <div className="p-5 sm:p-6">
                  <div className="text-center mb-4">
                    <span className="text-5xl sm:text-6xl inline-block group-hover:scale-110 transition-transform">
                      {reward.icon}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 text-center mb-2">
                    {reward.title}
                  </h3>
                  <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
                    {reward.description}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-amber-500" />
                    <span className="text-2xl sm:text-3xl font-black text-gray-900">
                      {reward.pointsCost}
                    </span>
                    <span className="text-gray-500">points</span>
                  </div>

                  {canAfford ? (
                    <button
                      onClick={() => handleRedeem(reward.id, reward.title, reward.pointsCost)}
                      disabled={redeeming === reward.id}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {redeeming === reward.id ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Redeeming...
                        </>
                      ) : (
                        <>
                          <Gift className="w-5 h-5" />
                          Redeem Reward
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-500 py-3 sm:py-4 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                      Need {reward.pointsCost - userPoints} more points
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 text-center border border-gray-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Rewards Available Yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Ask your parent to create some rewards for you! In the meantime, keep reading to earn more points.
          </p>
        </div>
      )}

      {/* How to Earn Points */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-blue-200">
        <h3 className="font-bold text-lg text-blue-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          How to Earn More Points
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-white/60 rounded-lg p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📖</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Read Every Minute</p>
              <p className="text-gray-600">1 point per minute of reading</p>
            </div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🔥</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">3-Day Streak</p>
              <p className="text-gray-600">25% bonus points!</p>
            </div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">⚡</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">7-Day Streak</p>
              <p className="text-gray-600">50% bonus points!</p>
            </div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🏆</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Achievements</p>
              <p className="text-gray-600">Unlock badges for milestones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}