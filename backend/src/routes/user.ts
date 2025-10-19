import { router, publicProcedure } from '../trpc/trpc';
import { z } from 'zod';

const userSelect = {
  id: true,
  email: true,
  username: true,
  firstName: true,
  lastName: true,
  bio: true,
  avatar: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userRouter = router({
  // Get all users (admin only - TODO: add auth)
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, offset, search } = input;

      const where = search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' as const } },
              { username: { contains: search, mode: 'insensitive' as const } },
              { firstName: { contains: search, mode: 'insensitive' as const } },
              { lastName: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const [users, total] = await Promise.all([
        ctx.prisma.user.findMany({
          where,
          select: userSelect,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        ctx.prisma.user.count({ where }),
      ]);

      return { users, total, hasMore: offset + limit < total };
    }),

  // Get user by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        select: userSelect,
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    }),

  // Create user
  create: publicProcedure
    .input(z.object({
      email: z.string().email(),
      username: z.string().min(3).max(50).optional(),
      password: z.string().min(6),
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(1).max(50).optional(),
      bio: z.string().max(500).optional(),
      role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR', 'CONTRIBUTOR', 'SUBSCRIBER']).default('SUBSCRIBER'),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Hash password
      const user = await ctx.prisma.user.create({
        data: {
          ...input,
          password: input.password, // TODO: Hash this
        },
        select: userSelect,
      });

      return user;
    }),

  // Update user
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      email: z.string().email().optional(),
      username: z.string().min(3).max(50).optional(),
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(1).max(50).optional(),
      bio: z.string().max(500).optional(),
      avatar: z.string().url().optional(),
      role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR', 'CONTRIBUTOR', 'SUBSCRIBER']).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const user = await ctx.prisma.user.update({
        where: { id },
        data: updateData,
        select: userSelect,
      });

      return user;
    }),

  // Delete user
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
