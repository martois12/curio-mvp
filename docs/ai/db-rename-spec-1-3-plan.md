# Database Rename Plan — Spec 1.3 Alignment

> **Created:** 2025-12-21
> **Source of Truth:** `docs/spec/Curio Spec 1.3 - Group Introductions.docx`
> **Scope:** Full database schema rename to match Spec 1.3 terminology

---

## Overview

This document provides a comprehensive rename map and migration strategy to align the database schema with Spec 1.3 terminology. The goal is correctness over speed—every reference must be updated.

### Terminology Transformation

| Old (Spec 1.1) | New (Spec 1.3) |
|----------------|----------------|
| `community` | `organisation` |
| `communities` | `organisations` |
| `community_admin` | `organisation_admin` |
| `community_admins` | `organisation_admins` |
| `community_id` | `organisation_id` |
| `programme` | `group` |
| `programmes` | `groups` |
| `programme_type` | `group_type` |
| `programme_id` | `group_id` |
| `programme_participant` | `group_member` |
| `programme_participants` | `group_members` |
| `programme_participant_status` | `group_member_status` |
| `participant` (role) | `user` (role) |

---

## Part 1: ENUM Renames

### 1.1 `user_role` — Rename Values

```sql
-- Current
CREATE TYPE user_role AS ENUM ('super_admin', 'community_admin', 'participant');

-- Target
ALTER TYPE user_role RENAME VALUE 'community_admin' TO 'organisation_admin';
ALTER TYPE user_role RENAME VALUE 'participant' TO 'user';
```

**Note:** PostgreSQL 10+ supports `ALTER TYPE ... RENAME VALUE`.

### 1.2 `programme_type` → `group_type`

```sql
-- Rename the type
ALTER TYPE programme_type RENAME TO group_type;

-- Rename value (optional, but consistent)
ALTER TYPE group_type RENAME VALUE 'community_connection' TO 'organisation_connection';
```

### 1.3 `programme_participant_status` → `group_member_status`

```sql
ALTER TYPE programme_participant_status RENAME TO group_member_status;
```

### Summary: Enum Changes

| Current Enum | New Enum | Value Changes |
|--------------|----------|---------------|
| `user_role` | `user_role` | `community_admin` → `organisation_admin`, `participant` → `user` |
| `programme_type` | `group_type` | `community_connection` → `organisation_connection` |
| `programme_participant_status` | `group_member_status` | None |

---

## Part 2: Table Renames

### 2.1 Tables to Rename

| Current Table | New Table |
|---------------|-----------|
| `communities` | `organisations` |
| `community_admins` | `organisation_admins` |
| `programmes` | `groups` |
| `programme_participants` | `group_members` |

```sql
ALTER TABLE communities RENAME TO organisations;
ALTER TABLE community_admins RENAME TO organisation_admins;
ALTER TABLE programmes RENAME TO groups;
ALTER TABLE programme_participants RENAME TO group_members;
```

### 2.2 Tables Unchanged

| Table | Reason |
|-------|--------|
| `users` | Already correct |
| `profiles` | No terminology conflict |
| `rounds` | No terminology conflict |
| `matches` | No terminology conflict |
| `intro_messages` | No terminology conflict |
| `exclusions` | No terminology conflict (but has FK changes) |
| `blocked_participants` | Keep as-is or rename to `blocked_users` |
| `connections` | No terminology conflict (but has FK changes) |

**Decision on `blocked_participants`:** The term "participant" here refers to a user who is blocked. Spec 1.3 calls users "users", so this should become `blocked_users` for consistency.

```sql
ALTER TABLE blocked_participants RENAME TO blocked_users;
```

---

## Part 3: Column Renames

### 3.1 Foreign Key Columns

| Table (Old → New) | Column (Old) | Column (New) |
|-------------------|--------------|--------------|
| `organisation_admins` | `community_id` | `organisation_id` |
| `groups` | `community_id` | `organisation_id` |
| `groups` | `programme_type` | `group_type` |
| `group_members` | `programme_id` | `group_id` |
| `rounds` | `programme_id` | `group_id` |
| `exclusions` | `programme_id` | `group_id` |
| `connections` | `programme_id` | `group_id` |

