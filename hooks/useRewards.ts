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
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export function useRewards() {
  const queryClient = useQueryClient();

  // 1. FETCH REWARDS (with polling)
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
    refetchInterval: 3000, // Poll every 3s
  });

  // 2. FETCH REDEEMED REWARDS (with polling) - for children
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
    refetchInterval: 3000,
  });

  // 3. FETCH PENDING COMPLETIONS (with polling) - for parents
  const { 
    data: pendingCompletions = [], 
    isLoading: loadingPending 
  } = useQuery({
    queryKey: ['pending-completions'],
    queryFn: async () => {
      const res = await fetch('/api/rewards/pending');
      if (!res.ok) {
        // If not a parent or endpoint doesn't exist, return empty array
        return [];
      }
      return res.json() as Promise<UserReward[]>;
    },
    refetchInterval: 3000,
    retry: false, // Don't retry if it fails (child users will get 401)
  });

  // 4. CREATE REWARD
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

  // 5. REDEEM REWARD
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
      queryClient.invalidateQueries({ queryKey: ['user-points'] });
      queryClient.invalidateQueries({ queryKey: ['avatar-display'] });
    },
  });

  // 6. DELETE REWARD
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

  // 7. COMPLETE REWARD
  const completeReward = useMutation({
    mutationFn: async (userRewardId: string) => {
      const res = await fetch(`/api/rewards/${userRewardId}/complete`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to complete reward');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redeemed-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['pending-completions'] });
    },
  });

  // Helpers - Use pendingCompletions for parent view (has user info)
  // Use redeemedRewards for child view
  const getPendingRedemptions = () => {
    // For parents - use the dedicated endpoint that includes user info
    if (pendingCompletions.length > 0) {
      return pendingCompletions;
    }
    // Fallback to filtering redeemed rewards
    return redeemedRewards.filter((ur) => ur.status === 'REDEEMED');
  };

  const getCompletedRedemptions = () => {
    return redeemedRewards.filter((ur) => ur.status === 'COMPLETED');
  };

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['rewards'] });
    queryClient.invalidateQueries({ queryKey: ['redeemed-rewards'] });
    queryClient.invalidateQueries({ queryKey: ['pending-completions'] });
  };

  return {
    rewards,
    redeemedRewards,
    pendingCompletions,
    loading: loadingRewards || loadingRedeemed || loadingPending,
    error: rewardsError ? (rewardsError as Error).message : null,
    createReward: createReward.mutateAsync,
    redeemReward: redeemReward.mutateAsync,
    deleteReward: deleteReward.mutateAsync,
    completeReward: completeReward.mutateAsync,
    getPendingRedemptions,
    getCompletedRedemptions,
    refresh,
  };
}