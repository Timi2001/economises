import { router, publicProcedure } from '../trpc/trpc';
import { z } from 'zod';

export const mediaRouter = router({
  // Get all media
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
      uploadedById: z.string().optional(),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, offset, uploadedById, search } = input;

      const where: any = {};
      if (uploadedById) where.uploadedById = uploadedById;
      if (search) {
        where.OR = [
          { filename: { contains: search, mode: 'insensitive' as const } },
          { originalName: { contains: search, mode: 'insensitive' as const } },
          { alt: { contains: search, mode: 'insensitive' as const } },
          { caption: { contains: search, mode: 'insensitive' as const } },
        ];
      }

      const [media, total] = await Promise.all([
        ctx.prisma.media.findMany({
          where,
          select: {
            id: true,
            filename: true,
            originalName: true,
            mimeType: true,
            size: true,
            url: true,
            alt: true,
            caption: true,
            createdAt: true,
            uploadedBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        ctx.prisma.media.count({ where }),
      ]);

      return { media, total, hasMore: offset + limit < total };
    }),

  // Get media by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const media = await ctx.prisma.media.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          filename: true,
          originalName: true,
          mimeType: true,
          size: true,
          url: true,
          alt: true,
          caption: true,
          createdAt: true,
          uploadedBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!media) {
        throw new Error('Media not found');
      }

      return media;
    }),

  // Create media
  create: publicProcedure
    .input(z.object({
      filename: z.string(),
      originalName: z.string(),
      mimeType: z.string(),
      size: z.number().int().positive(),
      url: z.string().url(),
      alt: z.string().optional(),
      caption: z.string().optional(),
      uploadedById: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const media = await ctx.prisma.media.create({
        data: input,
        select: {
          id: true,
          filename: true,
          originalName: true,
          mimeType: true,
          size: true,
          url: true,
          alt: true,
          caption: true,
          createdAt: true,
        },
      });

      return media;
    }),

  // Update media
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      alt: z.string().optional(),
      caption: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const media = await ctx.prisma.media.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          filename: true,
          originalName: true,
          mimeType: true,
          size: true,
          url: true,
          alt: true,
          caption: true,
          createdAt: true,
        },
      });

      return media;
    }),

  // Delete media
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.media.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
