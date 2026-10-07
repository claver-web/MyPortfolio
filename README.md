# 🌐 Engineering Portfolio & Systems Architecture

> A high-performance, minimalist monochrome engineering portfolio and CMS powered by **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma**, **Neon PostgreSQL**, **NextAuth.js**, and **Framer Motion**.

---

## 🚀 Overview

This portfolio showcases production software engineering, autonomous agentic AI architectures, and interactive system design blueprints with a custom administrative content management suite.

### 🌟 Key Highlights

- **Aesthetic**: Strict monochrome minimalist design with fluid dark/light mode toggle.
- **Dynamic GitHub Repositories**: Live GitHub API synchronization with animated carousel/grid switcher and telemetry badges.
- **Architecture Documentation Viewer**: Embedded interactive markdown modal with syntax highlighting and system design blueprints for every repository.
- **Project Case Studies**: Comprehensive deep-dives into distributed microservices, agentic memory systems, and WebRTC architectures.
- **Full Admin CMS**: Credentials-authenticated dashboard (`/admin`) for managing projects, skills, certificates, experience timeline, and site settings.
- **Privacy-Friendly Visitor Analytics**: Edge-hashed IP visitor tracking with geolocation and device telemetry graphs.
- **Production-Tuned Database**: Neon PostgreSQL with connection pooling, TCP keepalives, and cold-start resilience.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components, Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + `@tailwindcss/typography`
- **Database & ORM**: [Neon PostgreSQL](https://neon.tech/) + [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider + JWT sessions)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Markdown & Docs**: `react-markdown`, `remark-gfm`, `rehype-highlight`, `rehype-raw`
- **Image Optimization**: `sharp` + `next/image`

---

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma           # Prisma models (Project, Experience, Skill, etc.)
│   └── seed.ts                 # Database seed script
├── public/
│   ├── og-image.png            # Branded Open Graph card
│   └── uploads/                # Resumes and credential files
├── scripts/
│   └── sync-github-projects.ts # GitHub repository to project sync utility
└── src/
    ├── app/
    │   ├── (public)/           # Public portfolio routes (/, /projects, /experience, etc.)
    │   ├── admin/              # Protected Admin CMS panel routes
    │   └── api/                # Internal API route handlers (auth, tracking, github proxy)
    ├── components/
    │   ├── admin/              # Admin CMS management tables and forms
    │   ├── motion/             # Framer Motion animated wrappers
    │   ├── sections/           # Public page sections (Hero, FeaturedProjects, GitHubReposScroll)
    │   └── ui/                 # Reusable UI primitives
    └── lib/
        ├── actions/            # Next.js Server Actions for data mutations
        ├── auth.ts             # NextAuth authentication configuration
        ├── github.ts           # Secure server-side GitHub fetcher & architecture resolver
        └── prisma.ts           # Global singleton Prisma client with connection pool tuning
```

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/claver-web/MyPortfolio.git
cd MyPortfolio
npm install
```

### 2. Configure Environment

Create a `.env.local` file with:

```env
DATABASE_URL="postgresql://user:password@host-pooler.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=30&pool_timeout=30&connection_limit=10"
DIRECT_URL="postgresql://user:password@host.neon.tech/neondb?sslmode=require&connect_timeout=30"

NEXTAUTH_SECRET="your-generated-random-secret"
NEXTAUTH_URL="http://localhost:3000"

ADMIN_EMAIL="admin@portfolio.local"
ADMIN_PASSWORD="YourStrongPassword123!"
```

### 3. Initialize Database

```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

---

## 🚢 Production Deployment

### Build Application
```bash
npm run build
npm start
```

Deployable with zero configuration to [Vercel](https://vercel.com) by linking the repository and setting the environment variables in the project settings.

---

## 📜 License

MIT License. Free for personal and commercial usage.
