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

This project is starting from a fresh repository. As the app is built, use the following structure as the source of truth:

* `app/` - Next.js App Router routes, layouts, pages, loading states, error boundaries, and route handlers.
* `app/(auth)/` - Authentication screens and Clerk-powered sign-in or sign-up routes.
* `app/(dashboard)/` - Protected dashboard experience for uploaded videos, reports, analytics, and account views.
* `app/api/` - API route handlers for webhooks, background processing endpoints, and external service callbacks when Server Actions are not enough.
* `components/` - Reusable UI components shared across pages and features.
* `components/ui/` - HeroUI wrappers, base controls, layout primitives, and design-system-level components.
* `components/dashboard/` - Dashboard-specific visualization, report, upload, and metric components.
* `features/` - Feature modules that group related UI, actions, schemas, and utilities by product area.
* `lib/` - Shared infrastructure code, clients, helpers, constants, and service integrations.
* `lib/clerk/` - Clerk authentication helpers and user/session utilities.
* `lib/supabase/` - Supabase browser, server, admin, database, and storage clients.
* `lib/openai/` - OpenAI client setup, prompt builders, response parsing, and AI analysis helpers.
* `actions/` - Server Actions for mutations such as uploads, analysis requests, report creation, and account operations.
* `types/` - Shared TypeScript types for database records, AI reports, component props, and domain models.
* `schemas/` - Validation schemas for forms, API payloads, AI JSON output, and database-facing inputs.
* `hooks/` - Client-side React hooks for UI state and browser-only behavior.
* `public/` - Static assets served by Next.js.
* `supabase/` - Database migrations, generated types, seed data, and storage policy documentation.
* `docs/` - Longer architecture notes, implementation plans, and product decisions when they outgrow this file.
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
* Keep service clients isolated in `lib/` so integrations remain easy to test and replace.

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

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=
```

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
