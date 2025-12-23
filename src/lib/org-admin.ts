/**
 * Server-side helpers for organisation admin operations.
 */

import { createClient } from "@/lib/supabase/server";
import type { Organisation, Group, GroupType, Cadence } from "@/types";

/**
 * Get organisations that a user is an admin of.
 *
 * @param userId - The user's ID
 * @returns Array of organisations the user can administer
 */
export async function getAdminOrganisations(
  userId: string
): Promise<Organisation[]> {
  const supabase = await createClient();

  // Join organisation_admins with organisations to get org details
  const { data, error } = await supabase
    .from("organisation_admins")
    .select(
      `
      organisation_id,
      organisations:organisation_id (
        id,
        name,
        slug,
        description,
        is_active,
        created_at,
        updated_at
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching admin organisations:", error);
    return [];
  }

  // Map to Organisation type
  type OrganisationRow = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };

  return (data || [])
    .filter((row) => row.organisations)
    .map((row) => {
      const org = row.organisations as unknown as OrganisationRow;
      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        description: org.description,
        is_active: org.is_active,
        created_at: org.created_at,
        updated_at: org.updated_at,
      };
    });
}

/**
 * Get groups for an organisation.
 *
 * @param organisationId - The organisation ID
 * @returns Array of groups, ordered by created_at descending
 */
export async function getOrganisationGroups(
  organisationId: string
): Promise<Group[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching organisation groups:", error);
    return [];
  }

  // Map DB rows to Group type
  return (data || []).map((g) => ({
    id: g.id,
    organisation_id: g.organisation_id,
    name: g.name,
    description: g.description,
    group_type: g.group_type as GroupType,
    audience_description: g.audience_description,
    cadence: g.cadence as Cadence,
    is_active: g.is_active,
    created_at: g.created_at,
    updated_at: g.updated_at,
  }));
}

/**
 * Check if a user is an admin of a specific organisation.
 *
 * @param userId - The user's ID
 * @param organisationId - The organisation ID to check
 * @returns true if user is an admin of this organisation
 */
export async function isAdminOfOrganisation(
  userId: string,
  organisationId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organisation_admins")
    .select("id")
    .eq("user_id", userId)
    .eq("organisation_id", organisationId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking admin status:", error);
  }

  return !!data;
}
