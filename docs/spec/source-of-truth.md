# Curio Spec 1.3 — Source of Truth

> **Version:** 1.3
> **Last Updated:** 2025-12-22

This document defines the canonical terminology for Curio as of Spec 1.3. All new code and documentation should use these terms.

---

## Terminology Mapping

| Spec 1.3 (Current) | Legacy (Spec 1.1) | Notes |
|--------------------|-------------------|-------|
| **organisation** | community | Top-level container entity |
| **group** | programme | Introduction series within an organisation |
| **organisation_admin** | community_admin | Admin role for an organisation |
| **user** | participant | End-user role (member receiving introductions) |

---

## Current Role Hierarchy

```
super_admin
    └── organisation_admin
            └── user
```

| Role | Description |
|------|-------------|
| `super_admin` | Platform-wide administration |
| `organisation_admin` | Manages a specific organisation and its groups |
| `user` | Organisation member who receives introductions |

---

## Database Schema Status

### Migration Files

| Migration | Status | Description |
|-----------|--------|-------------|
| `0001_init_curio_schema.sql` | **Legacy** | Uses old terminology (`communities`, `programmes`, `community_admin`, `participant`). Retained for backwards compatibility. |
| `0002_rename_schema_to_spec_1_3.sql` | **Planned** | Renames tables and columns to Spec 1.3 terminology (not created yet) |

### Current Table Names (Spec 1.3)

| Table | Description |
|-------|-------------|
| `organisations` | Top-level container entities |
| `groups` | Introduction series within an organisation |
| `group_members` | User membership in groups |
| `organisation_admins` | Admin assignments to organisations |
| `blocked_users` | User block relationships |

### Key Columns

- `organisation_id`
- `group_id`
- `user_id`
- `user_ids`
- `user_1_id`
- `user_2_id`

### Current Enum Values (Spec 1.3)

| Enum | Values |
|------|--------|
| `user_role` | `super_admin`, `organisation_admin`, `user` |
| `group_type` | `organisation_connection`, `cohort_blitz`, `event` |

---

## Application Code Conventions

### TypeScript Types

Use Spec 1.3 terminology in all TypeScript code:

```typescript
// Correct (Spec 1.3)
type UserRole = "super_admin" | "organisation_admin" | "user";

interface Organisation {
  id: string;
  name: string;
  // ...
}

interface Group {
  id: string;
  organisation_id: string;
  // ...
}
```

---

## Route Structure

| Route | Purpose | Allowed Roles |
|-------|---------|---------------|
| `/admin/organisations` | Super admin platform management | `super_admin` |
| `/org/*` | Organisation admin management | `super_admin`, `organisation_admin` |
| `/dashboard` | User dashboard | All authenticated users |

---

## Documentation

- **Current specs:** `docs/spec/` (Spec 1.3)
- **Deprecated specs:** `docs/archive/` (Spec 1.1 and earlier)

---

## Do Not Drift Terminology

**Milestones reference:** All milestone definitions and user stories are in [`docs/spec/milestones.md`](./milestones.md).

When writing code, documentation, or specs:
- Use **organisations**, **groups**, and **users** — never communities, programmes, or participants.
- If you see legacy terminology in older files, do not propagate it to new code.
- The milestones file is the single source of truth for feature scope and user stories.

---

## Important Note

The file `supabase/migrations/0001_init_curio_schema.sql` contains legacy names by definition. A Spec 1.3 rename migration is planned but has not been created yet.
