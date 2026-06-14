# Project Overview

ViralIQ is an AI-powered SaaS platform for analyzing short-form video content and turning that analysis into actionable creator insights. Users upload a video, ViralIQ extracts representative frames, analyzes the content with OpenAI, stores the resulting report, and presents the findings in a dashboard.

Target users:

* Content creators who want to improve video performance.
* Social media managers who need repeatable content analysis.
* Brands and agencies evaluating creative assets before publishing.
* Growth teams studying what makes content more likely to perform.

Core problem solved:

* ViralIQ helps users understand why a video may or may not perform well by converting visual content into structured AI insights, recommendations, and dashboard-ready metrics.

# Tech Stack

* Next.js 15
* TypeScript
* Tailwind CSS
* HeroUI
* Framer Motion
* Clerk Authentication
* Supabase Database
* Supabase Storage
* OpenAI API
* Vercel

# Folder Structure

This project uses a Next.js App Router structure with a `src/` directory. As the app is built, use the following structure as the source of truth:

* `src/app/` - Next.js App Router routes, layouts, pages, loading states, error boundaries, and route handlers.
* `src/app/layout.tsx` - Global layout that wires metadata, fonts, providers, navbar, footer, and the root page shell.
* `src/app/page.tsx` - Current public SaaS homepage with responsive product, workflow, and insights sections.
* `src/app/providers.tsx` - Client provider boundary for HeroUI and dark mode theming.
* `src/app/globals.css` - Tailwind CSS entry point and global light/dark background styles.
* `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` - Clerk-powered sign-in page.
* `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` - Clerk-powered sign-up page.
* `src/app/dashboard/page.tsx` - Protected dashboard experience for uploaded videos, reports, analytics, and account views.
* `src/app/api/` - API route handlers for webhooks, background processing endpoints, and external service callbacks when Server Actions are not enough.
* `src/components/` - Reusable UI components shared across pages and features.
* `src/components/layout/` - Global layout components such as `Navbar`, `Footer`, and `ThemeToggle`.
* `src/components/ui/` - HeroUI wrappers, base controls, layout primitives, and design-system-level components.
* `src/components/dashboard/` - Dashboard-specific visualization, report, upload, and metric components.
* `src/features/` - Feature modules that group related UI, actions, schemas, and utilities by product area.
* `src/lib/` - Shared infrastructure code, clients, helpers, constants, and service integrations.
* `src/lib/clerk/` - Clerk authentication helpers and user/session utilities.
* `src/lib/supabase/` - Supabase browser, server, admin, database, and storage clients.
* `src/lib/openai/` - OpenAI client setup, prompt builders, response parsing, and AI analysis helpers.
* `src/actions/` - Server Actions for mutations such as uploads, analysis requests, report creation, and account operations.
* `src/types/` - Shared TypeScript types for database records, AI reports, component props, and domain models.
* `src/schemas/` - Validation schemas for forms, API payloads, AI JSON output, and database-facing inputs.
* `src/hooks/` - Client-side React hooks for UI state and browser-only behavior.
* `public/` - Static assets served by Next.js.
* `src/middleware.ts` - Clerk middleware that protects dashboard routes and redirects unauthenticated users.
* `supabase/` - Database migrations, generated types, seed data, and storage policy documentation.
* `docs/` - Longer architecture notes, implementation plans, and product decisions when they outgrow this file.
* `.env.example` - Environment variable template for local setup.
* `.env.local` - Local environment variables. Never commit real secrets.
* `SKILL.md` - Project knowledge base, development guide, and single source of truth.

# Coding Standards

* TypeScript only.
* Strict typing is required.
* Reusable components should be preferred over duplicated UI.
* No `any` types.
* Use a modular architecture organized by product feature and shared infrastructure.
* Server Actions are preferred for trusted mutations and server-side workflows.
* API routes should be used for webhooks, external callbacks, streaming endpoints, or cases where Server Actions are not appropriate.
* Use clean naming conventions for files, components, functions, variables, database tables, and environment variables.
* Keep business logic out of presentation components.
* Validate all external inputs before using them.
* Keep service clients isolated in `src/lib/` so integrations remain easy to test and replace.

# UI Guidelines

