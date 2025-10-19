import { router, publicProcedure } from '../trpc/trpc';
import { z } from 'zod';

const postSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  featuredImage: true,
  status: true,
  publishedAt: true,
  scheduledAt: true,
  metaTitle: true,
  metaDescription: true,
  canonicalUrl: true,
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
  categories: {
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
    },
  },
  tags: {
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
    },
  },
  _count: {
    select: {
      comments: true,
    },
  },
} as const;

export const postRouter = router({
  // Get all posts with filtering
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
      status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
      authorId: z.string().optional(),
      categoryId: z.string().optional(),
      tagId: z.string().optional(),
      search: z.string().optional(),
      published: z.boolean().optional(), // Only published posts
    }))
    .query(async ({ ctx, input }) => {
      const { limit, offset, status, authorId, categoryId, tagId, search, published } = input;

      const where: any = {};

      if (status) where.status = status;
      if (authorId) where.authorId = authorId;
      if (published) {
        where.status = 'PUBLISHED';
        where.publishedAt = { lte: new Date() };
      }

      if (categoryId) {
        where.categories = {
          some: { id: categoryId },
        };
      }

      if (tagId) {
        where.tags = {
          some: { id: tagId },
        };
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
          { excerpt: { contains: search, mode: 'insensitive' as const } },
        ];
      }

      const [posts, total] = await Promise.all([
        ctx.prisma.post.findMany({
          where,
          select: postSelect,
          take: limit,
          skip: offset,
          orderBy: published ? { publishedAt: 'desc' } : { createdAt: 'desc' },
        }),
        ctx.prisma.post.count({ where }),
      ]);

      return { posts, total, hasMore: offset + limit < total };
    }),

  // Get post by ID or slug
  getById: publicProcedure
    .input(z.object({ id: z.string().optional(), slug: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.id && !input.slug) {
        throw new Error('Either id or slug must be provided');
      }

      const where = input.id ? { id: input.id } : { slug: input.slug };

      const post = await ctx.prisma.post.findUnique({
        where,
        select: postSelect,
      });

      if (!post) {
        throw new Error('Post not found');
      }

      return post;
    }),

  // Create post
  create: publicProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      slug: z.string().min(1).max(200),
      excerpt: z.string().max(500).optional(),
      content: z.string().optional(),
      featuredImage: z.string().url().optional(),
      status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
      publishedAt: z.date().optional(),
      scheduledAt: z.date().optional(),
      metaTitle: z.string().max(60).optional(),
      metaDescription: z.string().max(160).optional(),
      canonicalUrl: z.string().url().optional(),
      authorId: z.string(),
      categoryIds: z.array(z.string()).optional(),
      tagIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { categoryIds, tagIds, ...postData } = input;

      const post = await ctx.prisma.post.create({
        data: {
          ...postData,
          categories: categoryIds ? {
            connect: categoryIds.map(id => ({ id })),
          } : undefined,
          tags: tagIds ? {
            connect: tagIds.map(id => ({ id })),
          } : undefined,
        },
        select: postSelect,
      });

      return post;
    }),

  // Update post
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).max(200).optional(),
      slug: z.string().min(1).max(200).optional(),
      excerpt: z.string().max(500).optional(),
      content: z.string().optional(),
      featuredImage: z.string().url().optional(),
      status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
      publishedAt: z.date().optional(),
      scheduledAt: z.date().optional(),
      metaTitle: z.string().max(60).optional(),
      metaDescription: z.string().max(160).optional(),
      canonicalUrl: z.string().url().optional(),
      categoryIds: z.array(z.string()).optional(),
      tagIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, categoryIds, tagIds, ...updateData } = input;

      const post = await ctx.prisma.post.update({
        where: { id },
        data: {
          ...updateData,
          categories: categoryIds ? {
            set: categoryIds.map(id => ({ id })),
          } : undefined,
          tags: tagIds ? {
            set: tagIds.map(id => ({ id })),
          } : undefined,
        },
        select: postSelect,
      });

      return post;
    }),

  // Delete post
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.post.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
