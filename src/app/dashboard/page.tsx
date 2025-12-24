import Link from "next/link";
import { getCurrentUser, isSuperAdmin, isOrganisationAdminOrHigher } from "@/lib/rbac";
import { SignOutButton } from "./sign-out-button";
import {
  PageShell,
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  Badge,
  EmptyState,
} from "@/components/ui";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
          {user && (
            <p className="text-gray-600 mt-1">
              Welcome, {user.fullName || user.email}
              <Badge
                variant={
                  user.role === "super_admin"
                    ? "purple"
                    : user.role === "organisation_admin"
                      ? "info"
                      : "default"
                }
                className="ml-2"
              >
                {user.role.replace("_", " ")}
              </Badge>
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
          >
            Home
          </Link>
          <SignOutButton />
        </div>
      </div>

      <EmptyState
        title="Welcome to the Curio Dashboard"
        description="This is a placeholder page. Features will be implemented here."
        className="mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <CardTitle as="h3">My Introductions</CardTitle>
            <CardDescription>
              View and manage your introduction requests
            </CardDescription>
          </CardContent>
        </Card>
        <Link href="/groups">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent>
              <CardTitle as="h3">My Groups</CardTitle>
              <CardDescription>See groups you belong to</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Admin navigation */}
      {user && isOrganisationAdminOrHigher(user.role) && (
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Admin Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isSuperAdmin(user.role) && (
              <Link href="/admin/organisations">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardContent>
                    <CardTitle as="h3">Organisations</CardTitle>
                    <CardDescription>
                      Manage all platform organisations
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )}
            <Link href="/org">
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                <CardContent>
                  <CardTitle as="h3">My Organisation</CardTitle>
                  <CardDescription>
                    Manage your organisation&apos;s groups
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}

      {/* Debug link */}
      <div className="mt-8 text-center">
        <Link
          href="/debug/me"
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Debug: View user info
        </Link>
      </div>
    </PageShell>
  );
}