```sql
-- organisation_admins
ALTER TABLE organisation_admins RENAME COLUMN community_id TO organisation_id;

-- groups
ALTER TABLE groups RENAME COLUMN community_id TO organisation_id;
ALTER TABLE groups RENAME COLUMN programme_type TO group_type;

-- group_members
ALTER TABLE group_members RENAME COLUMN programme_id TO group_id;

-- rounds
ALTER TABLE rounds RENAME COLUMN programme_id TO group_id;

-- exclusions
ALTER TABLE exclusions RENAME COLUMN programme_id TO group_id;

-- connections
ALTER TABLE connections RENAME COLUMN programme_id TO group_id;
```

### 3.2 Columns in `exclusions` table

The columns `participant_1_id` and `participant_2_id` reference users. For consistency with "user" terminology:

| Current | New |
|---------|-----|
| `participant_1_id` | `user_1_id` |
| `participant_2_id` | `user_2_id` |

```sql
ALTER TABLE exclusions RENAME COLUMN participant_1_id TO user_1_id;
ALTER TABLE exclusions RENAME COLUMN participant_2_id TO user_2_id;
```

### 3.3 Array Columns in `matches` and `connections`

Both tables have `participant_ids UUID[]`. Rename to `user_ids`:

```sql
ALTER TABLE matches RENAME COLUMN participant_ids TO user_ids;
ALTER TABLE connections RENAME COLUMN participant_ids TO user_ids;
```

### 3.4 Statistics Column in `rounds`

| Current | New |
|---------|-----|
| `participant_count` | `member_count` |

```sql
ALTER TABLE rounds RENAME COLUMN participant_count TO member_count;
```

---

## Part 4: Index Renames

PostgreSQL indexes must be renamed explicitly. Here's the complete list:

### 4.1 `organisations` table (was `communities`)

```sql
ALTER INDEX idx_communities_slug RENAME TO idx_organisations_slug;
ALTER INDEX idx_communities_is_active RENAME TO idx_organisations_is_active;
```

### 4.2 `organisation_admins` table (was `community_admins`)

```sql
ALTER INDEX idx_community_admins_user_id RENAME TO idx_organisation_admins_user_id;
ALTER INDEX idx_community_admins_community_id RENAME TO idx_organisation_admins_organisation_id;
```

### 4.3 `groups` table (was `programmes`)

```sql
ALTER INDEX idx_programmes_community_id RENAME TO idx_groups_organisation_id;
ALTER INDEX idx_programmes_is_active RENAME TO idx_groups_is_active;
ALTER INDEX idx_programmes_programme_type RENAME TO idx_groups_group_type;
```

### 4.4 `group_members` table (was `programme_participants`)

```sql
ALTER INDEX idx_programme_participants_programme_id RENAME TO idx_group_members_group_id;
ALTER INDEX idx_programme_participants_user_id RENAME TO idx_group_members_user_id;
ALTER INDEX idx_programme_participants_status RENAME TO idx_group_members_status;
```

### 4.5 `rounds` table

```sql
ALTER INDEX idx_rounds_programme_id RENAME TO idx_rounds_group_id;
```

### 4.6 `exclusions` table

```sql
ALTER INDEX idx_exclusions_programme_id RENAME TO idx_exclusions_group_id;
ALTER INDEX idx_exclusions_participants RENAME TO idx_exclusions_users;
```

### 4.7 `connections` table

```sql
ALTER INDEX idx_connections_programme_id RENAME TO idx_connections_group_id;
ALTER INDEX idx_connections_participant_ids RENAME TO idx_connections_user_ids;
```

### 4.8 `matches` table

```sql
ALTER INDEX idx_matches_participant_ids RENAME TO idx_matches_user_ids;
```

### 4.9 `blocked_users` table (was `blocked_participants`)

