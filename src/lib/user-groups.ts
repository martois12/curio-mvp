/**
 * Server-side helpers for user group operations.
 */

import { createClient } from "@/lib/supabase/server";
import type { UserGroup, GroupMemberStatus } from "@/types";

/**
 * Get groups that a user is a member of.
 *
 * @param userId - The user's ID
 * @returns Array of groups with membership info
 */
export async function getUserGroups(userId: string): Promise<UserGroup[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("group_members")
    .select(
      `
      id,
      status,
      group_id,
      groups:group_id (
        id,
        name,
        description,
        is_active,
        organisation_id,
        organisations:organisation_id (
          name
        )
      )
    `
    )
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) {
    console.error("Error fetching user groups:", error);
    return [];
  }

  // Map to UserGroup type
  return (data || [])
    .filter((row) => row.groups)
    .map((row) => {
      const group = row.groups as unknown as {
        id: string;
        name: string;
        description: string | null;
        is_active: boolean;
        organisations: { name: string } | null;
      };

      return {
        id: group.id,
        name: group.name,
        description: group.description,
        is_active: group.is_active,
        membership_id: row.id,
        membership_status: row.status as GroupMemberStatus,
        organisation_name: group.organisations?.name ?? "Unknown",
      };
    });
}

/**
 * Leave a group by updating membership status to inactive.
 *
 * @param userId - The user's ID
 * @param groupId - The group ID to leave
 * @returns Object with success status and optional error message
 */
export async function leaveGroup(
  userId: string,
  groupId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("group_members")
    .update({ status: "inactive" })
    .eq("user_id", userId)
    .eq("group_id", groupId);

  if (error) {
    console.error("Error leaving group:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
