# CLAUDE.md — Curio MVP

## What is Curio?

Curio is a smart introductions platform that powers better professional introductions for communities. It connects people who should meet by intelligently matching participants based on their profiles, goals, and context.

**Key Roles:**
- **Super Admin** — Platform-wide administration
- **Community Admin** — Manages a specific community and its members
- **Participant** — Community member seeking/offering introductions

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Backend:** Next.js API Routes + Supabase Edge Functions
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (magic links, OAuth)
- **Styling:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ (recommend using `nvm`)
- pnpm (preferred) or npm
- Supabase account (for local dev, use Supabase CLI)

### Install Dependencies

```bash
pnpm install
```

### Environment Setup

```bash
cp .env.example .env.local
# Fill in your Supabase credentials and other secrets
```

### Run Development Server

```bash
pnpm dev
```

App runs at `http://localhost:3000`

### Run Tests

```bash
pnpm test          # Run unit tests
pnpm test:e2e      # Run end-to-end tests (Playwright)
pnpm lint          # Run ESLint
pnpm typecheck     # Run TypeScript compiler checks
```

## Project Structure

```
curio-mvp/
├── src/
│   ├── app/              # Next.js App Router pages & layouts
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui primitives
│   │   └── features/     # Feature-specific components
│   ├── lib/              # Shared utilities & clients
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript type definitions
├── supabase/
│   ├── migrations/       # Database migrations
│   └── functions/        # Edge functions
├── docs/
│   └── ai/               # Specs and planning docs for AI assistants
├── tests/                # Test files
└── public/               # Static assets
```

## Documentation

Specs and planning documents live in `docs/ai/`. Key files:

- `docs/ai/architecture_overview.md` — System architecture
- `docs/ai/` — Feature specs, PRDs, and planning docs

## Rules for AI Assistants

### Always

- Read existing code before proposing changes
- Follow the existing code style and patterns
- Use TypeScript with strict types (avoid `any`)
- Write small, focused functions and components
- Add appropriate error handling
- Check `docs/ai/` for relevant specs before implementing features
- Ask clarifying questions when requirements are ambiguous
- Run `pnpm lint` and `pnpm typecheck` before considering work complete

### Never

- **Never run `git commit` or `git push`** — the human will handle all commits
- Never modify `.env` or `.env.local` files (suggest changes instead)
- Never delete or overwrite migrations without explicit approval
- Never install new dependencies without discussing the rationale first
- Never bypass TypeScript errors with `@ts-ignore` or `any`
- Never hardcode secrets, API keys, or credentials
- Never make breaking API changes without flagging them

## Code Conventions

- **Components:** PascalCase (`UserCard.tsx`)
- **Utilities/hooks:** camelCase (`useAuth.ts`, `formatDate.ts`)
- **Constants:** SCREAMING_SNAKE_CASE
- **Database tables/columns:** snake_case
- **API routes:** kebab-case (`/api/send-intro`)

## Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm test` | Run tests |
| `pnpm lint` | Lint code |
| `pnpm typecheck` | Type check |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:generate` | Generate types from database |
