/**
 * Shared TypeScript type definitions for Curio MVP
 *
 * Database types will be auto-generated from Supabase schema
 * and imported here once configured.
 */

// =============================================================================
// Enums (matching database enums)
// =============================================================================

export type UserRole = "super_admin" | "organisation_admin" | "user";

export type GroupType = "organisation_connection" | "cohort_blitz" | "event";

export type GroupMemberStatus = "active" | "opted_out" | "removed";

export type Cadence =
  | "daily"
  | "every_2_days"
  | "every_3_days"
  | "weekly"
  | "fortnightly"
  | "monthly"
  | "quarterly"
  | "one_time";

export type MatchSize = "pairs" | "pairs_with_trios";

export type Channel = "email_manual" | "email_auto" | "slack" | "teams";

export type RoundStatus =
  | "draft"
  | "matched"
  | "pending_approval"
  | "sent"
  | "completed";

export type MatchType = "pair" | "trio";

export type PreferredCadence = "weekly" | "fortnightly" | "monthly" | "quarterly";

// =============================================================================
// Core Tables
// =============================================================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  last_login_at: string | null;
}

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

export interface Profile {
  id: string;
  user_id: string;
  role_title: string;
  organisation: string;
  linkedin_url: string;
  location: string;
  timezone: string;
  linkedin_data_consent: boolean;
  consent_given_at: string | null;
  professional_tags: string[];
  intro_goals: string[];
  personal_interests: Array<{ interest: string; weight: 1 | 2 | 3 }>;
  preferred_cadence: PreferredCadence;
  opt_in_status: boolean;
  sitting_out_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  organisation_id: string;
  name: string;
  description: string | null;
  group_type: GroupType;
  audience_description: string | null;
  cadence: Cadence;
  match_size: MatchSize;
  intro_window_days: number;
  channel: Channel;
  avoid_same_org: boolean;
  avoid_repeat_matches: boolean;
  repeat_match_cooldown: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  status: GroupMemberStatus;
  joined_at: string;
  left_at: string | null;
}

export interface Round {
  id: string;
  group_id: string;
  round_number: number;
  status: RoundStatus;
  triggered_at: string;
  matched_at: string | null;
  submitted_for_approval_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  sent_at: string | null;
  completed_at: string | null;
  member_count: number;
  match_count: number;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  round_id: string;
  user_ids: string[];
  match_type: MatchType;
  compatibility_score: number;
  created_at: string;
}

export interface IntroMessage {
  id: string;
  match_id: string;
  subject_line: string;
  body_html: string;
  body_plain: string;
  is_edited: boolean;
  edited_body: string | null;
  edited_at: string | null;
  edited_by: string | null;
  generated_at: string;
  created_at: string;
}

export interface Exclusion {
  id: string;
  group_id: string;
  user_1_id: string;
  user_2_id: string;
  reason: string | null;
  created_by: string;
  created_at: string;
}

export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface Connection {
  id: string;
  user_ids: string[];
  created_from_match_id: string;
  group_id: string;
  connected_at: string;
  created_at: string;
}