```sql
ALTER INDEX idx_blocked_participants_blocker_id RENAME TO idx_blocked_users_blocker_id;
ALTER INDEX idx_blocked_participants_blocked_id RENAME TO idx_blocked_users_blocked_id;
```

---

## Part 5: Constraint Renames

### 5.1 Check Constraints

| Table | Current Constraint | New Constraint |
|-------|-------------------|----------------|
| `matches` | `valid_participant_count` | `valid_user_count` |
| `exclusions` | `exclusion_participant_order` | `exclusion_user_order` |
| `blocked_users` | `no_self_block` | `no_self_block` (unchanged) |

PostgreSQL doesn't support renaming constraints directly. Must drop and recreate:

```sql
-- matches: valid_participant_count → valid_user_count
ALTER TABLE matches DROP CONSTRAINT valid_participant_count;
ALTER TABLE matches ADD CONSTRAINT valid_user_count CHECK (
  (match_type = 'pair' AND array_length(user_ids, 1) = 2) OR
  (match_type = 'trio' AND array_length(user_ids, 1) = 3)
);

-- exclusions: exclusion_participant_order → exclusion_user_order
ALTER TABLE exclusions DROP CONSTRAINT exclusion_participant_order;
ALTER TABLE exclusions ADD CONSTRAINT exclusion_user_order CHECK (user_1_id < user_2_id);
```

### 5.2 Unique Constraints

| Table | Current | New |
|-------|---------|-----|
| `organisation_admins` | `UNIQUE(user_id, community_id)` | `UNIQUE(user_id, organisation_id)` |
| `group_members` | `UNIQUE(programme_id, user_id)` | `UNIQUE(group_id, user_id)` |
| `rounds` | `UNIQUE(programme_id, round_number)` | `UNIQUE(group_id, round_number)` |
| `exclusions` | `UNIQUE(programme_id, participant_1_id, participant_2_id)` | `UNIQUE(group_id, user_1_id, user_2_id)` |

These are automatically handled when columns are renamed—PostgreSQL updates the constraint definitions.

---

## Part 6: Trigger Renames

```sql
ALTER TRIGGER update_communities_updated_at ON organisations RENAME TO update_organisations_updated_at;
ALTER TRIGGER update_programmes_updated_at ON groups RENAME TO update_groups_updated_at;
```

---

## Part 7: Comment Updates

```sql
-- Table comments
COMMENT ON TABLE organisations IS 'Top-level organizational units that contain groups and users';
COMMENT ON TABLE organisation_admins IS 'Maps users to organisations they can administer';
COMMENT ON TABLE groups IS 'Introduction groups that run within an organisation';
COMMENT ON TABLE group_members IS 'Enrollment records linking users to groups';
COMMENT ON TABLE blocked_users IS 'User-initiated blocks preventing matching between two users';

-- Column comments
COMMENT ON COLUMN groups.repeat_match_cooldown IS 'Number of rounds before a pair can be matched again';
COMMENT ON COLUMN matches.compatibility_score IS 'Score from 0.0 to 1.0 based on matching algorithm';
COMMENT ON COLUMN matches.user_ids IS '2 or 3 user IDs in this match';
COMMENT ON COLUMN profiles.personal_interests IS 'Array of {interest: string, weight: 1-3} objects';

-- Enum comments
COMMENT ON TYPE user_role IS 'User role hierarchy: super_admin > organisation_admin > user';
COMMENT ON TYPE group_type IS 'Types of introduction groups';

-- Constraint comments
COMMENT ON CONSTRAINT exclusion_user_order ON exclusions IS 'Ensures consistent ordering to prevent duplicate exclusions';
```

---

## Part 8: Application Code Changes

### 8.1 TypeScript Types (`src/types/index.ts`)

| Current | New |
|---------|-----|
| `Community` | `Organisation` |
| `CommunityMember` | Remove or replace with `OrganisationAdmin` |
| `community_id` field | `organisation_id` |
| `role: "participant"` | `role: "user"` |

**New types file structure:**

