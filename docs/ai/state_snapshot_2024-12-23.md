# Curio MVP — State Snapshot

> **Generated:** 2024-12-23
> **Branch:** main
> **Commit:** 49ce6f7

---

## Git State

**Branch:** `main`

**Status:** Clean, up to date with `origin/main`

**Last 5 Commits:**
```
49ce6f7 Merge pull request #8 from martois12/claude/org-groups-management-4lRst
65abfd0 fix: wrap useSearchParams in Suspense boundary for /login
6da8d52 docs: clarify Spec 1.3 rename migration is planned
89c1f60 Merge origin/claude/implement-rbac-gates-5cNlN into org-groups-management
b66a787 docs: Archive old spec and add Spec 1.3 source of truth
```

---

## Feature Inventory by Milestone

### Milestone 1: Foundation & Auth

| Feature | Status | Notes |
|---------|--------|-------|
| Next.js 14 App Router scaffold | **Done** | App structure in place |
| Supabase client setup | **Done** | `src/lib/supabase/client.ts`, `server.ts` |
| Database schema (migration 0001) | **Done** | 13 tables, 9 enums |
| Magic link authentication | **Done** | Via Supabase Auth |
| Login page with Suspense fix | **Done** | `/login` with `LoginClient.tsx` |
| Auth callback route | **Done** | `/auth/callback` |
| Middleware route protection | **Done** | `src/middleware.ts` |
| RBAC module | **Done** | `src/lib/rbac.ts` |
| Role hierarchy (3 levels) | **Done** | super_admin → organisation_admin → user |

### Milestone 2: Admin Interface

| Feature | Status | Notes |
|---------|--------|-------|
| Super admin organisations list | **Done** | `/admin/organisations` |
| Organisation detail page | **Done** | `/admin/organisations/[organisationId]` |
| Group management within org | **Done** | On org detail page |
| Org admin dashboard | **Partial** | `/org` exists but minimal |
| User dashboard | **Partial** | `/dashboard` shows role info only |
| Access denied page | **Done** | `/access-denied` |
| Debug page | **Done** | `/debug/me` (dev only) |

### Milestone 3: Matching & Introductions

| Feature | Status | Notes |
|---------|--------|-------|
| Participant onboarding flow | **Not Started** | No signup or profile forms |
| Profile management | **Not Started** | Schema exists, no UI |
| Matching algorithm | **Not Started** | Schema supports it |
| Intro generation | **Not Started** | `intro_messages` table exists |
| Round management | **Not Started** | `rounds` table exists |
| Email delivery (Resend) | **Not Started** | Not integrated |
| Approval workflow | **Not Started** | Schema supports it |

---

## Routes & Access Control

| Route | Type | Allowed Roles | Purpose |
|-------|------|---------------|---------|
| `/` | Static | Public | Home page |
| `/login` | Static | Public | Authentication |
| `/auth/callback` | Dynamic | Public | OAuth/magic link callback |
| `/access-denied` | Static | Public | Unauthorized access page |
| `/dashboard` | Dynamic | All authenticated | User dashboard |
| `/debug/me` | Dynamic | All authenticated | Dev: show user info |
| `/org` | Dynamic | super_admin, organisation_admin | Org admin hub |
| `/admin/organisations` | Dynamic | super_admin | Platform management |
| `/admin/organisations/[id]` | Dynamic | super_admin | Org detail & groups |

**Role mapping (middleware uses legacy DB values):**
- `super_admin` → `super_admin`
- `community_admin` → `organisation_admin` (Spec 1.3)
- `participant` → `user` (Spec 1.3)

---

## Database Schema

### Tables (13)

| Table | Description |
|-------|-------------|
| `users` | User accounts (extends auth.users) |
| `profiles` | Extended user profile data |
| `communities` | Organisations (legacy name) |
| `community_admins` | Org admin assignments (legacy name) |
| `programmes` | Groups/intro series (legacy name) |
| `programme_participants` | Group membership |
| `rounds` | Matching round instances |
| `matches` | Generated match pairs/trios |
| `intro_messages` | Generated intro content |
| `exclusions` | Admin-managed never-match pairs |
| `blocked_participants` | User-managed blocks |
| `connections` | Historical intro connections |

### Enums (9)

