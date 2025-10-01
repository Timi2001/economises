# Technical Architecture - Economises Blog

## System Overview

The Economises Blog is built as a modern, full-stack web application using a microservices-inspired architecture with clear separation between frontend, backend, and data layers.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Next.js Frontend (SSR/SSG)                                │
│  ├── Public Blog Interface                                  │
│  ├── Admin Dashboard                                        │
│  ├── Authentication UI                                      │
│  └── Real-time Features (WebSocket)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         API LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  tRPC API Server                                            │
│  ├── Authentication & Authorization                         │
│  ├── Posts & Content Management                            │
│  ├── User & Role Management                                │
│  ├── Media & File Handling                                 │
│  ├── Comments & Moderation                                 │
│  └── Analytics & Reporting                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Services                                    │
│  ├── Content Processing                                     │
│  ├── Email Service                                         │
│  ├── Search Service                                        │
│  ├── AI Integration                                        │
│  └── Notification Service                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database (Prisma ORM)                          │
│  ├── User Data & Authentication                            │
│  ├── Content & Media                                       │
│  ├── Comments & Interactions                               │
│  └── Analytics & Audit Logs                               │
│                                                             │
│  Redis Cache                                               │
│  ├── Session Storage                                       │
│  ├── API Response Caching                                 │
│  └── Real-time Data                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
├─────────────────────────────────────────────────────────────┤
│  ├── Cloudinary (Media Storage & CDN)                      │
│  ├── Resend (Email Service)                               │
│  ├── OpenAI (AI Content Assistance)                       │
│  ├── Vercel Analytics (Performance Monitoring)            │
│  └── GitHub Actions (CI/CD)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand + React Query (TanStack Query)
- **Authentication**: NextAuth.js with JWT
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation

### Backend
- **API Framework**: tRPC with Express.js
- **Language**: TypeScript/Node.js
- **Database ORM**: Prisma
- **Validation**: Zod schemas
- **Authentication**: JWT with refresh tokens
- **File Upload**: Multer + Cloudinary
- **Email**: Resend API
- **Caching**: Redis

### Database
- **Primary Database**: PostgreSQL
- **Cache**: Redis
- **Search**: PostgreSQL Full-Text Search + AI embeddings
- **File Storage**: Cloudinary CDN

