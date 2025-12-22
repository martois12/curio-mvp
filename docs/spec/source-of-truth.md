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
| `0002_*` (future) | **Current** | Will use Spec 1.3 terminology when created |

### Current Table Names (Legacy — from 0001)

These table names exist in the database but use legacy terminology:

| Current Table | Spec 1.3 Equivalent | Notes |
|--------------|---------------------|-------|
| `communities` | `organisations` | Legacy name, keep until migration |
| `programmes` | `groups` | Legacy name, keep until migration |
| `community_admins` | `organisation_admins` | Legacy name, keep until migration |
| `programme_participants` | `group_members` | Legacy name, keep until migration |

### Current Enum Values (Legacy — from 0001)

| Enum | Current Values | Spec 1.3 Values |
|------|----------------|-----------------|
| `user_role` | `super_admin`, `community_admin`, `participant` | `super_admin`, `organisation_admin`, `user` |
| `programme_type` | `community_connection`, `cohort_blitz`, `event` | `ongoing`, `cohort_blitz`, `event` |

---

## Application Code Conventions

### TypeScript Types

Use Spec 1.3 terminology in all new TypeScript code:

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

// Incorrect (Legacy)
type UserRole = "super_admin" | "community_admin" | "participant";
interface Community { ... }
interface Programme { ... }
```

### Database Queries

When querying the database, use the actual table names (legacy) but map to Spec 1.3 types in code:

```typescript
// Query uses legacy table name
const { data } = await supabase.from("communities").select("*");

// Map to Spec 1.3 type
const organisations: Organisation[] = data;
```

---

## Route Structure

| Route | Purpose | Allowed Roles |
|-------|---------|---------------|
| `/admin/*` | Super admin platform management | `super_admin` |
| `/org/*` | Organisation admin management | `super_admin`, `organisation_admin` |
| `/dashboard` | User dashboard | All authenticated users |

---

## Documentation

- **Current specs:** `docs/spec/` (Spec 1.3 .docx files)
- **Deprecated specs:** `docs/archive/` (Spec 1.1 and earlier)
- **Architecture:** `docs/ai/architecture_overview.md` (uses Spec 1.3 terminology)

---

## Migration Notes

The database currently uses legacy terminology from migration `0001`. A future migration will rename:

1. Tables: `communities` → `organisations`, `programmes` → `groups`
2. Columns: `community_id` → `organisation_id`, `programme_id` → `group_id`
3. Enums: `community_admin` → `organisation_admin`, `participant` → `user`

Until then, application code should:
- Use Spec 1.3 terminology in types, interfaces, and documentation
- Use legacy names when directly querying tables/columns
- Map between legacy database names and Spec 1.3 types at the data access layer
