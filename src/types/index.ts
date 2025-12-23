/**
 * Shared TypeScript type definitions for Curio MVP
 */

// =============================================================================
// User Roles
// =============================================================================

/**
 * User roles.
 * Database enum: super_admin, organisation_admin, user
 */
export type UserRole = "super_admin" | "organisation_admin" | "user";

// =============================================================================
// Core Types
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
 * DB table: organisations
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
 * Organisation admin relationship.
 * DB table: organisation_admins
 */
export interface OrganisationMember {
  id: string;
  user_id: string;
  organisation_id: string;
  assigned_at: string;
}

/**
 * Group type enum.
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
 * DB table: groups
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
// Invites
// =============================================================================

/**
 * Invite status values.
 * Stored as TEXT with CHECK constraint in database.
 */
export type InviteStatus = "invited" | "joined";

/**
 * Group invite for joining a group.
 * DB table: invites
 */
export interface GroupInvite {
  id: string;
  group_id: string;
  token: string;
  email: string | null;
  status: InviteStatus;
  created_at: string;
  joined_at: string | null;
}
