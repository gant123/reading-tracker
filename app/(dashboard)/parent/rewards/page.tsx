'use client';

import { useState, useEffect } from 'react';
import { Gift, Plus, Trash2, Check } from 'lucide-react';
import Link from 'next/link';

export default function ParentRewardsPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [pendingRedemptions, setPendingRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pointsCost: '',
    icon: '🎁',
  });

  const iconOptions = ['🎁', '🎮', '🍕', '🎬', '🎨', '⚽', '🎸', '📱', '🍦', '🎪', '🎯', '🏆'];

  useEffect(() => {
    fetchRewards();
    fetchPendingRedemptions();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await fetch('/api/rewards');
      const data = await response.json();
      setRewards(data);
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRedemptions = async () => {
    try {
      const response = await fetch('/api/rewards/pending');
      if (response.ok) {
        const data = await response.json();
        setPendingRedemptions(data);
      }
    } catch (error) {
      console.error('Failed to fetch pending redemptions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pointsCost: parseInt(formData.pointsCost),
        }),
      });

      if (response.ok) {
        alert('Reward created successfully!');
        setFormData({ title: '', description: '', pointsCost: '', icon: '🎁' });
        setShowForm(false);
        fetchRewards();
      } else {
        alert('Failed to create reward');
      }
    } catch (error) {
      console.error('Failed to create reward:', error);
      alert('Failed to create reward');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reward?')) return;

    try {
      const response = await fetch(`/api/rewards/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Reward deleted');
        fetchRewards();
      }
    } catch (error) {
      console.error('Failed to delete reward:', error);
    }
  };

  const handleComplete = async (userRewardId: string) => {
    try {
      const response = await fetch(`/api/rewards/${userRewardId}/complete`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Reward marked as completed!');
        fetchPendingRedemptions();
      }
    } catch (error) {
      console.error('Failed to complete reward:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/parent" className="text-gray-600 hover:text-gray-900">
                ← Back
              </Link>
              <Gift className="w-8 h-8 text-green-600" />
              <span className="font-bold text-xl">Manage Rewards</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pending Redemptions */}
        {pendingRedemptions.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-amber-900 mb-4">
              Pending Completions ({pendingRedemptions.length})
            </h2>
            <div className="space-y-3">
              {pendingRedemptions.map((ur: any) => (
                <div key={ur.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ur.reward.icon}</span>
                    <div>
                      <p className="font-semibold">{ur.reward.title}</p>
                      <p className="text-sm text-gray-600">
                        Redeemed by {ur.user.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleComplete(ur.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Mark Complete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards</h1>
            <p className="text-gray-600">Create and manage rewards for your children</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Reward
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Reward</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-3xl p-3 rounded-lg border-2 transition-colors ${
                        formData.icon === icon
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Extra 30 minutes of screen time"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Describe what they'll get..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points Cost
                </label>
                <input
                  type="number"
                  value={formData.pointsCost}
                  onChange={(e) => setFormData({ ...formData, pointsCost: e.target.value })}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="How many points?"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Create Reward
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Rewards List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : rewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{reward.icon}</div>
                    <button
                      onClick={() => handleDelete(reward.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-xl mb-2">{reward.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{reward.description}</p>

                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-green-900 font-semibold text-center">
                      {reward.pointsCost} points
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Rewards Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first reward to motivate your children!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Reward
            </button>
          </div>
        )}
      </main>
    </div>
  );
}