```typescript
export interface Organisation {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganisationAdmin {
  id: string;
  user_id: string;
  organisation_id: string;
  assigned_at: string;
}

export interface Group {
  id: string;
  organisation_id: string;
  name: string;
  description: string | null;
  group_type: 'organisation_connection' | 'cohort_blitz' | 'event';
  // ... other fields
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  status: 'active' | 'opted_out' | 'removed';
  joined_at: string;
  left_at: string | null;
}

export type UserRole = 'super_admin' | 'organisation_admin' | 'user';
```

### 8.2 File/Folder Renames

| Current Path | New Path |
|--------------|----------|
| `src/app/admin/communities/page.tsx` | `src/app/admin/organisations/page.tsx` |

### 8.3 Supabase Queries

| File | Change |
|------|--------|
| `src/app/admin/organisations/page.tsx` | `.from("communities")` → `.from("organisations")` |

### 8.4 UI Labels

| File | Current Text | New Text |
|------|--------------|----------|
| `src/app/layout.tsx` | "Smart Introductions for Communities" | "Smart Introductions for Organisations" |
| `src/app/page.tsx` | "Smart introductions for communities" | "Smart introductions for organisations" |
| `src/app/page.tsx` | "Admin: Communities" | "Admin: Organisations" |
| `src/app/dashboard/page.tsx` | "My Communities" | "My Organisations" or "My Groups" |
| `src/app/admin/organisations/page.tsx` | "Communities" title | "Organisations" |
| `src/app/admin/organisations/page.tsx` | "No communities found" | "No organisations found" |

---

## Part 9: Migration Strategy

### Recommended: Full Schema Replacement (Early Stage Project)

Since this is an early-stage project with no production data, the safest and cleanest approach is:

1. **Create a new migration file** that drops all objects and recreates them with correct names
2. **Reset local database** (`supabase db reset`)
3. **Update application code** in the same PR

### Migration File: `0002_rename_to_spec_1_3.sql`

The migration should:

1. Drop all triggers (they reference tables)
2. Drop all tables (CASCADE handles FKs)
3. Drop all custom types
4. Recreate everything with new names

**Why full replacement instead of ALTER statements?**

- Cleaner: No fragmented history of renames
- Safer: No risk of missed references
- Simpler: One coherent schema file
- Zero data loss risk: No production data yet

### Alternative: Incremental ALTER Statements

If data preservation is needed later, use the ALTER statements documented above in order:

1. Rename enums and their values
2. Rename tables
3. Rename columns
4. Rename indexes
5. Drop and recreate constraints
6. Rename triggers
7. Update comments

---

## Part 10: Implementation Checklist

### Database (Migration File)

- [ ] Create `0002_rename_to_spec_1_3.sql`
- [ ] Update `user_role` enum values
- [ ] Rename `programme_type` → `group_type` enum
- [ ] Rename `programme_participant_status` → `group_member_status` enum
- [ ] Rename `communities` → `organisations` table
- [ ] Rename `community_admins` → `organisation_admins` table
- [ ] Rename `programmes` → `groups` table
- [ ] Rename `programme_participants` → `group_members` table
- [ ] Rename `blocked_participants` → `blocked_users` table
- [ ] Rename all `community_id` columns → `organisation_id`
- [ ] Rename all `programme_id` columns → `group_id`
- [ ] Rename `programme_type` column → `group_type`
- [ ] Rename `participant_ids` → `user_ids` (matches, connections)
- [ ] Rename `participant_1_id`, `participant_2_id` → `user_1_id`, `user_2_id` (exclusions)
- [ ] Rename `participant_count` → `member_count` (rounds)
- [ ] Rename all indexes
- [ ] Update all constraints
- [ ] Rename triggers
- [ ] Update all comments
- [ ] Test migration locally

### Application Code

