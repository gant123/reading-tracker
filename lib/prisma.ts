// lib/prisma.ts
import { PrismaClient } from '@/app/generated/prisma/client';
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

// 3. Create or reuse the Prisma Client
export const prisma = globalForPrisma.prisma || new PrismaClient({ 
  adapter 
});

// 4. Save to global scope in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}