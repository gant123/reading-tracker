'use client';

import { useState } from 'react';

interface DiceBearAvatarProps {
  style?: string;
  seed: string;
  backgroundColor?: string;
  size?: number;
  className?: string;
  showRing?: boolean;
  ringColor?: string;
}

export function DiceBearAvatar({
  style = 'adventurer',
  seed,
  backgroundColor,
  size = 48,
  className = '',
  showRing = false,
  ringColor = 'ring-white/30',
}: DiceBearAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const getAvatarUrl = () => {
    let url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size * 2}`;
    if (backgroundColor && backgroundColor !== 'gradient' && !backgroundColor.startsWith('#')) {
      url += `&backgroundColor=${backgroundColor}`;
    }
    return url;
  };

  const bgStyle = backgroundColor === 'gradient'
    ? { background: 'linear-gradient(135deg, #f472b6, #a855f7, #3b82f6)' }
    : backgroundColor
      ? { backgroundColor: backgroundColor.startsWith('#') ? backgroundColor : `#${backgroundColor}` }
      : {};

  if (imageError) {
    // Fallback to initials
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold ${showRing ? `ring-2 ${ringColor}` : ''} ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4, ...bgStyle }}
      >
        {seed.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden ${showRing ? `ring-2 ${ringColor}` : ''} ${className}`}
      style={{ width: size, height: size, ...bgStyle }}
    >
      <img
        src={getAvatarUrl()}
        alt={`${seed}'s avatar`}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}

// Static version for server components
export function DiceBearAvatarStatic({
  style = 'adventurer',
  seed,
  backgroundColor,
  size = 48,
  className = '',
}: Omit<DiceBearAvatarProps, 'showRing' | 'ringColor'>) {
  let url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size * 2}`;
  if (backgroundColor && backgroundColor !== 'gradient') {
    const bg = backgroundColor.replace('#', '');
    url += `&backgroundColor=${bg}`;
  }

  return (
    <img
      src={url}
      alt={`${seed}'s avatar`}
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}