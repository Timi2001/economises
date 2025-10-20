import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user (without password hashing for now)
  // const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@economises.blog' },
    update: {},
    create: {
      email: 'admin@economises.blog',
      username: 'admin',
      password: 'admin123', // TODO: Hash this later
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest in tech, programming, and digital innovation',
        color: '#3B82F6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'lifestyle' },
      update: {},
      create: {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Personal development, habits, and life experiences',
        color: '#10B981',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'business' },
      update: {},
      create: {
        name: 'Business',
        slug: 'business',
        description: 'Entrepreneurship, finance, and career advice',
        color: '#F59E0B',
      },
    }),
  ]);

  // Create sample tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'tutorial' },
      update: {},
      create: {
        name: 'Tutorial',
        slug: 'tutorial',
        color: '#8B5CF6',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'opinion' },
      update: {},
      create: {
        name: 'Opinion',
        slug: 'opinion',
        color: '#EF4444',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'news' },
      update: {},
      create: {
        name: 'News',
        slug: 'news',
        color: '#06B6D4',
      },
    }),
  ]);

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: 'welcome-to-economises-blog' },
      update: {},
      create: {
        title: 'Welcome to Economises Blog',
        slug: 'welcome-to-economises-blog',
        excerpt: 'Introducing the new modern blog platform built with cutting-edge technology',
        content: `# Welcome to Economises Blog

This is a modern, feature-rich blog platform designed for content creators who want to focus on writing rather than technical complexities.

## Features

- **Modern Tech Stack**: Built with Next.js, tRPC, and PostgreSQL
- **Admin Dashboard**: WordPress-inspired content management
- **SEO Optimized**: Built-in meta tags and structured data
- **Responsive Design**: Works perfectly on all devices
- **Fast & Secure**: Optimized performance and security best practices

## Getting Started

Start creating amazing content and reach your audience effectively.

---

*This is just the beginning. Stay tuned for more features!*`,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        metaTitle: 'Welcome to Economises Blog - Modern Blog Platform',
        metaDescription: 'Discover the new modern blog platform built with Next.js and PostgreSQL',
        authorId: admin.id,
        categories: {
          connect: [{ id: categories[0].id }],
        },
        tags: {
          connect: [{ id: tags[1].id }],
        },
      },
    }),
    prisma.post.upsert({
      where: { slug: 'building-scalable-web-apps' },
      update: {},
      create: {
        title: 'Building Scalable Web Applications',
        slug: 'building-scalable-web-apps',
        excerpt: 'Best practices for building web applications that can grow with your user base',
        content: `# Building Scalable Web Applications

Scalability is crucial for modern web applications. Here are key principles to follow:

## 1. Database Design

- Use proper indexing
- Normalize data appropriately
- Consider read replicas for high-traffic apps

## 2. Caching Strategy

- Implement Redis for session storage
- Cache API responses
- Use CDN for static assets

## 3. Microservices Architecture

- Break down monolithic apps
- Use event-driven communication
- Implement proper API gateways

## 4. Monitoring & Analytics

- Track performance metrics
- Set up error monitoring
- Use analytics to understand user behavior

Remember: Start simple, but design for scale from day one.`,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
        metaTitle: 'Building Scalable Web Applications - Best Practices',
        metaDescription: 'Learn how to build web applications that scale with your growing user base',
        authorId: admin.id,
        categories: {
          connect: [{ id: categories[0].id }],
        },
        tags: {
          connect: [{ id: tags[0].id }],
        },
      },
    }),
  ]);

  // Create sample comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'Great article! Looking forward to more content like this.',
        status: 'APPROVED',
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
        postId: posts[0].id,
      },
      {
        content: 'Very informative. The scalability tips are particularly useful.',
        status: 'APPROVED',
        authorName: 'Jane Smith',
        authorEmail: 'jane@example.com',
        postId: posts[1].id,
      },
      {
        content: 'Thanks for sharing these insights!',
        status: 'PENDING',
        authorName: 'Bob Wilson',
        authorEmail: 'bob@example.com',
        postId: posts[1].id,
      },
    ],
    skipDuplicates: true,
  });

  // Create sample settings
  await prisma.setting.createMany({
    data: [
      { key: 'site_title', value: 'Economises Blog' },
      { key: 'site_description', value: 'A modern blog platform for content creators' },
      { key: 'site_url', value: 'https://economises.blog' },
      { key: 'admin_email', value: 'admin@economises.blog' },
      { key: 'posts_per_page', value: '10' },
      { key: 'comments_enabled', value: 'true' },
      { key: 'theme', value: 'light' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeded successfully!');
  console.log('Admin credentials:');
  console.log('Email: admin@economises.blog');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
