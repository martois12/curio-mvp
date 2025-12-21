# Spec 1.3 Alignment Plan

> **Created:** 2025-12-21
> **Source of Truth:** `docs/spec/Curio Spec 1.3 - Group Introductions.docx`, `docs/spec/Curio 1.3 - User Stories & Milestones.docx`

---

## Summary

Spec 1.3 introduces **terminology changes** and **refined user flows** compared to the existing codebase (built against Spec 1.1). The goal is to align with Spec 1.3 with **minimum rework**.

### Terminology Mapping

| Current (Spec 1.1) | New (Spec 1.3) | Notes |
|--------------------|----------------|-------|
| `community` | `organisation` | Top-level entity (co-working space, innovation hub, etc.) |
| `community_admin` | `organisation_admin` | Manages an organisation |
| `participant` | `user` | Community member seeking introductions |
| `programme` | `group` | Container for users within an organisation |
| `programme_participant` | `group_member` | Membership in a group |

---

## What We Keep As-Is

### Database Tables (No Rename)
To avoid migration complexity and reduce risk, we **keep the existing table names**:

| Table | Rationale |
|-------|-----------|
| `communities` | Semantically equivalent to "organisations" - just a naming preference |
| `programmes` | Semantically equivalent to "groups" |
| `programme_participants` | Junction table, internal to DB |
| `community_admins` | Junction table for admin assignment |
| All other tables | No terminology conflicts |

**Why:** Renaming tables requires migration scripts, updating all queries, RLS policies, and foreign key references. The current schema is structurally correct; only the labels differ.

### Schema Structure
- All columns and relationships remain unchanged
- Matching algorithm, rounds, intro messages - all structurally compatible

---

## What We Rename

### 1. User Role Enum (DB-Level Migration Required)

**Current:**
```sql
CREATE TYPE user_role AS ENUM ('super_admin', 'community_admin', 'participant');
```

**New:**
```sql
ALTER TYPE user_role RENAME VALUE 'community_admin' TO 'organisation_admin';
ALTER TYPE user_role RENAME VALUE 'participant' TO 'user';
```

**Scope:** Single migration, no data loss, minimal risk.

### 2. TypeScript Types (Code-Level)

Update `src/types/index.ts`:

| Current Type | New Type |
|--------------|----------|
| `Community` | `Organisation` |
| `CommunityMember` | Keep or deprecate (not used in schema) |
| Role enum values | Match DB enum changes |

### 3. UI Labels (Code-Level)

| Current | New |
|---------|-----|
| "Communities" page title | "Organisations" |
| "Community Admin" role display | "Organisation Admin" |
| "Participant" | "User" or "Member" |
| "Programme" | "Group" |
| URL `/admin/communities` | `/admin/organisations` |

### 4. File/Folder Naming

| Current Path | New Path |
|--------------|----------|
| `src/app/admin/communities/page.tsx` | `src/app/admin/organisations/page.tsx` |

---

## What We Delete or Deprecate

### Code to Remove
- None currently - the codebase is minimal

### Specs to Archive
- `docs/ai/curio_mvp_spec.md` (Spec 1.1) - mark as superseded or delete

---

## Profile & Onboarding Changes (Spec 1.3 Additions)

Spec 1.3 introduces a **more detailed profile structure** than currently in the schema:

| Field | Current Schema | Spec 1.3 Requirement | Action |
|-------|----------------|----------------------|--------|
| `role_title` | ✅ Exists | ✅ Required | Keep |
| `company` | Uses `organisation` | Spec says "Company" | Keep as `organisation` |
| `tagline` | ❌ Missing | Required in Spec 1.3 | Add in future milestone |
| Skills mapping | Uses `professional_tags` | Spec 1.3 has detailed skill categories with proficiency levels | Add in Milestone 4 |
| Personal interests | ✅ `personal_interests` JSONB | Spec 1.3 adds "dislike" option | Extend JSONB structure |
| LinkedIn PDF upload | ❌ Missing | Milestone 4.5 | Add later |

**Recommendation:** These are enhancements for Milestone 4+. Do not implement yet.

---

## Next Milestone to Implement

### Milestone 1: Skeleton App and Access Control (Tight Scope)

Based on Spec 1.3 User Stories, the immediate priority is:

> "Secure sign-in plus role-based access control for Super Admin, Organisation Admin, and User."

#### Scope

1. **Auth Setup**
   - Supabase Auth integration (magic link or email/password)
   - Protected routes middleware

2. **Role-Based Access Control**
   - Middleware to check user role on protected routes
   - Route guards for:
     - `/admin/*` → requires `super_admin`
     - `/org/*` → requires `organisation_admin` (scoped to their org)
     - `/dashboard/*` → requires `user` or higher

3. **Super Admin Sign-In Page**
   - Basic login form
   - Redirect to admin dashboard on success

4. **Database Migration**
   - Rename `user_role` enum values (`community_admin` → `organisation_admin`, `participant` → `user`)

#### Out of Scope for Milestone 1
- Organisation creation UI
- Group creation UI
- User profile flows
- Any matching or intro features

#### Deliverables
- [ ] Auth middleware with role checking
- [ ] Protected route setup (admin, org-admin, user)
- [ ] Login page (Super Admin)
- [ ] Migration: `0002_rename_user_roles.sql`
- [ ] Updated TypeScript types
- [ ] Renamed admin page: `communities` → `organisations`

---

## Implementation Order (Minimum Rework)

1. **Migration first** - rename enum values
2. **Types second** - update TypeScript definitions
3. **UI third** - rename routes and labels
4. **Auth last** - implement RBAC middleware

This order ensures the data layer is correct before UI changes, avoiding mismatches.

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Enum rename breaks queries | Test in dev first; Supabase supports `ALTER TYPE ... RENAME VALUE` |
| Route changes break bookmarks | Minimal user base at MVP stage |
| Type changes cause compile errors | Run `pnpm typecheck` after each change |

---

## Appendix: Spec 1.3 Milestone Summary

| Milestone | Description | Dependencies |
|-----------|-------------|--------------|
| 1 | Skeleton app + RBAC | None |
| 2 | Organisations + Groups | Milestone 1 |
| 3 | Invite + Join flow | Milestone 2 |
| 4 | Profile creation | Milestone 3 |
| 4.5 | LinkedIn PDF (optional) | Milestone 4 |
| 5 | Directory + overlap view | Milestone 4 |
| 6 | First intro round (manual) | Milestone 5 |
| 6.5 | LinkedIn in intros (optional) | Milestone 6 |
| 7 | Connection tracking | Milestone 6 |
| 8 | Scheduling | Milestone 6 |
| 9 | Share profile (growth) | Milestone 4 |
| 10 | Admin reporting | Milestone 6 |
