# Architecture Overview — Curio MVP

> **Terminology:** This document uses Spec 1.3 terminology. See `docs/spec/source-of-truth.md` for the full terminology mapping.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Next.js 14 App                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │   React     │  │  API Routes │  │  Server         │   │  │
│  │  │   Frontend  │  │  /api/*     │  │  Components     │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  PostgreSQL │  │    Auth     │  │    Edge Functions       │  │
│  │  Database   │  │  (GoTrue)   │  │    (Deno runtime)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │   Storage   │  │  Realtime   │                               │
│  │   (S3)      │  │  (WebSocket)│                               │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### Frontend (Next.js + React)

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** React Server Components + React Query for client state
- **Forms:** React Hook Form + Zod validation

**Key directories:**
- `src/app/` — Pages, layouts, and route handlers
- `src/components/` — Reusable UI components
- `src/hooks/` — Custom React hooks
- `src/lib/` — Utilities, API clients, helpers

### Backend (API Routes + Supabase)

- **API Layer:** Next.js Route Handlers (`src/app/api/`)
- **Database Access:** Supabase JS client with Row Level Security
- **Background Jobs:** Supabase Edge Functions (for emails, matching)

**API patterns:**
- RESTful endpoints under `/api/`
- Server Actions for mutations where appropriate
- Zod schemas for request/response validation

### Database (Supabase PostgreSQL)

- **ORM/Client:** Supabase JS client (auto-generated types)
- **Migrations:** SQL files in `supabase/migrations/`
- **Security:** Row Level Security (RLS) policies

**Core tables (Spec 1.3 names → current DB names):**
- `users` — User profiles (extends Supabase auth.users)
- `organisations` → `communities` — Organisation entities
- `organisation_members` → `community_admins` — User-organisation relationships + roles
- `groups` → `programmes` — Introduction groups within organisations
- `group_members` → `programme_participants` — User enrolment in groups
- `introductions` — Introduction requests and matches
- `intro_preferences` — User preferences for introductions

> **Note:** Database currently uses legacy table names from migration 0001. See `docs/spec/source-of-truth.md` for mapping.

### Authentication (Supabase Auth)

- **Provider:** Supabase Auth (GoTrue)
- **Methods:** Magic link (email), OAuth (Google, LinkedIn)
- **Session:** JWT stored in httpOnly cookies
- **Authorization:** RLS policies + middleware checks

**Role hierarchy (Spec 1.3):**
1. Super Admin (`super_admin`) — Full platform access
2. Organisation Admin (`organisation_admin`) — Manage specific organisation
3. User (`user`) — Member of organisation

### Email & Notifications

- **Transactional Email:** Resend or Supabase built-in
- **Templates:** React Email components
- **Triggers:** Edge Functions on database events

## Data Flow

### Introduction Request Flow

```
1. User submits intro request
       │
       ▼
2. API validates & stores in `introductions` table
       │
       ▼
3. Edge Function triggers matching algorithm
       │
       ▼
4. Matches stored, notifications sent to both parties
       │
       ▼
5. Organisation Admin can review/approve (optional)
       │
       ▼
6. Introduction email sent with context
```

## Security Considerations

- All database access through RLS policies
- API routes validate session before processing
- Sensitive operations require re-authentication
- Rate limiting on auth endpoints
- Input sanitization via Zod schemas

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server only) |
| `NEXTAUTH_SECRET` | Session encryption key |
| `RESEND_API_KEY` | Email service API key |

## Deployment

- **Platform:** Vercel (automatic deployments from main branch)
- **Preview:** PR previews on Vercel
- **Database:** Supabase hosted (managed PostgreSQL)
- **Domains:** Custom domain via Vercel

## Future Considerations (Post-MVP)

- AI-powered matching improvements
- Calendar integration for scheduling
- Mobile app (React Native)
- Analytics dashboard
- Webhook integrations