### DevOps & Deployment
- **Hosting**: Vercel (Frontend) + Railway/DigitalOcean (Backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics + Sentry
- **Domain & SSL**: Vercel/Cloudflare

---

## Database Schema Design

### Core Entities

#### Users Table
```sql
users {
  id: UUID (Primary Key)
  email: String (Unique)
  username: String (Unique)
  password_hash: String
  first_name: String
  last_name: String
  avatar_url: String?
  bio: Text?
  role: Enum (ADMIN, EDITOR, AUTHOR, CONTRIBUTOR, SUBSCRIBER)
  email_verified: Boolean
  is_active: Boolean
  created_at: DateTime
  updated_at: DateTime
  last_login: DateTime?
}
```

#### Posts Table
```sql
posts {
  id: UUID (Primary Key)
  title: String
  slug: String (Unique)
  content: Text
  excerpt: String?
  featured_image: String?
  status: Enum (DRAFT, PUBLISHED, SCHEDULED, ARCHIVED)
  published_at: DateTime?
  scheduled_at: DateTime?
  author_id: UUID (Foreign Key -> users.id)
  category_id: UUID? (Foreign Key -> categories.id)
  view_count: Integer (Default: 0)
  like_count: Integer (Default: 0)
  seo_title: String?
  seo_description: String?
  created_at: DateTime
  updated_at: DateTime
}
```

#### Categories Table
```sql
categories {
  id: UUID (Primary Key)
  name: String (Unique)
  slug: String (Unique)
  description: Text?
  color: String?
  parent_id: UUID? (Foreign Key -> categories.id)
  created_at: DateTime
  updated_at: DateTime
}
```

#### Tags Table
```sql
tags {
  id: UUID (Primary Key)
  name: String (Unique)
  slug: String (Unique)
  description: Text?
  created_at: DateTime
  updated_at: DateTime
}
```

#### Comments Table
```sql
comments {
  id: UUID (Primary Key)
  content: Text
  author_id: UUID? (Foreign Key -> users.id)
  author_name: String? (For guest comments)
  author_email: String? (For guest comments)
  post_id: UUID (Foreign Key -> posts.id)
  parent_id: UUID? (Foreign Key -> comments.id)
  status: Enum (PENDING, APPROVED, REJECTED, SPAM)
  ip_address: String?
  user_agent: String?
  created_at: DateTime
  updated_at: DateTime
}
```

#### Media Table
```sql
media {
  id: UUID (Primary Key)
  filename: String
  original_name: String
  mime_type: String
  size: Integer
  url: String
  thumbnail_url: String?
  alt_text: String?
  caption: String?
  uploaded_by: UUID (Foreign Key -> users.id)
  created_at: DateTime
  updated_at: DateTime
}
```

### Relationship Tables

#### Post Tags (Many-to-Many)
```sql
post_tags {
  post_id: UUID (Foreign Key -> posts.id)
  tag_id: UUID (Foreign Key -> tags.id)
  created_at: DateTime
}
```

#### User Sessions
```sql
user_sessions {
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key -> users.id)
  token: String (Unique)
  refresh_token: String (Unique)
  expires_at: DateTime
  created_at: DateTime
  updated_at: DateTime
}
```

### System Tables

#### Settings
```sql
settings {
  id: UUID (Primary Key)
  key: String (Unique)
  value: Text
  type: Enum (STRING, NUMBER, BOOLEAN, JSON)
  description: String?
  created_at: DateTime
  updated_at: DateTime
}
```

#### Audit Logs
```sql
audit_logs {
  id: UUID (Primary Key)
  user_id: UUID? (Foreign Key -> users.id)
  action: String
  entity_type: String
  entity_id: UUID?
  old_values: JSON?
  new_values: JSON?
  ip_address: String?
  user_agent: String?
  created_at: DateTime
}
```

---

## API Design

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation

### Posts Endpoints
- `GET /posts` - List posts (with pagination, filtering)
- `GET /posts/:slug` - Get single post
- `POST /posts` - Create new post (authenticated)
- `PUT /posts/:id` - Update post (authenticated)
- `DELETE /posts/:id` - Delete post (authenticated)
- `POST /posts/:id/like` - Like/unlike post

### Users Endpoints
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `GET /users` - List users (admin only)
- `PUT /users/:id/role` - Update user role (admin only)

### Comments Endpoints
- `GET /posts/:id/comments` - Get post comments
- `POST /posts/:id/comments` - Create comment
- `PUT /comments/:id` - Update comment (author/admin)
- `DELETE /comments/:id` - Delete comment (author/admin)
- `POST /comments/:id/moderate` - Moderate comment (admin)

### Media Endpoints
- `POST /media/upload` - Upload media file
- `GET /media` - List media files
- `DELETE /media/:id` - Delete media file

---

## Security Architecture

### Authentication & Authorization
- JWT tokens with refresh token rotation
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Rate limiting on authentication endpoints
- Account lockout after failed attempts

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention via Prisma ORM
- XSS protection with content sanitization
- CSRF protection with tokens
- HTTPS enforcement

### Privacy & Compliance
- GDPR compliance features
- Data retention policies
- User data export/deletion
- Cookie consent management
- Privacy policy enforcement

---

## Performance Optimization

### Caching Strategy
- **Browser Caching**: Static assets with long-term caching
- **CDN Caching**: Media files via Cloudinary
- **API Caching**: Redis for frequently accessed data
- **Database Caching**: Query result caching
- **Page Caching**: Next.js ISR for static content

### Database Optimization
- Proper indexing on frequently queried fields
- Database connection pooling
- Query optimization and monitoring
- Read replicas for scaling (future)

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization with Next.js Image
- Bundle size optimization
- Critical CSS inlining
- Service worker for offline functionality

---

## Monitoring & Analytics

### Application Monitoring
- Error tracking with Sentry
- Performance monitoring with Vercel Analytics
- Uptime monitoring
- Database performance monitoring
- API response time tracking

### Business Analytics
- User engagement metrics
- Content performance analytics
- Traffic source analysis
- Conversion tracking
- A/B testing framework

---

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- CDN for global content delivery
- Load balancing (future)
- Microservices architecture (future)

### Vertical Scaling
- Database optimization
- Caching layers
- Code optimization
- Resource monitoring
- Auto-scaling capabilities

---

This architecture provides a solid foundation for building a scalable, secure, and performant blog platform that can grow with user needs and traffic demands.