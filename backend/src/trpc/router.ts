import { router } from './trpc';
import { userRouter } from '../routes/user';
import { postRouter } from '../routes/post';
import { commentRouter } from '../routes/comment';
import { categoryRouter } from '../routes/category';
import { tagRouter } from '../routes/tag';
import { mediaRouter } from '../routes/media';
import { settingRouter } from '../routes/setting';

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
  category: categoryRouter,
  tag: tagRouter,
  media: mediaRouter,
  setting: settingRouter,
});

export type AppRouter = typeof appRouter;
