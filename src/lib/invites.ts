/**
 * Server-side helpers for group invites.
 *
 * Uses legacy DB column name (programme_id) but returns Spec 1.3 types (group_id).
 */

import { createClient } from "@/lib/supabase/server";
import type { GroupInvite, InviteStatus } from "@/types";
import { randomBytes } from "crypto";

/**
 * Create a new invite for a group.
 *
 * @param groupId - The group ID (Spec 1.3 terminology)
 * @param email - Optional email address for targeted invite
 * @returns The created invite or null on error
 */
export async function createInvite(
  groupId: string,
  email?: string
): Promise<GroupInvite | null> {
  const supabase = await createClient();

  // Generate a secure random token (48 hex characters)
  const token = randomBytes(24).toString("hex");

  const { data, error } = await supabase
    .from("invites")
    .insert({
      programme_id: groupId, // DB uses legacy column name
      token,
      email: email?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating invite:", error);
    return null;
  }

  // Map DB row to Spec 1.3 type
  return {
    id: data.id,
    group_id: data.programme_id,
    token: data.token,
    email: data.email,
    status: data.status as InviteStatus,
    created_at: data.created_at,
    joined_at: data.joined_at,
  };
}

/**
 * List all invites for a group.
 *
 * @param groupId - The group ID (Spec 1.3 terminology)
 * @returns Array of invites, ordered by created_at descending
 */
export async function listInvites(groupId: string): Promise<GroupInvite[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .eq("programme_id", groupId) // DB uses legacy column name
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error listing invites:", error);
    return [];
  }

  // Map DB rows to Spec 1.3 types
  return (data || []).map((row) => ({
    id: row.id,
    group_id: row.programme_id,
    token: row.token,
    email: row.email,
    status: row.status as InviteStatus,
    created_at: row.created_at,
    joined_at: row.joined_at,
  }));
}

/**
 * Get an invite by its token.
 *
 * @param token - The unique invite token
 * @returns The invite or null if not found
 */
export async function getInviteByToken(
  token: string
): Promise<GroupInvite | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !data) {
    if (error?.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching invite:", error);
    }
    return null;
  }

  return {
    id: data.id,
    group_id: data.programme_id,
    token: data.token,
    email: data.email,
    status: data.status as InviteStatus,
    created_at: data.created_at,
    joined_at: data.joined_at,
  };
}

/**
 * Mark an invite as joined.
 *
 * @param inviteId - The invite ID
 * @returns true if successful, false otherwise
 */
export async function markInviteJoined(inviteId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("invites")
    .update({
      status: "joined",
      joined_at: new Date().toISOString(),
    })
    .eq("id", inviteId);

  if (error) {
    console.error("Error marking invite joined:", error);
    return false;
  }

  return true;
}
