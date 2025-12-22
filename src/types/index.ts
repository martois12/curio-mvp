/**
 * Shared TypeScript type definitions for Curio MVP
 *
 * Uses Spec 1.3 terminology. See docs/spec/source-of-truth.md for mapping.
 *
 * Note: Database tables use legacy names (communities, programmes, etc.)
 * but application types use Spec 1.3 names. Map at the data access layer.
 */

// =============================================================================
// User Roles (Spec 1.3)
// =============================================================================

/**
 * User roles as per Spec 1.3.
 * Database enum uses legacy values: super_admin, community_admin, participant
 */
export type UserRole = "super_admin" | "organisation_admin" | "user";

/**
 * Legacy role values as stored in the database (migration 0001).
 * Use these when querying the database directly.
 */
export type LegacyUserRole = "super_admin" | "community_admin" | "participant";

/**
 * Maps legacy database role to Spec 1.3 role.
 */
export function mapLegacyRole(legacyRole: LegacyUserRole): UserRole {
  switch (legacyRole) {
    case "super_admin":
      return "super_admin";
    case "community_admin":
      return "organisation_admin";
    case "participant":
      return "user";
  }
}

/**
 * Maps Spec 1.3 role to legacy database role.
 */
export function mapToLegacyRole(role: UserRole): LegacyUserRole {
  switch (role) {
    case "super_admin":
      return "super_admin";
    case "organisation_admin":
      return "community_admin";
    case "user":
      return "participant";
  }
}

// =============================================================================
// Core Types (Spec 1.3)
// =============================================================================

/**
 * User profile extending Supabase auth.users.
 * DB table: users
 */
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

/**
 * Organisation (top-level container entity).
 * DB table: organisations (renamed from communities)
 */
export interface Organisation {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Organisation member relationship.
 * DB table: organisation_admins (renamed from community_admins)
 */
export interface OrganisationMember {
  id: string;
  user_id: string;
  organisation_id: string;
  assigned_at: string;
}

/**
 * Group type enum (Spec 1.3).
 */
export type GroupType = "organisation_connection" | "cohort_blitz" | "event";

/**
 * Cadence options for groups.
 */
export type Cadence =
  | "daily"
  | "every_2_days"
  | "every_3_days"
  | "weekly"
  | "fortnightly"
  | "monthly"
  | "quarterly"
  | "one_time";

/**
 * Introduction group within an organisation.
 * DB table: groups (renamed from programmes)
 */
export interface Group {
  id: string;
  organisation_id: string;
  name: string;
  description: string | null;
  group_type: GroupType;
  audience_description: string | null;
  cadence: Cadence;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Introduction request/match.
 * DB table: introductions
 */
export interface Introduction {
  id: string;
  requester_id: string;
  target_id: string | null;
  organisation_id: string;
  status: "pending" | "matched" | "completed" | "declined";
  context: string | null;
  created_at: string;
}

// =============================================================================
// Invites (Spec 1.3)
// =============================================================================

/**
 * Invite status values.
 * Stored as TEXT with CHECK constraint in database.
 */
export type InviteStatus = "invited" | "joined";

/**
 * Group invite for joining a group.
 * DB table: invites (programme_id references programmes)
 */
export interface GroupInvite {
  id: string;
  group_id: string; // Spec 1.3 name (DB column: programme_id)
  token: string;
  email: string | null;
  status: InviteStatus;
  created_at: string;
  joined_at: string | null;
}

// =============================================================================
// Legacy Type Aliases (for backwards compatibility during migration)
// =============================================================================

/**
 * @deprecated Use Organisation instead. Will be removed after DB migration.
 */
export type Community = Organisation;

/**
 * @deprecated Use OrganisationMember instead. Will be removed after DB migration.
 */
export type CommunityMember = OrganisationMember;

/**
 * @deprecated Use Group instead. Will be removed after DB migration.
 */
export type Programme = Group;
