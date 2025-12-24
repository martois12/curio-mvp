/**
 * Server-side helpers for group join links.
 */

import { createClient } from "@/lib/supabase/server";
import type { GroupJoinLink } from "@/types";
import { randomBytes } from "crypto";

/**
 * Get the active join link for a group.
 * Only one join link should be active per group at a time.
 *
 * @param groupId - The group ID
 * @returns The active join link or null if none exists
 */
export async function getActiveJoinLink(
  groupId: string
): Promise<GroupJoinLink | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("group_join_links")
    .select("*")
    .eq("group_id", groupId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    if (error?.code !== "PGRST116") {
      console.error("Error fetching join link:", error);
    }
    return null;
  }

  return {
    id: data.id,
    group_id: data.group_id,
    organisation_id: data.organisation_id,
    token: data.token,
    is_active: data.is_active,
    max_uses: data.max_uses,
    uses_count: data.uses_count,
    expires_at: data.expires_at,
    created_by: data.created_by,
    created_at: data.created_at,
  };
}

/**
 * Create a new join link for a group, deactivating any existing ones.
 *
 * @param groupId - The group ID
 * @param organisationId - The organisation ID
 * @param createdBy - The user ID of the creator (optional)
 * @returns The created join link or null on error
 */
export async function createJoinLink(
  groupId: string,
  organisationId: string,
  createdBy?: string
): Promise<GroupJoinLink | null> {
  const supabase = await createClient();

  // Deactivate any existing join links for this group
  await supabase
    .from("group_join_links")
    .update({ is_active: false })
    .eq("group_id", groupId)
    .eq("is_active", true);

  // Generate a secure random token (32 hex characters)
  const token = randomBytes(16).toString("hex");

  const { data, error } = await supabase
    .from("group_join_links")
    .insert({
      group_id: groupId,
      organisation_id: organisationId,
      token,
      created_by: createdBy || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating join link:", error);
    return null;
  }

  return {
    id: data.id,
    group_id: data.group_id,
    organisation_id: data.organisation_id,
    token: data.token,
    is_active: data.is_active,
    max_uses: data.max_uses,
    uses_count: data.uses_count,
    expires_at: data.expires_at,
    created_by: data.created_by,
    created_at: data.created_at,
  };
}

/**
 * Get a join link by its token (for public validation).
 *
 * @param token - The unique join link token
 * @returns The join link or null if not found/invalid
 */
export async function getJoinLinkByToken(
  token: string
): Promise<GroupJoinLink | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("group_join_links")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !data) {
    if (error?.code !== "PGRST116") {
      console.error("Error fetching join link by token:", error);
    }
    return null;
  }

  return {
    id: data.id,
    group_id: data.group_id,
    organisation_id: data.organisation_id,
    token: data.token,
    is_active: data.is_active,
    max_uses: data.max_uses,
    uses_count: data.uses_count,
    expires_at: data.expires_at,
    created_by: data.created_by,
    created_at: data.created_at,
  };
}

/**
 * Check if a join link is valid (active, not expired, not maxed out).
 */
export function isJoinLinkValid(link: GroupJoinLink): boolean {
  if (!link.is_active) return false;

  if (link.expires_at && new Date(link.expires_at) <= new Date()) {
    return false;
  }

  if (link.max_uses !== null && link.uses_count >= link.max_uses) {
    return false;
  }

  return true;
}

/**
 * Redeem a join link for a user.
 * Creates a redemption record; uses_count is incremented by database trigger.
 *
 * @param joinLinkId - The join link ID
 * @param userId - The user ID
 * @returns Success status and optional error message
 */
export async function redeemJoinLink(
  joinLinkId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Check if user already redeemed this link
  const { data: existingRedemption } = await supabase
    .from("group_join_link_redemptions")
    .select("id")
    .eq("join_link_id", joinLinkId)
    .eq("user_id", userId)
    .single();

  if (existingRedemption) {
    // Already redeemed, treat as success (idempotent)
    return { success: true };
  }

  // Create redemption record
  // uses_count is incremented automatically by database trigger
  const { error: redemptionError } = await supabase
    .from("group_join_link_redemptions")
    .insert({
      join_link_id: joinLinkId,
      user_id: userId,
    });

  if (redemptionError) {
    console.error("Error creating redemption:", redemptionError);
    return { success: false, error: redemptionError.message };
  }

  return { success: true };
}

/**
 * Check if a user is already a member of a group.
 */
export async function isUserGroupMember(
  userId: string,
  groupId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("group_members")
    .select("id")
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("status", "active")
    .single();

  return !!data;
}

/**
 * Add a user to a group.
 */
export async function addUserToGroup(
  userId: string,
  groupId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("group_members").insert({
    group_id: groupId,
    user_id: userId,
    status: "active",
  });

  if (error) {
    // Might already exist, try to update status
    if (error.code === "23505") {
      // Unique violation
      const { error: updateError } = await supabase
        .from("group_members")
        .update({ status: "active" })
        .eq("user_id", userId)
        .eq("group_id", groupId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }
      return { success: true };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}