| Enum | Values |
|------|--------|
| `user_role` | super_admin, community_admin, participant |
| `programme_type` | community_connection, cohort_blitz, event |
| `cadence` | daily, every_2_days, every_3_days, weekly, fortnightly, monthly, quarterly, one_time |
| `match_size` | pairs, pairs_with_trios |
| `channel` | email_manual, email_auto, slack, teams |
| `programme_participant_status` | active, opted_out, removed |
| `round_status` | draft, matched, pending_approval, sent, completed |
| `match_type` | pair, trio |
| `preferred_cadence` | weekly, fortnightly, monthly, quarterly |

---

## Check Results

### pnpm lint
```
✔ No ESLint warnings or errors
```

### pnpm typecheck
```
(no output — passed)
```

### pnpm test
```
No tests configured yet
```

### pnpm build
```
✓ Compiled successfully
✓ Generating static pages (11/11)

Route (app)                                Size     First Load JS
┌ ○ /                                      187 B          94.1 kB
├ ○ /_not-found                            876 B            88 kB
├ ○ /access-denied                         187 B          94.1 kB
├ ƒ /admin/organisations                   187 B          94.1 kB
├ ƒ /admin/organisations/[organisationId]  186 B          94.1 kB
├ ƒ /auth/callback                         0 B                0 B
├ ƒ /dashboard                             504 B           153 kB
├ ƒ /debug/me                              188 B          94.1 kB
├ ○ /login                                 1.51 kB         154 kB
└ ƒ /org                                   187 B          94.1 kB

ƒ Middleware                               77.1 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## Legacy Terminology Usage

Searched for legacy terms in `src/`:

### `communities` (2 occurrences)
- `src/types/index.ts:6` — Comment noting legacy names
- `src/types/index.ts:73` — Comment documenting rename

### `programmes` (2 occurrences)
- `src/types/index.ts:6` — Comment noting legacy names
- `src/types/index.ts:116` — Comment documenting rename

### `community_admin` (9 occurrences)
- `src/lib/rbac.ts:13` — Comment about legacy roles
- `src/middleware.ts:9,19,20,21` — Route permissions (uses legacy values from DB)
- `src/types/index.ts:16,24,33,48,87` — Type definitions and mapping functions

### `participant` (10 occurrences)
- `src/lib/rbac.ts:13` — Comment about legacy roles
- `src/middleware.ts:9,20,21,124,125` — Route permissions and default role
- `src/types/index.ts:16,24,35,50` — Type definitions and mapping functions

**Note:** All legacy term usage is either in comments documenting the migration, or in middleware/types that must use legacy values to query the database. The application layer uses Spec 1.3 terminology via mapping functions.

---

## What To Do Next

### 1. Participant Onboarding Flow (High Priority)
Create the signup and profile completion flow for new users:
- `/signup` page with email/password registration
- Multi-step profile form (role, org, LinkedIn, interests)
- Consent checkbox for LinkedIn data usage
- Store to `users` and `profiles` tables

**Files to create:** `src/app/signup/page.tsx`, `src/app/onboarding/page.tsx`, `src/components/features/ProfileForm.tsx`

### 2. User Dashboard Enhancement (Medium Priority)
Replace the current minimal dashboard with useful content:
- Show user's organisations and groups
- Display upcoming rounds and opt-in status
- Show past introductions/connections
- Add "Edit Profile" and "Manage Preferences" links

**Files to modify:** `src/app/dashboard/page.tsx`

### 3. Database Schema Rename Migration (Technical Debt)
Create migration `0002_rename_schema_to_spec_1_3.sql` to rename legacy tables:
- `communities` → `organisations`
- `programmes` → `groups`
- `community_admins` → `organisation_admins`
- `programme_participants` → `group_members`
- Update enum values in `user_role`

**Files to create:** `supabase/migrations/0002_rename_schema_to_spec_1_3.sql`
**Files to update:** `src/middleware.ts` (after migration)

---

## Summary

| Category | Done | Partial | Not Started |
|----------|------|---------|-------------|
| **Milestone 1** (Foundation) | 9 | 0 | 0 |
| **Milestone 2** (Admin UI) | 5 | 2 | 0 |
| **Milestone 3** (Matching) | 0 | 0 | 7 |

**Overall:** Core infrastructure complete. Admin interface functional. Participant-facing features and matching engine not yet started.
