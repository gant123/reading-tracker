'use client';

import { useState, useEffect } from 'react';
import { RewardCard } from './RewardCard';
import { showToast } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  icon: string;
}

export function RewardShop() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await fetch('/api/rewards');
      const data = await response.json();
      setRewards(data);
      // User points would typically come from user data
      // This is a placeholder
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
      showToast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;

    setIsRedeeming(true);
    const toastId = showToast.loading('Redeeming reward...');

    try {
      const response = await fetch(`/api/rewards/${selectedReward.id}/redeem`, {
        method: 'POST',
      });

      if (response.ok) {
        showToast.dismiss(toastId);
        showToast.success('Reward redeemed successfully! 🎉');
        setSelectedReward(null);
        fetchRewards();
      } else {
        const error = await response.json();
        showToast.dismiss(toastId);
        showToast.error(error.error || 'Failed to redeem reward');
      }
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      showToast.dismiss(toastId);
      showToast.error('Failed to redeem reward');
    } finally {
      setIsRedeeming(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading rewards...</div>;
  }

  if (rewards.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No rewards available yet.</p>
        <p className="text-sm mt-2">Ask your parent to create some rewards!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            userPoints={userPoints}
            onRedeem={() => handleRedeemClick(reward)}
          />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedReward} onOpenChange={() => setSelectedReward(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-4xl">{selectedReward?.icon}</span>
              Redeem {selectedReward?.title}?
            </DialogTitle>
            <DialogDescription>
              This will cost you <span className="font-bold text-amber-600">{selectedReward?.pointsCost} points</span>.
              You can't undo this action, but your parent will need to mark it as completed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedReward(null)}
              disabled={isRedeeming}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRedeem}
              disabled={isRedeeming}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isRedeeming ? 'Redeeming...' : 'Confirm Redeem'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}