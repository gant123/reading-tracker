import { prisma } from '@/lib/prisma';

export interface AvatarStyle {
  id: string;
  name: string;
  description: string;
  previewSeed: string;
  cost: number;
  rarity: 'free' | 'common' | 'rare' | 'epic' | 'legendary';
  purchasable: boolean;
}

// Available DiceBear styles
export const AVATAR_STYLES: AvatarStyle[] = [
  // --- Shop Items (Purchasable: true) ---
  { id: 'adventurer', name: 'Adventurer', description: 'Friendly adventurer characters', previewSeed: 'Felix', cost: 0, rarity: 'free', purchasable: true },
  { id: 'adventurer-neutral', name: 'Adventurer Neutral', description: 'Simplified adventurer style', previewSeed: 'Felix', cost: 0, rarity: 'free', purchasable: true },
  { id: 'avataaars', name: 'Avataaars', description: 'Cartoon-style avatars', previewSeed: 'Felix', cost: 50, rarity: 'common', purchasable: true },
  { id: 'big-ears', name: 'Big Ears', description: 'Cute characters with big ears', previewSeed: 'Felix', cost: 50, rarity: 'common', purchasable: true },
  { id: 'big-smile', name: 'Big Smile', description: 'Happy, smiling characters', previewSeed: 'Felix', cost: 75, rarity: 'common', purchasable: true },
  { id: 'bottts', name: 'Bottts', description: 'Colorful robot avatars', previewSeed: 'Felix', cost: 100, rarity: 'rare', purchasable: true },
  { id: 'croodles', name: 'Croodles', description: 'Hand-drawn doodle style', previewSeed: 'Felix', cost: 100, rarity: 'rare', purchasable: true },
  { id: 'fun-emoji', name: 'Fun Emoji', description: 'Expressive emoji faces', previewSeed: 'Felix', cost: 75, rarity: 'common', purchasable: true },
  { id: 'icons', name: 'Icons', description: 'Abstract icon avatars', previewSeed: 'Felix', cost: 125, rarity: 'rare', purchasable: true },
  { id: 'identicon', name: 'Identicon', description: 'Geometric patterns', previewSeed: 'Felix', cost: 50, rarity: 'common', purchasable: true },
  { id: 'lorelei', name: 'Lorelei', description: 'Elegant character portraits', previewSeed: 'Felix', cost: 150, rarity: 'epic', purchasable: true },
  { id: 'micah', name: 'Micah', description: 'Minimalist line art', previewSeed: 'Felix', cost: 150, rarity: 'epic', purchasable: true },
  { id: 'miniavs', name: 'Miniavs', description: 'Tiny cute avatars', previewSeed: 'Felix', cost: 100, rarity: 'rare', purchasable: true },
  { id: 'notionists', name: 'Notionists', description: 'Notion-style illustrations', previewSeed: 'Felix', cost: 175, rarity: 'epic', purchasable: true },
  { id: 'pixel-art', name: 'Pixel Art', description: 'Retro pixel characters', previewSeed: 'Felix', cost: 175, rarity: 'epic', purchasable: true },
  
  // --- Mystery Box EXCLUSIVES (Purchasable: false) ---
  { id: 'rings', name: 'Cosmic Rings', description: 'Abstract ring avatars', previewSeed: 'Felix', cost: 0, rarity: 'legendary', purchasable: false },
  { id: 'shapes', name: 'Geometric', description: 'Abstract shape art', previewSeed: 'Felix', cost: 0, rarity: 'legendary', purchasable: false },
  { id: 'thumbs', name: 'Thumbs Up', description: 'Positive vibes only', previewSeed: 'Felix', cost: 0, rarity: 'epic', purchasable: false },
  { id: 'open-peeps', name: 'Open Peeps', description: 'Hand-drawn sketches', previewSeed: 'Felix', cost: 0, rarity: 'rare', purchasable: false },
  { id: 'personas', name: 'Personas', description: 'Detailed character art', previewSeed: 'Felix', cost: 0, rarity: 'legendary', purchasable: false },
];

