// services/levelService.ts
import { prisma } from '@/lib/prisma';

export interface LevelData {
  level: number;
  title: string;
  nextLevelTitle: string | null;
  currentXp: number; // Based on totalMinutes
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercentage: number;
  minutesToNextLevel: number;
}

// Define the Level Curve
// XP = Minutes read
export const LEVELS = [
  { level: 1, minMinutes: 0, title: 'Page Turner' },
  { level: 2, minMinutes: 60, title: 'Chapter Chaser' },      // 1 hour
  { level: 3, minMinutes: 180, title: 'Bookworm' },            // 3 hours
  { level: 4, minMinutes: 360, title: 'Story Seeker' },        // 6 hours
  { level: 5, minMinutes: 600, title: 'Library Explorer' },    // 10 hours
  { level: 6, minMinutes: 900, title: 'Fiction Fanatic' },     // 15 hours
  { level: 7, minMinutes: 1260, title: 'Novel Navigator' },    // 21 hours
  { level: 8, minMinutes: 1680, title: 'Literature Legend' },  // 28 hours
  { level: 9, minMinutes: 2160, title: 'Master Reader' },      // 36 hours
  { level: 10, minMinutes: 3000, title: 'Grand Scholar' },     // 50 hours
];

export class LevelService {
  static calculateLevel(totalMinutes: number): LevelData {
    let currentLevel = LEVELS[0];
    let nextLevel = LEVELS[1];

    // Find the highest level achieved
    for (let i = 0; i < LEVELS.length; i++) {
      if (totalMinutes >= LEVELS[i].minMinutes) {
        currentLevel = LEVELS[i];
        nextLevel = LEVELS[i + 1] || null;
      } else {
        break;
      }
    }

    // Handle Max Level
    if (!nextLevel) {
      return {
        level: currentLevel.level,
        title: currentLevel.title,
        nextLevelTitle: null,
        currentXp: totalMinutes,
        xpForCurrentLevel: currentLevel.minMinutes,
        xpForNextLevel: currentLevel.minMinutes, // Cap it
        progressPercentage: 100,
        minutesToNextLevel: 0,
      };
    }

    // Calculate Progress
    const xpInLevel = totalMinutes - currentLevel.minMinutes;
    const xpNeededForLevel = nextLevel.minMinutes - currentLevel.minMinutes;
    const progressPercentage = Math.min(100, Math.max(0, (xpInLevel / xpNeededForLevel) * 100));

    return {
      level: currentLevel.level,
      title: currentLevel.title,
      nextLevelTitle: nextLevel.title,
      currentXp: totalMinutes,
      xpForCurrentLevel: currentLevel.minMinutes,
      xpForNextLevel: nextLevel.minMinutes,
      progressPercentage,
      minutesToNextLevel: nextLevel.minMinutes - totalMinutes,
    };
  }
}