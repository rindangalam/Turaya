# Turaya

> **Luxury perfume brand experience + CMS admin dashboard**  
> Premium digital brand platform built with Next.js App Router and Supabase

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-Animation-88CE02)](https://greensock.com/gsap/)

---

## Overview

**Turaya** is a luxury perfume brand digital experience platform featuring a sophisticated public-facing website and a comprehensive CMS admin dashboard. Built with modern web technologies, it delivers a premium, editorial-style brand presence with full content management capabilities.

### Brand Positioning
- **Category**: Luxury / artisanal fragrance
- **Tone**: Calm, editorial, sophisticated, modern
- **Philosophy**: Making visitors *feel* the fragrance through craftsmanship, emotion, and atmosphere
- **Inspiration**: Aesop, Le Labo, Byredo, Jo Malone, Maison Margiela, Dior Beauty

---

## Features

### Public Website (`/`)
**Premium Brand Experience for Visitors**

- **Homepage** with WebGL hero animations and scroll-based storytelling
- **Product Catalog** with detailed fragrance information
- **Collections** showcase and categorization
- **Ingredients** transparency and education
- **Gallery** for brand imagery and lifestyle
- **Journal/Blog** for editorial content
- **Store Locator** with interactive map
- **About & Philosophy** pages
- **FAQ, Privacy, Terms** pages
- **Contact Form** with message handling
- **Smooth Animations** using GSAP + Lenis smooth scroll
- **Page Transitions** with Motion
- **SEO Optimized** with metadata, JSON-LD, sitemap, robots.txt

### Admin Dashboard (`/admin`)
**Content Management System for Brand Managers**

- **Dashboard** with business overview
- **Product Management** (CRUD operations)
- **Collections Management**
- **Categories Management**
- **Ingredients Management**
- **Gallery Management** (media library)
- **Journal/Blog Management** (articles, publishing)
- **Testimonials Management**
- **Store Locations Management**
- **Messages Inbox** (contact form submissions)
- **SEO Settings** (meta tags, OG images, JSON-LD)
- **Site Settings** (global configuration)
- **Role-based Access Control** (Super Admin, Admin, Editor)

### Design System
- **Tailwind CSS v4** custom design tokens
- **shadcn/ui** component library (Base UI)
- **GSAP** for advanced animations
- **Motion** for declarative animations
- **Lenis** for smooth scrolling
- **Cursor Preview** interactions
- **Reduced-motion** accessibility paths

### Security Features
- **Row Level Security (RLS)** on all Supabase tables
- **Server-side authorization** enforcement
- **Authentication** via Supabase Auth
- **Protected API routes**
- **CSRF protection**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict) |
| **Styling** | Tailwind CSS v4, shadcn/ui, Base UI |
| **Animation** | GSAP, Motion, Lenis (smooth scroll) |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, RLS) |
| **Deployment** | Vercel (2 separate projects: public + admin) |
| **Package Manager** | npm |
| **Validation** | Zod |
| **Notifications** | Sonner (toast) |

---

## Requirements

- **Node.js** >= 18
- **npm** >= 9
- **Supabase account** (project setup)

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/rindangalam/Turaya.git
cd Turaya
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Target (public | admin)
NEXT_PUBLIC_APP_TARGET=public

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Setup Supabase Database

Run migrations and seed data:

```bash
# Follow instructions in docs/SUPABASE.md
# Apply migrations 0000-0008
# Run seed data script
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
Turaya/
 src/
    app/                    # Next.js App Router
       (public)/           # Public website routes
          products/
          collections/
          gallery/
          journal/
          about/
          contact/
       admin/              # Admin CMS routes
          products/
          collections/
          journal/
          gallery/
          settings/
       api/                # API routes
    features/               # Feature-oriented architecture
       products/
       collections/
       auth/
       ...
    components/             # Shared UI components
    lib/                    # Utilities & helpers
    styles/                 # Global styles
 supabase/
    migrations/             # Database migrations
    seed.sql                # Seed data
 docs/                       # Documentation
    README.md               # Documentation index
    DEPLOYMENT.md           # Deployment guide
    SUPABASE.md             # Database setup
    SPRINTS.md              # Development sprints
 scripts/                    # Build scripts
 skills/                     # Skill system
 AGENT.md                    # Engineering constitution
 PROJECT_RULES.md            # Development rules
 PROJECT_CONTEXT.md          # Project identity
 package.json
```

