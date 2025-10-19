# AGENTS.md - Economises Blog Development Guide

## Build/Lint/Test Commands

### Workspace Commands (Root Level)
- **Development**: `pnpm dev` - Runs both frontend and backend in development mode
- **Build**: `pnpm build` - Builds frontend then backend for production
- **Start**: `pnpm start` - Starts the production frontend server
- **Lint**: `pnpm lint` - Runs ESLint on both frontend and backend
- **Format**: `pnpm format` - Formats code with Prettier across the workspace
- **Test**: `pnpm test` - Runs tests in both frontend and backend

### Frontend Commands (Next.js)
- **Development**: `cd frontend && pnpm dev` - Starts Next.js dev server
- **Build**: `cd frontend && pnpm build` - Creates production build
- **Start**: `cd frontend && pnpm start` - Starts production server
- **Lint**: `cd frontend && pnpm lint` - Runs Next.js ESLint

### Backend Commands
- **Development**: `cd backend && pnpm dev` - Runs with ts-node-dev and hot reload
- **Build**: `cd backend && pnpm build` - Compiles TypeScript to JavaScript
- **Start**: `cd backend && pnpm start` - Runs compiled production server
- **Lint**: `cd backend && pnpm lint` - Runs ESLint on backend code
- **Test**: `cd backend && pnpm test` - Runs Jest test suite
- **Single Test**: `cd backend && pnpm test -- <test-file>` or `pnpm test -- --testNamePattern="<pattern>"`
- **Database**: `cd backend && pnpm db:generate` - Generate Prisma client
- **Database**: `cd backend && pnpm db:push` - Push schema to database
- **Database**: `cd backend && pnpm db:migrate` - Create database migration
- **Database**: `cd backend && pnpm db:studio` - Open Prisma Studio
- **Database**: `cd backend && pnpm db:seed` - Seed database with sample data
- **Database**: `cd backend && pnpm db:reset` - Reset database and re-seed

## Architecture & Codebase Structure

### Project Structure
- **Full-stack blog platform** using pnpm monorepo workspace
- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Backend**: Express.js with tRPC, Prisma ORM, PostgreSQL database
- **Styling**: Tailwind CSS with responsive design and dark mode support
- **State Management**: Zustand for global state, TanStack Query for server state
- **Authentication**: NextAuth.js for frontend, JWT + bcrypt for backend

### Key Directories
- `/frontend` - Next.js application with pages, components, and API routes
- `/backend` - Express/tRPC server with database models and business logic
- `/docs` - Project documentation, architecture diagrams, and specifications
- `/scripts` - Build and deployment scripts (currently empty)

### Internal APIs
- **tRPC**: Type-safe API layer between frontend and backend
- **Prisma Client**: Database ORM with generated types
- **Database**: PostgreSQL with entities for Users, Posts, Comments, Categories, Media, Settings
- **Authentication**: JWT + bcrypt for backend, NextAuth.js for frontend

## Code Style Guidelines

### TypeScript & JavaScript
- **Strict TypeScript**: All code must be fully typed with no `any` types
- **Interface naming**: PascalCase for interfaces (e.g., `UserProfile`)
- **Type naming**: PascalCase for types (e.g., `ApiResponse<T>`)
- **Function naming**: camelCase for functions and methods
- **Variable naming**: camelCase for variables, PascalCase for components
- **File naming**: kebab-case for files (e.g., `user-profile.tsx`), PascalCase for components

### React/Next.js Conventions
- **Component structure**: Functional components with hooks
- **Hooks**: Custom hooks in separate files with `use` prefix
- **Props**: Use interfaces for component props with descriptive names
- **File organization**: Group related components in directories, index files for clean imports

### Import Order
```typescript
// 1. React imports
import React from 'react';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';

// 3. Internal modules (absolute imports preferred)
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

// 4. Relative imports
import { formatDate } from '../utils/date';
```

### Error Handling
- **API errors**: Use tRPC error handling with proper error codes
- **Frontend errors**: React Error Boundaries for component errors
- **Async operations**: Proper try/catch blocks with user-friendly error messages
- **Validation**: Zod schemas for input validation with descriptive error messages

### Database & Backend
- **Prisma conventions**: Follow Prisma naming conventions for models and fields
- **API responses**: Consistent response format with success/error states
- **Authentication**: JWT tokens with proper expiration and refresh logic
- **Security**: Input sanitization, SQL injection prevention, rate limiting

### Testing
- **Backend**: Jest with supertest for API testing
- **Coverage**: Aim for 80%+ code coverage
- **Test naming**: `describe('Component/Function name', () => { it('should...', () => {}) })`

### Formatting & Linting
- **Prettier**: Automatic code formatting on save and pre-commit
- **ESLint**: Strict linting rules with Next.js and TypeScript configurations
- **Pre-commit hooks**: Husky prevents commits with linting errors

### Performance
- **Images**: Next.js Image component with optimization
- **Bundle splitting**: Dynamic imports for code splitting
- **Caching**: Proper caching strategies for API responses and static assets