// Background colors
export const BACKGROUND_COLORS = [
  // --- Shop Items ---
  { id: 'bg-rose', name: 'Rose', value: 'fda4af', cost: 25, rarity: 'common', purchasable: true },
  { id: 'bg-pink', name: 'Pink', value: 'f9a8d4', cost: 25, rarity: 'common', purchasable: true },
  { id: 'bg-fuchsia', name: 'Fuchsia', value: 'e879f9', cost: 30, rarity: 'common', purchasable: true },
  { id: 'bg-purple', name: 'Purple', value: 'c084fc', cost: 30, rarity: 'common', purchasable: true },
  { id: 'bg-violet', name: 'Violet', value: 'a78bfa', cost: 30, rarity: 'common', purchasable: true },
  { id: 'bg-indigo', name: 'Indigo', value: '818cf8', cost: 25, rarity: 'common', purchasable: true },
  { id: 'bg-blue', name: 'Blue', value: '60a5fa', cost: 0, rarity: 'free', purchasable: true },
  { id: 'bg-sky', name: 'Sky', value: '38bdf8', cost: 25, rarity: 'common', purchasable: true },
  { id: 'bg-cyan', name: 'Cyan', value: '22d3d8', cost: 30, rarity: 'common', purchasable: true },
  { id: 'bg-teal', name: 'Teal', value: '2dd4bf', cost: 30, rarity: 'common', purchasable: true },
  { id: 'bg-emerald', name: 'Emerald', value: '34d399', cost: 25, rarity: 'common', purchasable: true },
  { id: 'bg-green', name: 'Green', value: '4ade80', cost: 0, rarity: 'free', purchasable: true },
  { id: 'bg-lime', name: 'Lime', value: 'a3e635', cost: 25, rarity: 'common', purchasable: true },
  { id: 'bg-yellow', name: 'Yellow', value: 'facc15', cost: 25, rarity: 'common', purchasable: true },
  { id: 'bg-amber', name: 'Amber', value: 'fbbf24', cost: 25, rarity: 'common', purchasable: true },
  { id: 'bg-orange', name: 'Orange', value: 'fb923c', cost: 25, rarity: 'common', purchasable: true },
  { id: 'bg-red', name: 'Red', value: 'f87171', cost: 30, rarity: 'common', purchasable: true },
  
  // --- Mystery Box EXCLUSIVES ---
  { id: 'bg-gold', name: 'Gold Shimmer', value: 'fcd34d', cost: 0, rarity: 'legendary', purchasable: false },
  { id: 'bg-galaxy', name: 'Galaxy', value: '1e1b4b', cost: 0, rarity: 'epic', purchasable: false },
  { id: 'bg-rainbow', name: 'Rainbow', value: 'gradient', cost: 0, rarity: 'legendary', purchasable: false },
];

