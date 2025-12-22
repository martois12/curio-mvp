import { createClient } from "@/lib/supabase/server";
import {
  type UserRole,
  type LegacyUserRole,
  mapLegacyRole,
  mapToLegacyRole,
} from "@/types";

/**
 * RBAC (Role-Based Access Control) module for Curio.
 *
 * Uses Spec 1.3 terminology (UserRole: super_admin, organisation_admin, user).
 * Database stores legacy roles (super_admin, community_admin, participant).
 * This module handles the mapping between them.
 */

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
}

export interface RBACResult {
  authenticated: boolean;
  authorised: boolean;
  user: AuthenticatedUser | null;
  error?: string;
}

/**
 * Gets the current authenticated user and their role from the database.
 * Returns null if not authenticated.
 * Maps legacy database roles to Spec 1.3 roles.
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return null;
  }

  // Fetch user role from the users table (returns legacy role)
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", authUser.id)
    .single();

  if (userError || !userData) {
    // User exists in auth but not in users table
    // Default to 'user' role for safety
    return {
      id: authUser.id,
      email: authUser.email ?? "",
      role: "user",
      fullName: null,
    };
  }

  // Map legacy database role to Spec 1.3 role
  const legacyRole = userData.role as LegacyUserRole;
  const role = mapLegacyRole(legacyRole);

  return {
    id: authUser.id,
    email: authUser.email ?? "",
    role,
    fullName: userData.full_name,
  };
}

/**
 * Gets the current user's role. Returns null if not authenticated.
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  return user?.role ?? null;
}

/**
 * Checks if the current user has one of the allowed roles.
 * Returns an RBACResult with authentication and authorisation status.
 */
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<RBACResult> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authenticated: false,
      authorised: false,
      user: null,
      error: "Not authenticated",
    };
  }

  const isAuthorised = allowedRoles.includes(user.role);

  return {
    authenticated: true,
    authorised: isAuthorised,
    user,
    error: isAuthorised ? undefined : "Insufficient permissions",
  };
}

/**
 * Checks if a role has super_admin privileges.
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === "super_admin";
}

/**
 * Checks if a role has organisation_admin or higher privileges.
 */
export function isOrganisationAdminOrHigher(role: UserRole): boolean {
  return role === "super_admin" || role === "organisation_admin";
}

/**
 * @deprecated Use isOrganisationAdminOrHigher instead.
 */
export const isCommunityAdminOrHigher = isOrganisationAdminOrHigher;

/**
 * Route protection configuration.
 * Maps route patterns to allowed roles (Spec 1.3 terminology).
 */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/admin": ["super_admin"],
  "/org": ["super_admin", "organisation_admin"],
  "/dashboard": ["super_admin", "organisation_admin", "user"],
};

/**
 * Determines the allowed roles for a given pathname.
 * Returns null if the route is public (no protection needed).
 */
export function getAllowedRolesForRoute(pathname: string): UserRole[] | null {
  // Check each protected route pattern
  for (const [routePattern, roles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname === routePattern || pathname.startsWith(`${routePattern}/`)) {
      return roles;
    }
  }

  // Route is public
  return null;
}

// Re-export mapping functions for use elsewhere
export { mapLegacyRole, mapToLegacyRole };
export type { UserRole, LegacyUserRole };
