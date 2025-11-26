import { prisma } from '@/lib/prisma';
import { any } from 'zod';

export interface AvatarStyle {
  id: string;
  name: string;
  description: string;
  previewSeed: string;
  cost: number;
  rarity: 'free' | 'common' | 'rare' | 'epic' | 'legendary';
}

// Available DiceBear styles with costs
export const AVATAR_STYLES: AvatarStyle[] = [
  { id: 'adventurer', name: 'Adventurer', description: 'Friendly adventurer characters', previewSeed: 'Felix', cost: 0, rarity: 'free' },
  { id: 'adventurer-neutral', name: 'Adventurer Neutral', description: 'Simplified adventurer style', previewSeed: 'Felix', cost: 0, rarity: 'free' },
  { id: 'avataaars', name: 'Avataaars', description: 'Cartoon-style avatars', previewSeed: 'Felix', cost: 50, rarity: 'common' },
  { id: 'big-ears', name: 'Big Ears', description: 'Cute characters with big ears', previewSeed: 'Felix', cost: 50, rarity: 'common' },
  { id: 'big-smile', name: 'Big Smile', description: 'Happy, smiling characters', previewSeed: 'Felix', cost: 75, rarity: 'common' },
  { id: 'bottts', name: 'Bottts', description: 'Colorful robot avatars', previewSeed: 'Felix', cost: 100, rarity: 'rare' },
  { id: 'croodles', name: 'Croodles', description: 'Hand-drawn doodle style', previewSeed: 'Felix', cost: 100, rarity: 'rare' },
  { id: 'fun-emoji', name: 'Fun Emoji', description: 'Expressive emoji faces', previewSeed: 'Felix', cost: 75, rarity: 'common' },
  { id: 'icons', name: 'Icons', description: 'Abstract icon avatars', previewSeed: 'Felix', cost: 125, rarity: 'rare' },
  { id: 'identicon', name: 'Identicon', description: 'Geometric patterns', previewSeed: 'Felix', cost: 50, rarity: 'common' },
  { id: 'lorelei', name: 'Lorelei', description: 'Elegant character portraits', previewSeed: 'Felix', cost: 150, rarity: 'epic' },
  { id: 'micah', name: 'Micah', description: 'Minimalist line art', previewSeed: 'Felix', cost: 150, rarity: 'epic' },
  { id: 'miniavs', name: 'Miniavs', description: 'Tiny cute avatars', previewSeed: 'Felix', cost: 100, rarity: 'rare' },
  { id: 'notionists', name: 'Notionists', description: 'Notion-style illustrations', previewSeed: 'Felix', cost: 175, rarity: 'epic' },
  { id: 'open-peeps', name: 'Open Peeps', description: 'Hand-drawn people', previewSeed: 'Felix', cost: 125, rarity: 'rare' },
  { id: 'personas', name: 'Personas', description: 'Detailed character art', previewSeed: 'Felix', cost: 200, rarity: 'legendary' },
  { id: 'pixel-art', name: 'Pixel Art', description: 'Retro pixel characters', previewSeed: 'Felix', cost: 175, rarity: 'epic' },
  { id: 'thumbs', name: 'Thumbs', description: 'Thumbs up characters', previewSeed: 'Felix', cost: 75, rarity: 'common' },
];

// Background colors available for purchase
export const BACKGROUND_COLORS = [
  { id: 'bg-rose', name: 'Rose', value: 'fda4af', cost: 25, rarity: 'common' },
  { id: 'bg-pink', name: 'Pink', value: 'f9a8d4', cost: 25, rarity: 'common' },
  { id: 'bg-fuchsia', name: 'Fuchsia', value: 'e879f9', cost: 30, rarity: 'common' },
  { id: 'bg-purple', name: 'Purple', value: 'c084fc', cost: 30, rarity: 'common' },
  { id: 'bg-violet', name: 'Violet', value: 'a78bfa', cost: 30, rarity: 'common' },
  { id: 'bg-indigo', name: 'Indigo', value: '818cf8', cost: 25, rarity: 'common' },
  { id: 'bg-blue', name: 'Blue', value: '60a5fa', cost: 0, rarity: 'free' },
  { id: 'bg-sky', name: 'Sky', value: '38bdf8', cost: 25, rarity: 'common' },
  { id: 'bg-cyan', name: 'Cyan', value: '22d3d8', cost: 30, rarity: 'common' },
  { id: 'bg-teal', name: 'Teal', value: '2dd4bf', cost: 30, rarity: 'common' },
  { id: 'bg-emerald', name: 'Emerald', value: '34d399', cost: 25, rarity: 'common' },
  { id: 'bg-green', name: 'Green', value: '4ade80', cost: 0, rarity: 'free' },
  { id: 'bg-lime', name: 'Lime', value: 'a3e635', cost: 25, rarity: 'common' },
  { id: 'bg-yellow', name: 'Yellow', value: 'facc15', cost: 25, rarity: 'common' },
  { id: 'bg-amber', name: 'Amber', value: 'fbbf24', cost: 25, rarity: 'common' },
  { id: 'bg-orange', name: 'Orange', value: 'fb923c', cost: 25, rarity: 'common' },
  { id: 'bg-red', name: 'Red', value: 'f87171', cost: 30, rarity: 'common' },
  { id: 'bg-gold', name: 'Gold Shimmer', value: 'fcd34d', cost: 100, rarity: 'epic' },
  { id: 'bg-rainbow', name: 'Rainbow', value: 'gradient', cost: 200, rarity: 'legendary' },
  { id: 'bg-galaxy', name: 'Galaxy', value: '1e1b4b', cost: 150, rarity: 'epic' },
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
   * Get all available styles with ownership status
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

    return AVATAR_STYLES.map(style => ({
      ...style,
      owned: style.cost === 0 || ownedStyles.includes(style.id),
      canAfford: user.points >= style.cost,
      equipped: user.avatarStyle === style.id,
    }));
  }

  /**
   * Get all available background colors with ownership status
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

    return BACKGROUND_COLORS.map(bg => ({
      ...bg,
      owned: bg.cost === 0 || ownedBackgrounds.includes(bg.value),
      canAfford: user.points >= bg.cost,
      equipped: user.avatarColor === `#${bg.value}` || user.avatarColor === bg.value,
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
      if (styleInfo.cost > 0) {
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
      if (bgInfo && bgInfo.cost > 0) {
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
}