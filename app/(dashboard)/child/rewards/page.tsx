'use client';

import { useQuery } from '@tanstack/react-query'; // Import useQuery for points
import { Gift, Star, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRewards } from '@/hooks/useRewards'; // Use the new hook

export default function ChildRewardsPage() {
  // 1. Use the hook for real-time rewards
  const { rewards, loading: loadingRewards, redeemReward } = useRewards();

  // 2. Use React Query for points so they update automatically when a reward is redeemed
  const { data: pointData, isLoading: loadingPoints } = useQuery({
    queryKey: ['user-points'],
    queryFn: async () => {
      const res = await fetch('/api/avatar/points');
      if (!res.ok) return { points: 0 };
      return res.json();
    },
    refetchInterval: 5000, // Sync points occasionally
  });

  const userPoints = pointData?.points || 0;
  const loading = loadingRewards || loadingPoints;

  const handleRedeem = async (rewardId: string) => {
    if (!confirm('Are you sure you want to redeem this reward?')) return;

    try {
      await redeemReward(rewardId);
      alert('Reward redeemed! Your parent will complete it for you.');
      // No need to fetch manually; the hook invalidates the cache and updates UI instantly
    } catch (error: any) {
      console.error('Failed to redeem reward:', error);
      alert(error.message || 'Failed to redeem reward');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Gift className="w-8 h-8 text-purple-600" />
              <span className="font-bold text-xl">Reward Shop</span>
            </div>
            <Link href="/child" className="text-gray-600 hover:text-gray-900">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Points Display */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Points</h2>
              <p className="text-amber-100">Keep reading to earn more!</p>
            </div>
            <div className="text-6xl font-bold flex items-center gap-2">
              <Star className="w-12 h-12" />
              {userPoints}
            </div>
          </div>
        </div>

        {/* Available Rewards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Available Rewards</h2>
          
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading rewards...</div>
          ) : rewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const canAfford = userPoints >= reward.pointsCost; // Recalculate based on real-time points
                
                return (
                  <div
                    key={reward.id}
                    className={`bg-white rounded-xl shadow-md overflow-hidden ${
                      !canAfford ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="p-6">
                      <div className="text-5xl mb-4 text-center">{reward.icon}</div>
                      
                      <h3 className="font-bold text-xl mb-2 text-center">{reward.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 text-center">
                        {reward.description}
                      </p>

                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Star className="w-5 h-5 text-amber-500" />
                        <span className="text-2xl font-bold text-gray-900">
                          {reward.pointsCost}
                        </span>
                        <span className="text-gray-600">points</span>
                      </div>

                      {canAfford ? (
                        <button
                          onClick={() => handleRedeem(reward.id)}
                          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                        >
                          Redeem Reward
                        </button>
                      ) : (
                        <div className="w-full bg-gray-200 text-gray-600 py-3 rounded-lg text-center font-semibold flex items-center justify-center gap-2">
                          <Lock className="w-4 h-4" />
                          Need {reward.pointsCost - userPoints} more points
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Rewards Available
              </h3>
              <p className="text-gray-600">
                Ask your parent to create some rewards for you!
              </p>
            </div>
          )}
        </div>

        {/* How to Earn Points */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-3 text-blue-900">
            How to Earn More Points 🎯
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Read for 1 minute = 1 point</li>
            <li>• Read 3 days in a row = 25% bonus points!</li>
            <li>• Read 7 days in a row = 50% bonus points!</li>
            <li>• Unlock achievements for extra recognition</li>
          </ul>
        </div>
      </main>
    </div>
  );
}