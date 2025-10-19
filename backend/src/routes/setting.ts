import { router, publicProcedure } from '../trpc/trpc';
import { z } from 'zod';

export const settingRouter = router({
  // Get all settings
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const settings = await ctx.prisma.setting.findMany({
        select: {
          key: true,
          value: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { key: 'asc' },
      });

      // Convert to key-value object
      const settingsObj: Record<string, string> = {};
      settings.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });

      return settingsObj;
    }),

  // Get setting by key
  getByKey: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
      const setting = await ctx.prisma.setting.findUnique({
        where: { key: input.key },
        select: {
          key: true,
          value: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return setting;
    }),

  // Set setting (create or update)
  set: publicProcedure
    .input(z.object({
      key: z.string(),
      value: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { key, value } = input;

      const setting = await ctx.prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
        select: {
          key: true,
          value: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return setting;
    }),

  // Set multiple settings
  setMany: publicProcedure
    .input(z.array(z.object({
      key: z.string(),
      value: z.string(),
    })))
    .mutation(async ({ ctx, input }) => {
      const results = await Promise.all(
        input.map(({ key, value }) =>
          ctx.prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
            select: {
              key: true,
              value: true,
            },
          })
        )
      );

      return results;
    }),

  // Delete setting
  delete: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.setting.delete({
        where: { key: input.key },
      });

      return { success: true };
    }),
});
