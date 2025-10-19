import { router, publicProcedure } from '../trpc/trpc';
import { z } from 'zod';

export const categoryRouter = router({
  // Get all categories
  getAll: publicProcedure
    .input(z.object({
      activeOnly: z.boolean().default(true),
    }))
    .query(async ({ ctx, input }) => {
      const categories = await ctx.prisma.category.findMany({
        where: input.activeOnly ? { isActive: true } : {},
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          color: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: { posts: true },
          },
        },
        orderBy: { name: 'asc' },
      });

      return categories;
    }),

  // Get category by ID or slug
  getById: publicProcedure
    .input(z.object({ id: z.string().optional(), slug: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.id && !input.slug) {
        throw new Error('Either id or slug must be provided');
      }

      const where = input.id ? { id: input.id } : { slug: input.slug };

      const category = await ctx.prisma.category.findUnique({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          color: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: { posts: true },
          },
        },
      });

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    }),

  // Create category
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(50),
      slug: z.string().min(1).max(50),
      description: z.string().max(200).optional(),
      color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      isActive: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.create({
        data: input,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          color: true,
          isActive: true,
          createdAt: true,
        },
      });

      return category;
    }),

  // Update category
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(50).optional(),
      slug: z.string().min(1).max(50).optional(),
      description: z.string().max(200).optional(),
      color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const category = await ctx.prisma.category.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          color: true,
          isActive: true,
          createdAt: true,
        },
      });

      return category;
    }),

  // Delete category
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.category.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
