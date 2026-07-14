/**
 * Prisma Client singleton — shared across the entire server
 * Alternates between real Prisma client and in-memory mock client based on USE_MOCK_DB.
 */

const { PrismaClient } = require('@prisma/client');
const mockPrisma = require('./mockPrisma');

let prisma;

if (process.env.USE_MOCK_DB === 'true') {
  console.log('\n------------------------------------------------------------');
  console.log('⚠️  DATABASE WARNING: USE_MOCK_DB=true is enabled.');
  console.log('🔗 Running in MOCK IN-MEMORY DATABASE mode (PostgreSQL bypassed).');
  console.log('------------------------------------------------------------\n');
  prisma = mockPrisma;
} else {
  const globalForPrisma = globalThis;
  prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
}

module.exports = prisma;
