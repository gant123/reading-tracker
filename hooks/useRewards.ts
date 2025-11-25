'use client';

import { useState, useEffect } from 'react';

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
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<UserReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rewards');

      if (!response.ok) {
        throw new Error('Failed to fetch rewards');
      }

      const data = await response.json();
      setRewards(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rewards');
      console.error('Error fetching rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRedeemedRewards = async () => {
    try {
      const response = await fetch('/api/rewards/redeemed');

      if (response.ok) {
        const data = await response.json();
        setRedeemedRewards(data);
      }
    } catch (err: any) {
      console.error('Error fetching redeemed rewards:', err);
    }
  };

  useEffect(() => {
    fetchRewards();
    fetchRedeemedRewards();
  }, []);

  const createReward = async (rewardData: {
    title: string;
    description: string;
    pointsCost: number;
    icon: string;
  }) => {
    try {
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rewardData),
      });

      if (!response.ok) {
        throw new Error('Failed to create reward');
      }

      const newReward = await response.json();
      setRewards((prev) => [newReward, ...prev]);
      return newReward;
    } catch (err: any) {
      setError(err.message || 'Failed to create reward');
      throw err;
    }
  };

  const redeemReward = async (rewardId: string) => {
    try {
      const response = await fetch(`/api/rewards/${rewardId}/redeem`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to redeem reward');
      }

      const userReward = await response.json();
      setRedeemedRewards((prev) => [userReward, ...prev]);
      
      // Refresh rewards to update canAfford status
      await fetchRewards();
      
      return userReward;
    } catch (err: any) {
      setError(err.message || 'Failed to redeem reward');
      throw err;
    }
  };

  const deleteReward = async (rewardId: string) => {
    try {
      const response = await fetch(`/api/rewards/${rewardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete reward');
      }

      setRewards((prev) => prev.filter((reward) => reward.id !== rewardId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete reward');
      throw err;
    }
  };

  const completeReward = async (userRewardId: string) => {
    try {
      const response = await fetch(`/api/rewards/${userRewardId}/complete`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to complete reward');
      }

      setRedeemedRewards((prev) =>
        prev.map((ur) =>
          ur.id === userRewardId
            ? { ...ur, status: 'COMPLETED' as const, completedAt: new Date() }
            : ur
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to complete reward');
      throw err;
    }
  };

  const getAvailableRewards = () => {
    return rewards.filter((reward) => reward.canAfford !== false);
  };

  const getUnavailableRewards = () => {
    return rewards.filter((reward) => reward.canAfford === false);
  };

  const getPendingRedemptions = () => {
    return redeemedRewards.filter((ur) => ur.status === 'REDEEMED');
  };

  const getCompletedRedemptions = () => {
    return redeemedRewards.filter((ur) => ur.status === 'COMPLETED');
  };

  const refresh = () => {
    fetchRewards();
    fetchRedeemedRewards();
  };

  return {
    rewards,
    redeemedRewards,
    loading,
    error,
    createReward,
    redeemReward,
    deleteReward,
    completeReward,
    getAvailableRewards,
    getUnavailableRewards,
    getPendingRedemptions,
    getCompletedRedemptions,
    refresh,
  };
}