* Minimal SaaS design.
* Professional appearance.
* Consistent spacing.
* Responsive layouts across mobile, tablet, and desktop.
* Accessibility friendly interactions, forms, colors, focus states, and semantic markup.
* Use HeroUI as the primary component foundation.
* Use Tailwind CSS for layout, spacing, and small visual refinements.
* Use Framer Motion for purposeful transitions only.
* Keep dashboard views scan-friendly and focused on repeated usage.
* Avoid decorative UI that makes analysis, comparison, or decision-making harder.

# Authentication Architecture

* Clerk is the authentication provider.
* `ClerkProvider` wraps the root layout so auth state is available across the app.
* `/sign-in` uses Clerk's `SignIn` component.
* `/sign-up` uses Clerk's `SignUp` component.
* `/dashboard` is protected by `src/middleware.ts`.
* Unauthenticated users who request protected dashboard routes are redirected to `/sign-in`.
* `Navbar` uses `SignedIn`, `SignedOut`, and `UserButton` to show the correct auth controls.
* Google OAuth should be enabled in the Clerk Dashboard for the ViralIQ application. Clerk's prebuilt auth components will display Google sign-in automatically when the provider is enabled.

# Reusable Components

* `Navbar` - Sticky top navigation with brand identity, anchor navigation, dark mode toggle, signed-out auth actions, dashboard link, and Clerk `UserButton`.
* `Footer` - Global footer with product positioning and basic legal/contact links.
* `ThemeToggle` - Client-side dark mode control backed by `next-themes`.
* `Providers` - Root provider boundary for HeroUI and theme class management.

# AI Architecture

```text
Video Upload
-> Frame Extraction
-> OpenAI Analysis
-> JSON Report
-> Dashboard Visualization
```

Expected responsibilities:

* Video Upload - Accept user video files, validate file type and size, and store assets in Supabase Storage.
* Frame Extraction - Extract representative frames from uploaded videos for visual analysis.
* OpenAI Analysis - Send frame data and structured prompts to the OpenAI API.
* JSON Report - Parse and validate AI output into a stable report schema.
* Dashboard Visualization - Render report insights, scores, recommendations, and trends in the authenticated dashboard.

# Future Features

* Thumbnail Analysis
* Competitor Comparison
* Viral Trend Detection
* Caption Generator
* AI Content Coach
* Team Workspaces

# Environment Variables

```env
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
CLERK_WEBHOOK_SIGNING_SECRET=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=
```

# Database Architecture

Supabase stores the core ViralIQ product data in three public tables:

* `profiles` - One row per Clerk user. The primary key is the Clerk user ID.
* `analyses` - Video analysis jobs owned by a profile. Tracks title, video URLs, processing status, score, and metadata.
* `reports` - One structured AI report per analysis. Stores summary text, score breakdowns, recommendations, and the raw JSON payload.

Schema source:

* `supabase/migrations/20260614000000_create_core_tables.sql` defines tables, indexes, updated-at triggers, and RLS policies.
* `src/types/database.ts` contains generated-style TypeScript database types.
* `src/lib/supabase/client.ts` creates an anon Supabase client.
* `src/lib/supabase/admin.ts` creates a service-role Supabase client for trusted server-side operations only.
* `src/lib/supabase/database.ts` contains typed helpers for profiles, analyses, and reports.

Security decisions:

* Clerk remains the authentication provider.
* Supabase profile IDs use Clerk user IDs.
* `profiles.clerk_user_id` stores the Clerk user ID and has a unique index to prevent duplicate profile rows.
* Clerk `user.created` events are handled by `src/app/api/webhooks/clerk/route.ts`.
* The webhook verifies Clerk signatures with `verifyWebhook()` before upserting profile data.
* Row-level security is enabled on all three tables.
* Users can read their own profiles, analyses, and reports through JWT `sub` matching.
* Mutations should run through trusted server-side code using the service-role key until a Clerk-to-Supabase JWT template is configured.

# Development Rules

Whenever new features are added:

* Update `SKILL.md`.
* Document architecture decisions.
* Document new database tables.
* Document API routes.
* Document reusable components.
* Document new environment variables.
* Document new third-party integrations.
* Document important security, storage, or authentication decisions.

`SKILL.md` should remain the single source of truth for the project.
