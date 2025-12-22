import { createClient } from "@/lib/supabase/server";

/**
 * User roles matching the database enum
 * Hierarchy: super_admin > community_admin > participant
 */
export type UserRole = "super_admin" | "community_admin" | "participant";

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

  // Fetch user role from the users table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", authUser.id)
    .single();

  if (userError || !userData) {
    // User exists in auth but not in users table
    // Default to participant role for safety
    return {
      id: authUser.id,
      email: authUser.email ?? "",
      role: "participant",
      fullName: null,
    };
  }

  return {
    id: authUser.id,
    email: authUser.email ?? "",
    role: userData.role as UserRole,
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
 * Checks if a role has community_admin or higher privileges.
 */
export function isCommunityAdminOrHigher(role: UserRole): boolean {
  return role === "super_admin" || role === "community_admin";
}

/**
 * Route protection configuration.
 * Maps route patterns to allowed roles.
 */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/admin": ["super_admin"],
  "/org": ["super_admin", "community_admin"],
  "/dashboard": ["super_admin", "community_admin", "participant"],
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