---

## Deployment

### Dual Deployment Strategy

Turaya uses **two separate Vercel projects** from the same repository:

#### Public Website Deployment
```bash
# Set environment variable
NEXT_PUBLIC_APP_TARGET=public

# Build command
npm run build:target

# Routes: /products, /collections, /about, etc.
# /admin routes return 404
```

#### Admin Dashboard Deployment
```bash
# Set environment variable
NEXT_PUBLIC_APP_TARGET=admin

# Build command
npm run build:target

# Routes: /admin/*, /api/admin/*
# Public routes return 404 or redirect to admin
```

See `docs/DEPLOYMENT.md` for detailed instructions.

---

## 🧪 Development Commands

```bash
npm run dev          # Start development server (all routes)
npm run build        # Full production build (all routes)
npm run build:target # Isolated build per deployment target
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

---

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Documentation Index](docs/README.md)** - Reading order and cross-check protocol
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deployment strategies
- **[Supabase Setup](docs/SUPABASE.md)** - Database configuration
- **[Sprints Log](docs/SPRINTS.md)** - Development timeline
- **[AGENT.md](AGENT.md)** - Engineering constitution
- **[PROJECT_RULES.md](PROJECT_RULES.md)** - Development rules
- **[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)** - Brand identity

---

## Branching Strategy

- `main` - Production branch
- `develop` - Integration branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `refactor/*` - Code refactoring

---

## Design Principles

### Brand Experience
- **No AI slop** - Every UI element must earn its place
- **Editorial quality** - Magazine-style layouts and typography
- **Sensory language** - Specific, restrained copy (no clichés)
- **Emotional connection** - Make visitors *feel* the fragrance

### Technical Quality
- **Performance**: LCP < 2.5s, CLS < 0.1, INP < 200ms
- **Accessibility**: WCAG 2.2 AA target
- **Architecture**: Feature-oriented (`src/features/*`)
- **Components**: Server Components by default
- **Security**: RLS mandatory, service role server-only

---

## User Roles

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full system access, user management, settings |
| **Admin** | Content management, product/collection CRUD, SEO |
| **Editor** | Content creation, journal articles, limited settings |

---

## SEO Features

- **Dynamic metadata** per page
- **Open Graph** tags for social sharing
- **Twitter Card** metadata
- **JSON-LD** structured data (Organization, Product, Article, Breadcrumb, FAQ)
- **Sitemap.xml** generation
- **Robots.txt** configuration
- **Canonical URLs**
- **OG Image API** (dynamic social images)

---

## Current Status

**Sprints 1-13 Complete:**
-  Design System implementation
-  CMS Admin (all modules)
-  Public Website (all pages)
-  Motion System (animations, transitions)
-  SEO Implementation
-  Supabase integration (migrations 0000-0008)
-  Admin user bootstrapped
-  End-to-end browser verification

**Connected to Supabase:**
- Project ref: `yuzsroqibdylpqihrbsh`
- Region: `ap-southeast-1`

---

## Important Notes

### Placeholder Content
As of the documentation phase, **no real Turaya brand content exists in this repository.** All copy, fragrance names, ingredients, and imagery are **placeholders** marked with `[PLACEHOLDER — description]`.

Real brand content will replace placeholders before production deployment.

---

## 🤝 Contributing

This is a proprietary project. For internal development:
1. Follow `PROJECT_RULES.md` strictly
2. Document changes in decision log
3. Use feature branches with descriptive names
4. Test thoroughly before merging to `develop`

---

## License

Proprietary - Internal use only

---

## Author

**Rindang Alam Nur Muhammad**  
GitHub: [@rindangalam](https://github.com/rindangalam)

---

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [GSAP](https://greensock.com/) - Animation library
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lenis](https://lenis.darkroom.engineering/) - Smooth scroll

---

## Contact

For project inquiries:
- **GitHub**: [@rindangalam](https://github.com/rindangalam)
- **Repository**: [Turaya](https://github.com/rindangalam/Turaya)