export class AvatarService {
  /**
   * Get user's current avatar configuration
   */
  static async getUserAvatar(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatarStyle: true,
        avatarSeed: true,
        avatarColor: true,
        avatarAccessories: true,
        points: true,
        avatarItems: {
          include: { item: true },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Get SHOP styles (Filters out unowned Exclusives)
   */
  static async getAvailableStyles(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatarItems: {
          include: { item: true },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const ownedStyles = user.avatarItems
      .filter((ui: { item: { type: string; }; }) => ui.item.type === 'style')
      .map((ui: { item: { value: any; }; }) => ui.item.value);

    // Filter: Must be purchasable OR already owned (so you can see what you have)
    return AVATAR_STYLES.filter(s => s.purchasable || ownedStyles.includes(s.id)).map(style => ({
      ...style,
      owned: style.cost === 0 || ownedStyles.includes(style.id),
      canAfford: user.points >= style.cost,
      equipped: user.avatarStyle === style.id,
      isExclusive: !style.purchasable // Helper flag for UI
    }));
  }

  /**
   * Get SHOP backgrounds (Filters out unowned Exclusives)
   */
  static async getAvailableBackgrounds(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatarItems: {
          include: { item: true },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const ownedBackgrounds = user.avatarItems
      .filter((ui: { item: { type: string; }; }) => ui.item.type === 'backgroundColor')
      .map((ui: { item: { value: any; }; }) => ui.item.value);

    // Filter: Must be purchasable OR already owned
    return BACKGROUND_COLORS.filter(b => b.purchasable || ownedBackgrounds.includes(b.value)).map(bg => ({
      ...bg,
      owned: bg.cost === 0 || ownedBackgrounds.includes(bg.value),
      canAfford: user.points >= bg.cost,
      equipped: user.avatarColor === `#${bg.value}` || user.avatarColor === bg.value,
      isExclusive: !bg.purchasable
    }));
  }

  /**
   * Purchase a style
   */
  static async purchaseStyle(userId: string, styleId: string) {
    const style = AVATAR_STYLES.find(s => s.id === styleId);
    if (!style) {
      throw new Error('Style not found');
    }

    if (!style.purchasable) {
      throw new Error('This item cannot be purchased directly');
    }

    if (style.cost === 0) {
      throw new Error('This style is free');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatarItems: {
          include: { item: true },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if already owned
    const alreadyOwned = user.avatarItems.some(
        (      ui: { item: { type: string; value: string; }; }) => ui.item.type === 'style' && ui.item.value === styleId
    );

    if (alreadyOwned) {
      throw new Error('You already own this style');
    }

    if (user.points < style.cost) {
      throw new Error('Not enough points');
    }

    // Create or get the avatar item
    let avatarItem = await prisma.avatarItem.findUnique({
      where: {
        style_type_value: {
          style: styleId,
          type: 'style',
          value: styleId,
        },
      },
    });

    if (!avatarItem) {
      avatarItem = await prisma.avatarItem.create({
        data: {
          name: style.name,
          type: 'style',
          value: styleId,
          style: styleId,
          pointsCost: style.cost,
          icon: '🎭',
          rarity: style.rarity,
        },
      });
    }

    // Deduct points and create purchase
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { points: { decrement: style.cost } },
      }),
      prisma.userAvatarItem.create({
        data: {
          userId,
          itemId: avatarItem.id,
        },
      }),
    ]);

    return { success: true, style, pointsSpent: style.cost };
  }

  /**
   * Purchase a background color
   */
  static async purchaseBackground(userId: string, backgroundId: string) {
    const bg = BACKGROUND_COLORS.find(b => b.id === backgroundId);
    if (!bg) {
      throw new Error('Background not found');
    }

    if (!bg.purchasable) {
      throw new Error('This item cannot be purchased directly');
    }

    if (bg.cost === 0) {
      throw new Error('This background is free');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatarItems: {
          include: { item: true },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if already owned
    const alreadyOwned = user.avatarItems.some(
        (      ui: { item: { type: string; value: string; }; }) => ui.item.type === 'backgroundColor' && ui.item.value === bg.value
    );

    if (alreadyOwned) {
      throw new Error('You already own this background');
    }

    if (user.points < bg.cost) {
      throw new Error('Not enough points');
    }

    // Create or get the avatar item
    let avatarItem = await prisma.avatarItem.findUnique({
      where: {
        style_type_value: {
          style: 'global',
          type: 'backgroundColor',
          value: bg.value,
        },
      },
    });

    if (!avatarItem) {
      avatarItem = await prisma.avatarItem.create({
        data: {
          name: bg.name,
          type: 'backgroundColor',
          value: bg.value,
          style: 'global',
          pointsCost: bg.cost,
          icon: '🎨',
          rarity: bg.rarity,
        },
      });
    }

    // Deduct points and create purchase
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { points: { decrement: bg.cost } },
      }),
      prisma.userAvatarItem.create({
        data: {
          userId,
          itemId: avatarItem.id,
        },
      }),
    ]);

    return { success: true, background: bg, pointsSpent: bg.cost };
  }

