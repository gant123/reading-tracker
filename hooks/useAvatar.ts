'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- Types ---
interface AvatarConfig {
  points: number;
  avatarStyle: string;
  avatarSeed: string | null;
  avatarColor: string;
}

interface ShopData {
  avatar: AvatarConfig & { id: string; name: string };
  styles: any[];
  backgrounds: any[];
}

// --- Hook for Navbar / UserMenu (Lightweight) ---
export function useAvatarDisplay() {
  return useQuery({
    queryKey: ['avatar-display'],
    queryFn: async () => {
      const res = await fetch('/api/avatar/points');
      if (!res.ok) throw new Error('Failed to fetch avatar');
      return res.json() as Promise<AvatarConfig>;
    },
    refetchInterval: 3000, // Poll every 3s to keep navbar updated
    staleTime: 2000,
  });
}

// --- Hook for Shop Page (Full Data) ---
export function useAvatarShop() {
  const queryClient = useQueryClient();

  // 1. Fetch Full Shop Data
  const { data, isLoading, error } = useQuery({
    queryKey: ['avatar-shop'],
    queryFn: async () => {
      const res = await fetch('/api/avatar');
      if (!res.ok) throw new Error('Failed to fetch shop');
      return res.json() as Promise<ShopData>;
    },
    // Don't poll heavily here, rely on mutations to update
  });

  // 2. Purchase Mutation
  const purchaseItem = useMutation({
    mutationFn: async ({ type, itemId }: { type: 'style' | 'background'; itemId: string }) => {
      const res = await fetch('/api/avatar/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, itemId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Purchase failed');
      }
      return res.json();
    },
    onSuccess: () => {
      // Refresh both shop data and navbar data
      queryClient.invalidateQueries({ queryKey: ['avatar-shop'] });
      queryClient.invalidateQueries({ queryKey: ['avatar-display'] });
      // Also update points everywhere
      queryClient.invalidateQueries({ queryKey: ['user-points'] });
    },
  });

  // 3. Equip Mutation
  const equipItem = useMutation({
    mutationFn: async (updates: { style?: string; backgroundColor?: string }) => {
      const res = await fetch('/api/avatar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to equip item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avatar-shop'] });
      queryClient.invalidateQueries({ queryKey: ['avatar-display'] });
    },
  });

  // 4. Save Seed Mutation
  const updateSeed = useMutation({
    mutationFn: async (seed: string) => {
      const res = await fetch('/api/avatar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed }),
      });
      if (!res.ok) throw new Error('Failed to save seed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avatar-shop'] });
      queryClient.invalidateQueries({ queryKey: ['avatar-display'] });
    },
  });

  return {
    data,
    loading: isLoading,
    error,
    purchaseItem,
    equipItem,
    updateSeed,
  };
}