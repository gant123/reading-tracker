'use client';

import { useState } from 'react';
import { Gift, Plus, Trash2, Check, Clock, User, Star, CheckCircle2, Package, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRewards } from '@/hooks/useRewards';

export default function ParentRewardsPage() {
  const { 
    rewards, 
    redeemedRewards,
    loading, 
    createReward, 
    deleteReward, 
    completeReward,
    getPendingRedemptions,
    getCompletedRedemptions,
  } = useRewards();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pointsCost: '',
    icon: '🎁',
  });
  const [completing, setCompleting] = useState<string | null>(null);

  const iconOptions = ['🎁', '🎮', '🍕', '🎬', '🎨', '⚽', '🎸', '📱', '🍦', '🎪', '🎯', '🏆', '🎢', '🎠', '🎡', '🛍️', '🎧', '📚'];

  const pendingRedemptions = getPendingRedemptions();
  const completedRedemptions = getCompletedRedemptions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createReward({
        ...formData,
        pointsCost: parseInt(formData.pointsCost),
      });

      setFormData({ title: '', description: '', pointsCost: '', icon: '🎁' });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create reward:', error);
      alert('Failed to create reward');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reward?')) return;

    try {
      await deleteReward(id);
    } catch (error) {
      console.error('Failed to delete reward:', error);
    }
  };

  const handleComplete = async (userRewardId: string) => {
    setCompleting(userRewardId);
    try {
      await completeReward(userRewardId);
    } catch (error) {
      console.error('Failed to complete reward:', error);
      alert('Failed to mark as complete');
    } finally {
      setCompleting(null);
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Rewards Manager
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Create rewards and fulfill redemption requests from your children
        </p>
      </div>

      {/* Pending Redemptions - Priority Section */}
      {pendingRedemptions.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-900">
                Pending Redemptions
              </h2>
              <p className="text-amber-700 text-sm">
                {pendingRedemptions.length} reward{pendingRedemptions.length !== 1 ? 's' : ''} waiting for you to fulfill
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {pendingRedemptions.map((ur: any) => (
              <div 
                key={ur.id} 
                className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-amber-100 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Reward Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className="text-3xl sm:text-4xl flex-shrink-0">{ur.reward.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                      {ur.reward.title}
                    </h3>
                    <p className="text-gray-600 text-sm truncate">{ur.reward.description}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
                      <span className="flex items-center gap-1 text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        {ur.user?.name || 'Child'}
                      </span>
                      <span className="flex items-center gap-1 text-amber-600">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                        {ur.reward.pointsCost} pts
                      </span>
                      <span className="text-gray-500">
                        {formatDate(ur.redeemedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleComplete(ur.id)}
                  disabled={completing === ur.id}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 sm:px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {completing === ur.id ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Mark Complete
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Completed */}
      {completedRedemptions.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            <h2 className="text-base sm:text-lg font-bold text-green-900">
              Recently Completed ({completedRedemptions.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {completedRedemptions.slice(0, 6).map((ur: any) => (
              <div key={ur.id} className="bg-white/80 rounded-lg p-3 flex items-center gap-3">
                <span className="text-2xl">{ur.reward.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm truncate">{ur.reward.title}</p>
                  <p className="text-xs text-gray-500">
                    {ur.user?.name || 'Child'} • {formatDate(ur.completedAt)}
                  </p>
                </div>
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Reward Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Gift className="w-6 h-6 text-purple-600" />
          Available Rewards
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 sm:px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Reward
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Create New Reward
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Choose an Icon
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`text-2xl sm:text-3xl p-2 sm:p-3 rounded-xl border-2 transition-all ${
                      formData.icon === icon
                        ? 'border-purple-500 bg-purple-50 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reward Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="e.g., Extra screen time"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Points Cost
                </label>
                <div className="relative">
                  <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                  <input
                    type="number"
                    value={formData.pointsCost}
                    onChange={(e) => setFormData({ ...formData, pointsCost: e.target.value })}
                    required
                    min="1"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe what they'll get..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Create Reward
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rewards Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading rewards...</p>
        </div>
      ) : rewards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {rewards.map((reward: any) => (
            <div key={reward.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all group">
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">{reward.icon}</span>
                  <button
                    onClick={() => handleDelete(reward.id)}
                    className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete reward"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2">{reward.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{reward.description}</p>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="text-xl font-bold text-amber-700">{reward.pointsCost}</span>
                  <span className="text-amber-600 text-sm">points</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 text-center border border-gray-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Rewards Yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create rewards to motivate your children! They can redeem points earned from reading.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create First Reward
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Reward Ideas
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <span>🎮</span>
            <span>Extra screen time or gaming session</span>
          </div>
          <div className="flex items-start gap-2">
            <span>🍕</span>
            <span>Pick dinner or get a favorite treat</span>
          </div>
          <div className="flex items-start gap-2">
            <span>🎬</span>
            <span>Family movie night choice</span>
          </div>
          <div className="flex items-start gap-2">
            <span>🛍️</span>
            <span>Small toy or book purchase</span>
          </div>
        </div>
      </div>
    </div>
  );
}