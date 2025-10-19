import { router, publicProcedure } from '../trpc/trpc';
import { z } from 'zod';

const commentSelect = {
  id: true,
  content: true,
  status: true,
  authorName: true,
  authorEmail: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  },
  post: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
  replies: {
    select: {
      id: true,
      content: true,
      status: true,
      authorName: true,
      authorEmail: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  },
} as const;

export const commentRouter = router({
  // Get comments for a post
  getByPost: publicProcedure
    .input(z.object({
      postId: z.string(),
      status: z.enum(['PENDING', 'APPROVED', 'SPAM', 'TRASH']).optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const { postId, status, limit, offset } = input;

      const where: any = { postId, parentId: null }; // Only top-level comments
      if (status) where.status = status;

      const [comments, total] = await Promise.all([
        ctx.prisma.comment.findMany({
          where,
          select: commentSelect,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'asc' },
        }),
        ctx.prisma.comment.count({ where }),
      ]);

      return { comments, total, hasMore: offset + limit < total };
    }),

  // Get all comments (admin)
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
      status: z.enum(['PENDING', 'APPROVED', 'SPAM', 'TRASH']).optional(),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, offset, status, search } = input;

      const where: any = {};
      if (status) where.status = status;
      if (search) {
        where.OR = [
          { content: { contains: search, mode: 'insensitive' as const } },
          { authorName: { contains: search, mode: 'insensitive' as const } },
          { authorEmail: { contains: search, mode: 'insensitive' as const } },
        ];
      }

      const [comments, total] = await Promise.all([
        ctx.prisma.comment.findMany({
          where,
          select: commentSelect,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        ctx.prisma.comment.count({ where }),
      ]);

      return { comments, total, hasMore: offset + limit < total };
    }),

  // Create comment
  create: publicProcedure
    .input(z.object({
      postId: z.string(),
      content: z.string().min(1).max(2000),
      authorName: z.string().min(1).max(100).optional(),
      authorEmail: z.string().email().optional(),
      authorId: z.string().optional(),
      parentId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: input,
        select: commentSelect,
      });

      return comment;
    }),

  // Update comment status
  updateStatus: publicProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['PENDING', 'APPROVED', 'SPAM', 'TRASH']),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;

      const comment = await ctx.prisma.comment.update({
        where: { id },
        data: { status },
        select: commentSelect,
      });

      return comment;
    }),

  // Delete comment
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.comment.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