  /**
   * Update user's avatar configuration
   */
  static async updateAvatar(
    userId: string,
    updates: {
      style?: string;
      seed?: string;
      backgroundColor?: string;
    }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatarItems: {
          include: { item: true },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Validate style ownership
    if (updates.style) {
      const styleInfo = AVATAR_STYLES.find(s => s.id === updates.style);
      if (!styleInfo) {
        throw new Error('Invalid style');
      }

      // Check if free or owned
      if (styleInfo.cost > 0 || !styleInfo.purchasable) {
        const ownsStyle = user.avatarItems.some(
            (          ui: { item: { type: string; value: string | undefined; }; }) => ui.item.type === 'style' && ui.item.value === updates.style
        );
        if (!ownsStyle) {
          throw new Error('You do not own this style');
        }
      }
    }

    // Validate background ownership
    if (updates.backgroundColor) {
      const bgInfo = BACKGROUND_COLORS.find(
        b => b.value === updates.backgroundColor || b.id === updates.backgroundColor
      );
      if (bgInfo && (bgInfo.cost > 0 || !bgInfo.purchasable)) {
        const ownsBg = user.avatarItems.some(
            (          ui: { item: { type: string; value: string; }; }) => ui.item.type === 'backgroundColor' && ui.item.value === bgInfo.value
        );
        if (!ownsBg) {
          throw new Error('You do not own this background');
        }
      }
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        ...(updates.style && { avatarStyle: updates.style }),
        ...(updates.seed && { avatarSeed: updates.seed }),
        ...(updates.backgroundColor && { avatarColor: updates.backgroundColor }),
      },
    });
  }

  /**
   * Generate avatar URL
   */
  static generateAvatarUrl(
    style: string,
    seed: string,
    options?: {
      backgroundColor?: string;
      size?: number;
    }
  ): string {
    const size = options?.size || 128;
    let url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size}`;

    if (options?.backgroundColor) {
      const bgColor = options.backgroundColor.replace('#', '');
      url += `&backgroundColor=${bgColor}`;
    }

    return url;
  }

  /**
   * Get user's inventory
   */
  static async getInventory(userId: string) {
    const items = await prisma.userAvatarItem.findMany({
      where: { userId },
      include: { item: true },
      orderBy: { purchasedAt: 'desc' },
    });

    return items;
  }

  /**
   * Open a Mystery Box
   */
  static async openMysteryBox(userId: string, cost: number = 100) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatarItems: {
          include: { item: true },
        },
      },
    });

    if (!user) throw new Error('User not found');
    if (user.points < cost) throw new Error('Not enough points');

    // 1. Get owned items
    const ownedStyleIds = user.avatarItems
      .filter((ui: { item: { type: string; }; }) => ui.item.type === 'style')
      .map((ui: { item: { value: any; }; }) => ui.item.value);

    const ownedBgIds = user.avatarItems
      .filter((ui: { item: { type: string; }; }) => ui.item.type === 'backgroundColor')
      .map((ui: { item: { value: any; }; }) => ui.item.value);

    // 2. Prioritize EXCLUSIVES that are NOT owned
    const exclusiveStyles = AVATAR_STYLES.filter(s => !s.purchasable && !ownedStyleIds.includes(s.id));
    const exclusiveBgs = BACKGROUND_COLORS.filter(b => !b.purchasable && !ownedBgIds.includes(b.value));

    let pool = [
      ...exclusiveStyles.map(s => ({ ...s, type: 'style', value: s.id })),
      ...exclusiveBgs.map(b => ({ ...b, type: 'backgroundColor', value: b.value }))
    ];

    // 3. Fallback: If they have all exclusives, allow unowned Shop items
    if (pool.length === 0) {
       const shopStyles = AVATAR_STYLES.filter(s => s.purchasable && s.cost > 0 && !ownedStyleIds.includes(s.id));
       const shopBgs = BACKGROUND_COLORS.filter(b => b.purchasable && b.cost > 0 && !ownedBgIds.includes(b.value));
       pool = [
         ...shopStyles.map(s => ({ ...s, type: 'style', value: s.id })),
         ...shopBgs.map(b => ({ ...b, type: 'backgroundColor', value: b.value }))
       ];
    }

    if (pool.length === 0) {
      throw new Error('You already own everything!');
    }

    // 4. Pick a random item
    const randomItem = pool[Math.floor(Math.random() * pool.length)];

    // 5. Create the item in DB if it doesn't exist
    let avatarItem = await prisma.avatarItem.findUnique({
      where: {
        style_type_value: {
          style: randomItem.type === 'style' ? randomItem.value : 'global',
          type: randomItem.type,
          value: randomItem.value,
        },
      },
    });

    if (!avatarItem) {
      avatarItem = await prisma.avatarItem.create({
        data: {
          name: randomItem.name,
          type: randomItem.type,
          value: randomItem.value,
          style: randomItem.type === 'style' ? randomItem.value : 'global',
          pointsCost: 0, // It's priceless/exclusive
          icon: randomItem.type === 'style' ? '🎭' : '🎨',
          rarity: randomItem.rarity,
        },
      });
    }

    // 6. Transaction: Deduct points & Grant item
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { points: { decrement: cost } },
      }),
      prisma.userAvatarItem.create({
        data: {
          userId,
          itemId: avatarItem.id,
        },
      }),
    ]);

    return { success: true, item: randomItem, pointsSpent: cost };
  }
}