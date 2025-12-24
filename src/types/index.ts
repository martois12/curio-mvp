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

// =============================================================================
// Group Membership
// =============================================================================

/**
 * Group membership status.
 */
export type GroupMemberStatus = "active" | "inactive";

/**
 * Group membership record.
 * DB table: group_members
 */
export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  status: GroupMemberStatus;
  created_at: string;
}

/**
 * Group with membership info for user display.
 */
export interface UserGroup {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  membership_id: string;
  membership_status: GroupMemberStatus;
  organisation_name: string;
}

// =============================================================================
// Group Join Links
// =============================================================================

/**
 * Multi-use join link for a group.
 * DB table: group_join_links
 */
export interface GroupJoinLink {
  id: string;
  group_id: string;
  organisation_id: string;
  token: string;
  is_active: boolean;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
}

/**
 * Record of a user redeeming a join link.
 * DB table: group_join_link_redemptions
 */
export interface GroupJoinLinkRedemption {
  id: string;
  join_link_id: string;
  user_id: string;
  redeemed_at: string;
}
