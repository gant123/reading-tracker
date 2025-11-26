'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  icon: string;
  parentId: string;
  createdAt: Date;
  updatedAt: Date;
  canAfford?: boolean;
}

interface UserReward {
  id: string;
  status: 'AVAILABLE' | 'REDEEMED' | 'COMPLETED';
  userId: string;
  rewardId: string;
  redeemedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  reward: Reward;
}

export function useRewards() {
  const queryClient = useQueryClient();

  // 1. FETCH REWARDS (Polling)
  const { 
    data: rewards = [], 
    isLoading: loadingRewards, 
    error: rewardsError 
  } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const res = await fetch('/api/rewards');
      if (!res.ok) throw new Error('Failed to fetch rewards');
      return res.json() as Promise<Reward[]>;
    },
    refetchInterval: 2000, // Poll every 2s
  });

  // 2. FETCH REDEEMED (Polling)
  const { 
    data: redeemedRewards = [], 
    isLoading: loadingRedeemed 
  } = useQuery({
    queryKey: ['redeemed-rewards'],
    queryFn: async () => {
      const res = await fetch('/api/rewards/redeemed');
      if (!res.ok) throw new Error('Failed to fetch redeemed rewards');
      return res.json() as Promise<UserReward[]>;
    },
    refetchInterval: 2000, // Poll every 2s
  });

  // 3. CREATE REWARD
  const createReward = useMutation({
    mutationFn: async (rewardData: { title: string; description: string; pointsCost: number; icon: string }) => {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rewardData),
      });
      if (!res.ok) throw new Error('Failed to create reward');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });

  // 4. REDEEM REWARD
  const redeemReward = useMutation({
    mutationFn: async (rewardId: string) => {
      const res = await fetch(`/api/rewards/${rewardId}/redeem`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to redeem reward');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      queryClient.invalidateQueries({ queryKey: ['redeemed-rewards'] });
      // Also refresh points (avatar) if you have a hook for that
      queryClient.invalidateQueries({ queryKey: ['user-points'] }); 
    },
  });

  // 5. DELETE REWARD
  const deleteReward = useMutation({
    mutationFn: async (rewardId: string) => {
      const res = await fetch(`/api/rewards/${rewardId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete reward');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });

  // 6. COMPLETE REWARD
  const completeReward = useMutation({
    mutationFn: async (userRewardId: string) => {
      const res = await fetch(`/api/rewards/${userRewardId}/complete`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to complete reward');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redeemed-rewards'] });
    },
  });

  // Helpers
  const getAvailableRewards = () => rewards.filter((r) => r.canAfford !== false);
  const getUnavailableRewards = () => rewards.filter((r) => r.canAfford === false);
  const getPendingRedemptions = () => redeemedRewards.filter((ur) => ur.status === 'REDEEMED');
  const getCompletedRedemptions = () => redeemedRewards.filter((ur) => ur.status === 'COMPLETED');

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['rewards'] });
    queryClient.invalidateQueries({ queryKey: ['redeemed-rewards'] });
  };

  return {
    rewards,
    redeemedRewards,
    loading: loadingRewards || loadingRedeemed,
    error: rewardsError ? (rewardsError as Error).message : null,
    createReward: createReward.mutateAsync,
    redeemReward: redeemReward.mutateAsync,
    deleteReward: deleteReward.mutateAsync,
    completeReward: completeReward.mutateAsync,
    getAvailableRewards,
    getUnavailableRewards,
    getPendingRedemptions,
    getCompletedRedemptions,
    refresh,
  };
}