import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/lib/rbac";

/**
 * Route protection configuration.
 * Maps route patterns to allowed roles.
 */
const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  "/admin": ["super_admin"],
  "/org": ["super_admin", "community_admin"],
  "/dashboard": ["super_admin", "community_admin", "participant"],
  "/debug/me": ["super_admin", "community_admin", "participant"],
};

/**
 * Routes that should be accessible only to unauthenticated users.
 */
const AUTH_ROUTES = ["/login"];

/**
 * Determines the allowed roles for a given pathname.
 * Returns null if the route is public.
 */
function getAllowedRolesForRoute(pathname: string): UserRole[] | null {
  for (const [routePattern, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname === routePattern || pathname.startsWith(`${routePattern}/`)) {
      return roles;
    }
  }
  return null;
}

/**
 * Checks if the route is an auth route (login, signup, etc.)
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create response and Supabase client
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh auth token
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  // Check if route is protected
  const allowedRoles = getAllowedRolesForRoute(pathname);

  // Handle auth routes (redirect authenticated users away from login)
  if (isAuthRoute(pathname)) {
    if (authUser) {
      // Authenticated user trying to access login - redirect to dashboard
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
    return supabaseResponse;
  }

  // If route is not protected, allow access
  if (!allowedRoles) {
    return supabaseResponse;
  }

  // Route is protected - check authentication
  if (!authUser) {
    // Not authenticated - redirect to login
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Authenticated - check authorisation by fetching user role from database
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", authUser.id)
    .single();

  // Default to participant if user record not found
  const userRole: UserRole = userData?.role ?? "participant";

  // Check if user's role is allowed
  if (!allowedRoles.includes(userRole)) {
    // Authenticated but not authorised - redirect to access-denied
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/access-denied";
    return NextResponse.redirect(redirectUrl);
  }

  // User is authenticated and authorised
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
