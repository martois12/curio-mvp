/**
 * Shared TypeScript type definitions for Curio MVP
 *
 * Database types will be auto-generated from Supabase schema
 * and imported here once configured.
 */

// Placeholder types - will be replaced with generated types
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  user_id: string;
  community_id: string;
  role: "admin" | "participant";
  joined_at: string;
}

export interface Introduction {
  id: string;
  requester_id: string;
  target_id: string | null;
  community_id: string;
  status: "pending" | "matched" | "completed" | "declined";
  context: string | null;
  created_at: string;
}

// Spec 1.3 terminology: Organisation maps to "communities" table in DB
export interface Organisation {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Spec 1.3 terminology: Group maps to "programmes" table in DB
export type GroupType = "community_connection" | "cohort_blitz" | "event";
export type Cadence =
  | "daily"
  | "every_2_days"
  | "every_3_days"
  | "weekly"
  | "fortnightly"
  | "monthly"
  | "quarterly"
  | "one_time";

export interface Group {
  id: string;
  organisation_id: string; // maps to community_id in DB
  name: string;
  description: string | null;
  group_type: GroupType; // maps to programme_type in DB
  audience_description: string | null;
  cadence: Cadence;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
