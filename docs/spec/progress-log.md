# Curio Progress Log

> **Purpose:** Append-only narrative history of milestone progress.
> This log captures what shipped and when. It does not replace `milestones.md`, which remains the single source of truth for current status and planned work.

---

## Entry Template

```
### [Date] — [Milestone or Topic]

**Status:** [Completed | In Progress | Shipped slice]

[2-4 sentences on what was delivered, key routes/features, and any notable decisions.]

**Key items:**
- [Bullet list of specific deliverables]
```

---

## Entries

### 24 Dec 2024 — Milestone 1: Skeleton app and access control

**Status:** Completed

Secure authentication via Supabase Auth with role-based access control for Super Admin, Organisation Admin, and User roles. Middleware enforces route protection, redirecting unauthorised users to `/access-denied` or `/login`. The foundation is in place for building features without exposing the wrong pages or actions to the wrong role.

**Key items:**
- Supabase Auth integration (email/password)
- RBAC middleware with role checks (`getCurrentUser`, `isSuperAdmin`, `isOrganisationAdminOrHigher`)
- Protected routes: `/admin/*` (super_admin), `/org` (organisation_admin+), `/dashboard` (all authenticated)

---

### 24 Dec 2024 — Milestone 2: Organisations and groups (mostly done)

**Status:** In Progress

Organisation admins can now access `/org` and see only the organisations they are assigned to. The org admin experience moved beyond placeholder into a usable management page showing groups and invite controls. Super admins manage all organisations via `/admin/organisations`.

**Key items:**
- `/org` page shows assigned organisations and their groups
- `/admin/organisations` for super admin platform-wide management
- Organisation and group data models in place

---

### 24 Dec 2024 — Milestone 3: Invite and join flow (substantially done)

**Status:** In Progress

End-to-end invite flow working: org admins generate invite links, users accept invites via `/invite/[token]`, create accounts, and join groups. Invite status tracking (invited → joined) confirmed via smoke tests. CSV bulk upload implemented for onboarding multiple users at once.

**Key items:**
- Generate shareable invite links per group
- `/invite/[token]` acceptance flow creates user and joins to group
- Invite status tracking (invited, joined) visible in org admin area
- CSV upload for bulk invites (up to 200 rows)

---

### 24 Dec 2024 — Docs governance

**Status:** Completed

Established `docs/spec/milestones.md` and `docs/spec/spec.md` as the single sources of truth. README guidance added. Terminology locked: organisations, groups, users (not communities, programmes, participants). Source-of-truth.md includes "Do Not Drift Terminology" section.

**Key items:**
- `milestones.md` and `spec.md` as canonical references
- `docs/spec/README.md` with source of truth guidance
- Terminology mapping documented

---

### 24 Dec 2024 — Milestone 3.5: UI foundation and component system

**Status:** Completed

Shared UI component kit created under `src/components/ui/` with `cn()` helper. Key pages (`/org`, `/dashboard`, `/invite/[token]`) migrated to use shared components for consistent styling. Smoke test checklist added. Home page admin link bug fixed by gating "Admin: Organisations" to signed-in super admins only.

**Key items:**
- Components: PageShell, Card, Button, Input, Badge, Table, EmptyState, Alert
- `src/lib/utils.ts` with `cn()` class name helper
- Pages migrated: `/org`, `/dashboard`, `/invite/[token]`
- `docs/dev/smoke-test.md` created
- Home page admin button now hidden for non-super-admins
