import { router, publicProcedure } from '../trpc/trpc';
import { z } from 'zod';

export const tagRouter = router({
  // Get all tags
  getAll: publicProcedure
    .input(z.object({
      activeOnly: z.boolean().default(true),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ ctx, input }) => {
      const tags = await ctx.prisma.tag.findMany({
        where: input.activeOnly ? { isActive: true } : {},
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: { posts: true },
          },
        },
        take: input.limit,
        orderBy: { name: 'asc' },
      });

      return tags;
    }),

  // Get tag by ID or slug
  getById: publicProcedure
    .input(z.object({ id: z.string().optional(), slug: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.id && !input.slug) {
        throw new Error('Either id or slug must be provided');
      }

      const where = input.id ? { id: input.id } : { slug: input.slug };

      const tag = await ctx.prisma.tag.findUnique({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: { posts: true },
          },
        },
      });

      if (!tag) {
        throw new Error('Tag not found');
      }

      return tag;
    }),

  // Create tag
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(50),
      slug: z.string().min(1).max(50),
      color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      isActive: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const tag = await ctx.prisma.tag.create({
        data: input,
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          isActive: true,
          createdAt: true,
        },
      });

      return tag;
    }),

  // Update tag
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(50).optional(),
      slug: z.string().min(1).max(50).optional(),
      color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const tag = await ctx.prisma.tag.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          isActive: true,
          createdAt: true,
        },
      });

      return tag;
    }),

  // Delete tag
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.tag.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
