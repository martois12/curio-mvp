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
