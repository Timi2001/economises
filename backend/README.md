# Economises Blog - Backend

Express.js backend with tRPC API, Prisma ORM, and PostgreSQL database.

## Tech Stack

- **Framework**: Express.js with TypeScript
- **API**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod schemas

## Setup

1. **Install dependencies**:
   ```bash
   cd backend
   pnpm install
   ```

2. **Environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other settings
   ```

3. **Database setup**:
   ```bash
   # Generate Prisma client
   pnpm db:generate

   # Push schema to database (for development)
   pnpm db:push

   # Or create a migration (for production)
   pnpm db:migrate

   # Seed with sample data
   pnpm db:seed
   ```

4. **Start development server**:
   ```bash
   pnpm dev
   ```

The server will run on `http://localhost:4000`

## API Endpoints

- **Health check**: `GET /health`
- **tRPC API**: `POST /trpc/*`

## Available tRPC Routes

### Users
- `user.getAll` - Get all users with pagination
- `user.getById` - Get user by ID
- `user.create` - Create new user
- `user.update` - Update user
- `user.delete` - Delete user

### Posts
- `post.getAll` - Get posts with filtering/pagination
- `post.getById` - Get post by ID or slug
- `post.create` - Create new post
- `post.update` - Update post
- `post.delete` - Delete post

### Comments
- `comment.getByPost` - Get comments for a post
- `comment.getAll` - Get all comments (admin)
- `comment.create` - Create comment
- `comment.updateStatus` - Update comment status
- `comment.delete` - Delete comment

### Categories
- `category.getAll` - Get all categories
- `category.getById` - Get category by ID or slug
- `category.create` - Create category
- `category.update` - Update category
- `category.delete` - Delete category

### Tags
- `tag.getAll` - Get all tags
- `tag.getById` - Get tag by ID or slug
- `tag.create` - Create tag
- `tag.update` - Update tag
- `tag.delete` - Delete tag

### Media
- `media.getAll` - Get all media files
- `media.getById` - Get media by ID
- `media.create` - Create media record
- `media.update` - Update media metadata
- `media.delete` - Delete media

### Settings
- `setting.getAll` - Get all settings
- `setting.getByKey` - Get setting by key
- `setting.set` - Set single setting
- `setting.setMany` - Set multiple settings
- `setting.delete` - Delete setting

## Database Schema

The database includes the following entities:

- **Users**: User accounts with role-based permissions
- **Posts**: Blog posts with rich content and metadata
- **Comments**: Nested comments system with moderation
- **Categories**: Post categorization
- **Tags**: Post tagging system
- **Media**: File uploads and media management
- **Settings**: Site-wide configuration

## Development

### Database Management

```bash
# View database in browser
pnpm db:studio

# Reset database and re-seed
pnpm db:reset

# Create new migration
pnpm db:migrate
```

### Testing

```bash
# Run tests
pnpm test

# Run single test
pnpm test -- <test-file>

# Run tests in watch mode
pnpm test -- --watch
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `4000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `JWT_SECRET` | JWT signing secret | Required |

## Sample Data

After running `pnpm db:seed`, you'll have:

- Admin user: `admin@economises.blog` / `admin123`
- Sample categories: Technology, Lifestyle, Business
- Sample tags: Tutorial, Opinion, News
- Sample posts with comments
- Basic site settings

## Next Steps

1. **Authentication**: Implement JWT authentication middleware
2. **File Uploads**: Add media upload endpoints
3. **Email Service**: Integrate email notifications
4. **Caching**: Add Redis for performance
5. **Testing**: Add comprehensive test coverage
