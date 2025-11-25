'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { showToast } from '@/lib/utils';

interface CreateRewardProps {
  onSuccess?: () => void;
}

export function CreateReward({ onSuccess }: CreateRewardProps) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pointsCost: '',
    icon: '🎁',
  });

  const iconOptions = ['🎁', '🎮', '🍕', '🎬', '🎨', '⚽', '🎸', '📱', '🍦', '🎪', '🎯', '🏆'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
        showToast.success('Reward created successfully! 🎉');
        setFormData({ title: '', description: '', pointsCost: '', icon: '🎁' });
        setShowForm(false);
        onSuccess?.();
      } else {
        const error = await response.json();
        showToast.error(error.error || 'Failed to create reward');
      }
    } catch (error) {
      console.error('Failed to create reward:', error);
      showToast.error('Failed to create reward');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create Reward
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Reward</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
                      ? 'border-blue-600 bg-blue-50'
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
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={100}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe what they'll get..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points Cost
            </label>
            <Input
              type="number"
              value={formData.pointsCost}
              onChange={(e) => setFormData({ ...formData, pointsCost: e.target.value })}
              required
              min="1"
              placeholder="How many points?"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-3">
          <Button type="submit" className="flex-1">
            Create Reward
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}