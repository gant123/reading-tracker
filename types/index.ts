import { User, Book, ReadingSession, Achievement, Reward, AvatarItem, UserAvatarItem } from '@/app/generated/prisma/client';
export type UserRole = 'PARENT' | 'CHILD';
export type BookStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type RewardStatus = 'AVAILABLE' | 'REDEEMED' | 'COMPLETED';
export type AvatarRarity = 'free' | 'common' | 'rare' | 'epic' | 'legendary';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  parentId?: string | null;
}

export interface BookWithSessions extends Book {
  sessions?: ReadingSession[];
}

export interface SessionWithBook extends ReadingSession {
  book: Book;
}

export interface UserWithRelations extends User {
  books?: Book[];
  sessions?: ReadingSession[];
  achievements?: Achievement[];
  avatarItems?: UserAvatarItem[];
}

export interface RewardWithAffordability extends Reward {
  canAfford?: boolean;
}

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    pageCount?: number;
    description?: string;
  };
}

export interface TimerState {
  isRunning: boolean;
  elapsedSeconds: number;
  startTime: Date | null;
}

export interface BookInput {
  title: string;
  author: string;
  coverUrl?: string;
  googleBooksId?: string;
  pageCount?: number;
  description?: string;
}

export interface SessionInput {
  bookId: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  notes?: string;
}

export interface RewardInput {
  title: string;
  description: string;
  pointsCost: number;
  icon: string;
}

export interface AvatarStyleInfo {
  id: string;
  name: string;
  description: string;
  previewSeed: string;
  cost: number;
  rarity: AvatarRarity;
  owned: boolean;
  canAfford: boolean;
  equipped: boolean;
}

export interface AvatarBackgroundInfo {
  id: string;
  name: string;
  value: string;
  cost: number;
  rarity: AvatarRarity;
  owned: boolean;
  canAfford: boolean;
  equipped: boolean;
}

export interface UserAvatarData {
  id: string;
  name: string;
  avatarStyle: string;
  avatarSeed: string | null;
  avatarColor: string;
  points: number;
  avatarItems: (UserAvatarItem & { item: AvatarItem })[];
}

declare module 'next-auth' {
  interface Session {
    user: SessionUser;
  }

  interface User {
    id: string;
    role: UserRole;
    parentId?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    parentId?: string | null;
  }
}