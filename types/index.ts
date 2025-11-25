import { User, Book, ReadingSession, Achievement, Reward } from '@prisma/client';

export type UserRole = 'PARENT' | 'CHILD';
export type BookStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type RewardStatus = 'AVAILABLE' | 'REDEEMED' | 'COMPLETED';

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