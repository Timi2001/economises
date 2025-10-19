import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function createContext({ req, res }: CreateExpressContextOptions) {
  return {
    req,
    res,
    prisma,
    // TODO: Add user context after implementing auth
    user: null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