- [ ] Update `src/types/index.ts` with new types
- [ ] Rename `src/app/admin/communities/` → `src/app/admin/organisations/`
- [ ] Update Supabase query in organisations page
- [ ] Update UI labels in `layout.tsx`
- [ ] Update UI labels in `page.tsx`
- [ ] Update UI labels in `dashboard/page.tsx`
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm lint`

---

## Appendix A: Complete New Schema (Target State)

After migration, the schema should look like this:

```
organisations
├── id (uuid, PK)
├── name (text)
├── slug (text, unique)
├── description (text)
├── is_active (boolean)
├── created_at (timestamptz)
└── updated_at (timestamptz)

users
├── id (uuid, PK, FK → auth.users)
├── email (text, unique)
├── full_name (text)
├── role (user_role: super_admin, organisation_admin, user)
├── created_at (timestamptz)
└── last_login_at (timestamptz)

organisation_admins
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── organisation_id (uuid, FK → organisations)
└── assigned_at (timestamptz)

groups
├── id (uuid, PK)
├── organisation_id (uuid, FK → organisations)
├── name (text)
├── description (text)
├── group_type (group_type enum)
├── audience_description (text)
├── cadence (cadence enum)
├── match_size (match_size enum)
├── intro_window_days (integer)
├── channel (channel enum)
├── avoid_same_org (boolean)
├── avoid_repeat_matches (boolean)
├── repeat_match_cooldown (integer)
├── is_active (boolean)
├── created_at (timestamptz)
└── updated_at (timestamptz)

group_members
├── id (uuid, PK)
├── group_id (uuid, FK → groups)
├── user_id (uuid, FK → users)
├── status (group_member_status enum)
├── joined_at (timestamptz)
└── left_at (timestamptz)

rounds
├── id (uuid, PK)
├── group_id (uuid, FK → groups)
├── round_number (integer)
├── status (round_status enum)
├── triggered_at (timestamptz)
├── matched_at (timestamptz)
├── submitted_for_approval_at (timestamptz)
├── approved_at (timestamptz)
├── approved_by (uuid, FK → users)
├── sent_at (timestamptz)
├── completed_at (timestamptz)
├── member_count (integer)
├── match_count (integer)
├── created_at (timestamptz)
└── updated_at (timestamptz)

matches
├── id (uuid, PK)
├── round_id (uuid, FK → rounds)
├── user_ids (uuid[])
├── match_type (match_type enum)
├── compatibility_score (real)
└── created_at (timestamptz)

exclusions
├── id (uuid, PK)
├── group_id (uuid, FK → groups)
├── user_1_id (uuid, FK → users)
├── user_2_id (uuid, FK → users)
├── reason (text)
├── created_by (uuid, FK → users)
└── created_at (timestamptz)

blocked_users
├── id (uuid, PK)
├── blocker_id (uuid, FK → users)
├── blocked_id (uuid, FK → users)
└── created_at (timestamptz)

connections
├── id (uuid, PK)
├── user_ids (uuid[])
├── created_from_match_id (uuid, FK → matches)
├── group_id (uuid, FK → groups)
├── connected_at (timestamptz)
└── created_at (timestamptz)
```

---

## Appendix B: Enum Target State

```sql
CREATE TYPE user_role AS ENUM ('super_admin', 'organisation_admin', 'user');
CREATE TYPE group_type AS ENUM ('organisation_connection', 'cohort_blitz', 'event');
CREATE TYPE group_member_status AS ENUM ('active', 'opted_out', 'removed');
CREATE TYPE cadence AS ENUM ('daily', 'every_2_days', 'every_3_days', 'weekly', 'fortnightly', 'monthly', 'quarterly', 'one_time');
CREATE TYPE match_size AS ENUM ('pairs', 'pairs_with_trios');
CREATE TYPE channel AS ENUM ('email_manual', 'email_auto', 'slack', 'teams');
CREATE TYPE round_status AS ENUM ('draft', 'matched', 'pending_approval', 'sent', 'completed');
CREATE TYPE match_type AS ENUM ('pair', 'trio');
CREATE TYPE preferred_cadence AS ENUM ('weekly', 'fortnightly', 'monthly', 'quarterly');
```
