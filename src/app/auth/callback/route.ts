import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth callback handler for magic link and OAuth flows.
 * Exchanges the auth code for a session and redirects to the appropriate page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful auth - redirect to the requested page
      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  // Auth failed - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
