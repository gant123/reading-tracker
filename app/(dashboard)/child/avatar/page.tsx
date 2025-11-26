'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Star, Palette, Wand2, Check, Lock, ShoppingBag, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface AvatarStyle {
  id: string;
  name: string;
  description: string;
  previewSeed: string;
  cost: number;
  rarity: string;
  owned: boolean;
  canAfford: boolean;
  equipped: boolean;
}

interface BackgroundColor {
  id: string;
  name: string;
  value: string;
  cost: number;
  rarity: string;
  owned: boolean;
  canAfford: boolean;
  equipped: boolean;
}

interface AvatarData {
  id: string;
  name: string;
  avatarStyle: string;
  avatarSeed: string | null;
  avatarColor: string;
  points: number;
}

const RARITY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  free: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-600', glow: '' },
  common: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', glow: '' },
  rare: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', glow: 'shadow-blue-200' },
  epic: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700', glow: 'shadow-purple-300' },
  legendary: { bg: 'bg-gradient-to-br from-amber-50 to-orange-50', border: 'border-amber-400', text: 'text-amber-700', glow: 'shadow-amber-300 shadow-lg' },
};

export default function AvatarShopPage() {
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null);
  const [styles, setStyles] = useState<AvatarStyle[]>([]);
  const [backgrounds, setBackgrounds] = useState<BackgroundColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'styles' | 'backgrounds'>('styles');
  const [customSeed, setCustomSeed] = useState('');
  const [previewStyle, setPreviewStyle] = useState('');
  const [previewBg, setPreviewBg] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/avatar');
      if (response.ok) {
        const data = await response.json();
        setAvatarData(data.avatar);
        setStyles(data.styles);
        setBackgrounds(data.backgrounds);
        setCustomSeed(data.avatar.avatarSeed || data.avatar.name);
        setPreviewStyle(data.avatar.avatarStyle);
        setPreviewBg(data.avatar.avatarColor);
      }
    } catch (error) {
      console.error('Failed to fetch avatar data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePurchase = async (type: 'style' | 'background', itemId: string) => {
    setPurchasing(itemId);
    try {
      const response = await fetch('/api/avatar/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, itemId }),
      });

      if (response.ok) {
        await fetchData();
        alert('🎉 Purchase successful!');
      } else {
        const error = await response.json();
        alert(error.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed');
    } finally {
      setPurchasing(null);
    }
  };

  const handleEquip = async (type: 'style' | 'background', value: string) => {
    try {
      const updates: Record<string, string> = {};
      if (type === 'style') {
        updates.style = value;
        setPreviewStyle(value);
      } else {
        updates.backgroundColor = value;
        setPreviewBg(value);
      }

      const response = await fetch('/api/avatar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to equip');
      }
    } catch (error) {
      console.error('Equip failed:', error);
    }
  };

  const handleRandomize = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setCustomSeed(randomSeed);
  };

  const handleSaveSeed = async () => {
    try {
      const response = await fetch('/api/avatar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed: customSeed }),
      });

      if (response.ok) {
        await fetchData();
        alert('Avatar updated! ✨');
      }
    } catch (error) {
      console.error('Failed to save seed:', error);
    }
  };

  const getAvatarUrl = (style: string, seed: string, bg?: string, size = 200) => {
    let url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size}`;
    if (bg && bg !== 'gradient' && !bg.startsWith('#')) {
      url += `&backgroundColor=${bg}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Sparkles className="w-20 h-20 text-yellow-400 mx-auto animate-pulse" />
            <div className="absolute inset-0 blur-xl bg-yellow-400/30 rounded-full"></div>
          </div>
          <p className="text-white/80 mt-4 text-lg font-medium">Loading Avatar Shop...</p>
        </div>
      </div>
    );
  }

  const currentBgValue = previewBg.replace('#', '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Animated background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        {/* Floating stars */}
        {[...Array(20)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-yellow-400/30 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${8 + Math.random() * 16}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <nav className="relative z-10 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Wand2 className="w-8 h-8 text-pink-400" />
                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="font-black text-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Avatar Shop
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-400/30">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-yellow-100">{avatarData?.points || 0}</span>
                <span className="text-yellow-200/70 text-sm">points</span>
              </div>
              <Link
                href="/child"
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Preview Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 overflow-hidden">
                  {/* Decorative corner sparkles */}
                  <Sparkles className="absolute top-3 right-3 w-5 h-5 text-yellow-400/50" />
                  <Sparkles className="absolute bottom-3 left-3 w-4 h-4 text-pink-400/50" />

                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                      Your Avatar
                    </span>
                  </h2>

                  {/* Avatar Display */}
                  <div className="relative mx-auto w-48 h-48 mb-6">
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{ 
                        background: currentBgValue === 'gradient' 
                          ? 'linear-gradient(135deg, #f472b6, #a855f7, #3b82f6)' 
                          : `#${currentBgValue}`
                      }}
                    ></div>
                    <img
                      src={getAvatarUrl(previewStyle || 'adventurer', customSeed || 'default', undefined, 200)}
                      alt="Your avatar"
                      className="relative w-full h-full rounded-full object-cover ring-4 ring-white/30"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-2 shadow-lg">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Seed Customization */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80">
                      Avatar Seed (changes your look!)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customSeed}
                        onChange={(e) => setCustomSeed(e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                        placeholder="Enter a name or word..."
                      />
                      <button
                        onClick={handleRandomize}
                        className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                        title="Randomize"
                      >
                        <RefreshCw className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <button
                      onClick={handleSaveSeed}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-pink-500/25"
                    >
                      Save Changes ✨
                    </button>
                  </div>

                  {/* Current Style Info */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-sm text-white/60">
                      Current Style: <span className="text-white font-medium">{styles.find(s => s.id === previewStyle)?.name || 'Adventurer'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('styles')}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all ${
                  activeTab === 'styles'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Wand2 className="w-5 h-5 inline mr-2" />
                Avatar Styles
              </button>
              <button
                onClick={() => setActiveTab('backgrounds')}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all ${
                  activeTab === 'backgrounds'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Palette className="w-5 h-5 inline mr-2" />
                Backgrounds
              </button>
            </div>

            {/* Styles Grid */}
            {activeTab === 'styles' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {styles.map((style) => {
                  const rarityColors = RARITY_COLORS[style.rarity] || RARITY_COLORS.common;
                  
                  return (
                    <div
                      key={style.id}
                      className={`relative group bg-white/10 backdrop-blur-sm rounded-xl border-2 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl ${
                        style.equipped 
                          ? 'border-green-400 ring-2 ring-green-400/30' 
                          : 'border-white/20 hover:border-white/40'
                      } ${rarityColors.glow}`}
                    >
                      {/* Rarity Badge */}
                      <div className={`absolute top-3 right-3 z-10 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${rarityColors.bg} ${rarityColors.text} border ${rarityColors.border}`}>
                        {style.rarity}
                      </div>

                      {/* Equipped Badge */}
                      {style.equipped && (
                        <div className="absolute top-3 left-3 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Equipped
                        </div>
                      )}

                      <div className="p-4">
                        {/* Preview */}
                        <div className="relative mx-auto w-24 h-24 mb-3 group-hover:scale-110 transition-transform">
                          <img
                            src={getAvatarUrl(style.id, customSeed || 'preview', '60a5fa', 100)}
                            alt={style.name}
                            className="w-full h-full rounded-xl bg-blue-400/20"
                          />
                        </div>

                        <h3 className="font-bold text-white text-center mb-1">{style.name}</h3>
                        <p className="text-white/60 text-xs text-center mb-3">{style.description}</p>

                        {/* Action Button */}
                        {style.owned ? (
                          <button
                            onClick={() => handleEquip('style', style.id)}
                            disabled={style.equipped}
                            className={`w-full py-2 rounded-lg font-semibold transition-all text-sm ${
                              style.equipped
                                ? 'bg-green-500/20 text-green-400 cursor-default'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                          >
                            {style.equipped ? '✓ Equipped' : 'Equip'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePurchase('style', style.id)}
                            disabled={!style.canAfford || purchasing === style.id}
                            className={`w-full py-2 rounded-lg font-semibold transition-all text-sm flex items-center justify-center gap-2 ${
                              style.canAfford
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-300 hover:to-orange-300'
                                : 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {purchasing === style.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : style.canAfford ? (
                              <>
                                <ShoppingBag className="w-4 h-4" />
                                <Star className="w-3 h-3 fill-current" />
                                {style.cost}
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                <Star className="w-3 h-3" />
                                {style.cost}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Backgrounds Grid */}
            {activeTab === 'backgrounds' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {backgrounds.map((bg) => {
                  const rarityColors = RARITY_COLORS[bg.rarity] || RARITY_COLORS.common;
                  const isGradient = bg.value === 'gradient';
                  
                  return (
                    <div
                      key={bg.id}
                      className={`relative group rounded-xl border-2 overflow-hidden transition-all hover:scale-105 ${
                        bg.equipped 
                          ? 'border-green-400 ring-2 ring-green-400/30' 
                          : 'border-white/20 hover:border-white/40'
                      } ${rarityColors.glow}`}
                    >
                      {/* Color Preview */}
                      <div 
                        className="h-20 w-full"
                        style={{
                          background: isGradient 
                            ? 'linear-gradient(135deg, #f472b6, #a855f7, #3b82f6)'
                            : `#${bg.value}`
                        }}
                      >
                        {/* Mini avatar preview */}
                        <div className="flex items-center justify-center h-full">
                          <img
                            src={getAvatarUrl(previewStyle || 'adventurer', customSeed || 'preview', undefined, 60)}
                            alt="Preview"
                            className="w-12 h-12 rounded-full ring-2 ring-white/50"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white/10 backdrop-blur-sm">
                        {/* Equipped/Rarity badges */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${rarityColors.bg} ${rarityColors.text}`}>
                            {bg.rarity}
                          </span>
                          {bg.equipped && (
                            <Check className="w-4 h-4 text-green-400" />
                          )}
                        </div>

                        <h3 className="font-semibold text-white text-sm mb-2">{bg.name}</h3>

                        {/* Action Button */}
                        {bg.owned ? (
                          <button
                            onClick={() => handleEquip('background', bg.value)}
                            disabled={bg.equipped}
                            className={`w-full py-1.5 rounded-lg font-medium transition-all text-xs ${
                              bg.equipped
                                ? 'bg-green-500/20 text-green-400 cursor-default'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                          >
                            {bg.equipped ? '✓ Active' : 'Use'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePurchase('background', bg.id)}
                            disabled={!bg.canAfford || purchasing === bg.id}
                            className={`w-full py-1.5 rounded-lg font-medium transition-all text-xs flex items-center justify-center gap-1 ${
                              bg.canAfford
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900'
                                : 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {purchasing === bg.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Star className="w-3 h-3 fill-current" />
                                {bg.cost}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tips Section */}
            <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="font-bold text-lg text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Pro Tips
              </h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span>Try different seeds to find the perfect look for your avatar!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Legendary items are rare and super cool - save up your points!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Use your name as a seed for a unique avatar that's just for you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Read more books to earn points faster with streak bonuses! 🔥</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}