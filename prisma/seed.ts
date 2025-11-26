import { PrismaClient } from "@/app/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create achievements okwe up
  const achievements = [
    {
      name: 'First Steps',
      description: 'Read for 30 minutes',
      icon: '📖',
      requirement: 30,
      type: 'MINUTES',
    },
    {
      name: 'Bookworm',
      description: 'Read for 100 minutes',
      icon: '🐛',
      requirement: 100,
      type: 'MINUTES',
    },
    {
      name: 'Reading Champion',
      description: 'Read for 500 minutes',
      icon: '🏆',
      requirement: 500,
      type: 'MINUTES',
    },
    {
      name: 'Page Turner',
      description: 'Read for 1000 minutes',
      icon: '📚',
      requirement: 1000,
      type: 'MINUTES',
    },
    {
      name: '3-Day Streak',
      description: 'Read for 3 days in a row',
      icon: '🔥',
      requirement: 3,
      type: 'STREAK',
    },
    {
      name: 'Week Warrior',
      description: 'Read for 7 days in a row',
      icon: '⚡',
      requirement: 7,
      type: 'STREAK',
    },
    {
      name: 'Book Collector',
      description: 'Add 5 books to your library',
      icon: '📕',
      requirement: 5,
      type: 'BOOKS',
    },
    {
      name: 'Library Master',
      description: 'Add 20 books to your library',
      icon: '📚',
      requirement: 20,
      type: 'BOOKS',
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });