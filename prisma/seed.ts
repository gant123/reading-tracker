import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

// Global augmentation to prevent multiple instances in development
const globalForPrisma = global as unknown as { 
  prisma: PrismaClient;
  pool: Pool;
};

// 1. Create or reuse the Postgres Pool
const pool = globalForPrisma.pool || new Pool({ 
  connectionString,
  max: 10, // Limit connections per pool
  idleTimeoutMillis: 30000 
});

// 2. Create the Adapter
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter});

async function main() {
  console.log('🌱 Seeding Achievements...');

  const achievements = [
    // --- Books Read (Type: BOOKS_READ) ---
    { name: 'First Steps', description: 'Read your first book', icon: '📖', requirement: 1, type: 'BOOKS_READ' },
    { name: 'Book Worm', description: 'Read 5 books', icon: '🐛', requirement: 5, type: 'BOOKS_READ' },
    { name: 'Library Legend', description: 'Read 10 books', icon: '🏰', requirement: 10, type: 'BOOKS_READ' },
    { name: 'Master Scholar', description: 'Read 25 books', icon: '🧙‍♂️', requirement: 25, type: 'BOOKS_READ' },

    // --- Total Minutes (Type: TOTAL_MINUTES) ---
    { name: 'Hour Power', description: 'Read for 1 hour total', icon: '⚡', requirement: 60, type: 'TOTAL_MINUTES' },
    { name: 'Dedicated Reader', description: 'Read for 5 hours total', icon: '🥉', requirement: 300, type: 'TOTAL_MINUTES' },
    { name: 'Story Explorer', description: 'Read for 10 hours total', icon: '🥈', requirement: 600, type: 'TOTAL_MINUTES' },
    { name: 'Time Traveler', description: 'Read for 20 hours total', icon: '🥇', requirement: 1200, type: 'TOTAL_MINUTES' },

    // --- Streaks (Type: STREAK) ---
    { name: 'Heating Up', description: '3-day reading streak', icon: '🔥', requirement: 3, type: 'STREAK' },
    { name: 'On Fire', description: '7-day reading streak', icon: '🚀', requirement: 7, type: 'STREAK' },
    { name: 'Unstoppable', description: '30-day reading streak', icon: '👑', requirement: 30, type: 'STREAK' },

    // --- Special Sessions (Type: SESSION_DURATION) ---
    { name: 'Deep Focus', description: 'Read for 30 minutes in one sitting', icon: '🧘', requirement: 30, type: 'SESSION_DURATION' },
    { name: 'Marathoner', description: 'Read for 60 minutes in one sitting', icon: '🏃‍♂️', requirement: 60, type: 'SESSION_DURATION' },
  ];

  for (const achievement of achievements) {
    // We use upsert so we can run this multiple times without errors
    // If an achievement with this name exists, we update its details
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: achievement,
      create: achievement,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });