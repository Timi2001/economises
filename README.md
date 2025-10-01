# Economises Blog website

## Project Vision

The Economises Blog website aims to be a **feature-rich, beautiful, and engaging personal blog platform** with the following key features:
- A modern, responsive, and SEO-optimized audience-facing site
- An admin dashboard inspired by WordPress, offering comprehensive content and user management tools
- Full end-to-end CRUD operations supported by a scalable backend and database
- AI-enhanced development and content features to accelerate prototyping, code generation, and user experience improvements

This project utilizes advanced *vibe coding* tools and AI code assistants in VS Code to facilitate rapid development and an enhanced user experience.

---

## Website Structure

### Audience-Facing Site
- **Homepage**: Features a post feed, highlighted areas, newsletter sign-up, categories, and search functionality
- **Post Pages**: Rich and interactive, including sharing options, comments, and related posts
- **Static Pages**: Includes About, Contact, Terms, Privacy, etc.
- **Category/Tag Landing Pages**: Dedicated pages for categories and tags
- **User Profiles** (optional): Profiles for registered users and authors

### Admin Panel (WordPress-Like)
- **Dashboard Overview**: Displays site statistics, latest posts, and traffic trends
- **Posts Management**: Allows creating, editing, scheduling, and deleting posts with WYSIWYG, markdown, and AI content assistance
- **Pages Management**: Add, edit, and delete static pages
- **Media Library**: Upload and manage images and videos
- **User & Role Management**: Manage roles such as Admin, Editor, Author, Contributor, and Subscriber
- **Comments Moderation**: Approve, reply, flag, and delete comments
- **Category & Tag Management**: Manage categories and tags
- **Newsletter/Email Broadcasts**: Manage newsletter and email broadcasts
- **Site Settings**: Configure SEO, appearance, analytics, and notifications
- **Themes/Appearance Control**: Customize themes with dark/light modes and custom color schemes
- **Plugin/API Integration**: Integrate analytics, social media, backup, and AI helper plugins

---

## Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (React-based SSR for speed and SEO)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) for animations
- **UI Kit:** [MUI](https://mui.com/) or [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** React Context, Redux Toolkit, or Zustand
- **Authentication:** JWT (with refresh) or OAuth (Google, GitHub)
- **AI Tools:** GitHub Copilot, Vercel v0, Claude, Copilot Chat — integrated in VS Code

### Backend
- **API Framework:** [tRPC](https://trpc.io/) or [Express.js](https://expressjs.com/) (for REST)
- **Database ORM:** [Prisma](https://www.prisma.io/) (SQL and NoSQL compatible)
- **Database:** PostgreSQL (ideal for blogs), MySQL, or MongoDB
- **File Storage:** Cloudinary, S3, or local storage
- **Email:** Resend, Nodemailer, or Mailgun
- **Analytics:** Plausible, Google Analytics, or Vercel Analytics

### DevOps/Deployment
- **Hosting:** Vercel (best for Next.js), Netlify, or DigitalOcean App Platform
- **CI/CD:** GitHub Actions, Vercel Integration

---

## Key Features

- **Modern Design**: Fast, accessible, and mobile-first
- **CRUD Operations**: Full CRUD support for posts, pages, media, comments, users, and settings
- **Admin Dashboard**: Inspired by WordPress with a modular and extendable design
- **AI Enhancements**:
  - Content suggestions and auto-formatting
  - AI-assisted code generation for rapid feature development
  - Semantic and AI-powered site search
- **SEO Best Practices**: Meta tags, sitemap, robots.txt
- **Notifications**: Email and push notifications for the audience
- **Analytics**: Real-time stats and analytics for both admin and users
- **Security**: Secure authentication and granular user permissions
- **Extendability**: Easily extendable with APIs and plugins
- **Maintenance**: Scheduled backups and audit logs for admin actions

---

## Tasks to Complete

- Define user personas and sitemap (AI-assisted)
- Set up project repository and CI/CD pipeline
- Scaffold frontend and backend according to the tech stack
- Design database schema for Posts, Pages, Users, Comments, Media, and Settings
- Integrate authentication system with role-based access control
- Build admin dashboard with full CRUD functionality for all entities
- Implement public-facing audience site with all end-user features
- Connect email/newsletter and analytics providers
- Optimize for SEO, performance, and PWA capabilities
- Test thoroughly (unit, end-to-end, manual) and go live!

---

## Contribution & License

Pull requests are welcome! Please refer to [processes.md](./processes.md) for the contributing guide and workflow.
