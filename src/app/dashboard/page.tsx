import Link from "next/link";
import { getCurrentUser, isSuperAdmin, isOrganisationAdminOrHigher } from "@/lib/rbac";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {user && (
              <p className="text-gray-600 mt-1">
                Welcome, {user.fullName || user.email}
                <span
                  className={`ml-2 inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                    user.role === "super_admin"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "organisation_admin"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role.replace("_", " ")}
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Home
            </Link>
            <SignOutButton />
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">
            Welcome to the Curio Dashboard
          </p>
          <p className="text-sm text-gray-500">
            This is a placeholder page. Features will be implemented here.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold mb-2">My Introductions</h2>
            <p className="text-sm text-gray-500">
              View and manage your introduction requests
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold mb-2">My Groups</h2>
            <p className="text-sm text-gray-500">
              See groups you belong to
            </p>
          </div>
        </div>

        {/* Admin navigation */}
        {user && isOrganisationAdminOrHigher(user.role) && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold mb-4">Admin Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isSuperAdmin(user.role) && (
                <Link
                  href="/admin/organisations"
                  className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold mb-2">Organisations</h3>
                  <p className="text-sm text-gray-500">
                    Manage all platform organisations
                  </p>
                </Link>
              )}
              <Link
                href="/org"
                className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold mb-2">My Organisation</h3>
                <p className="text-sm text-gray-500">
                  Manage your organisation&apos;s groups
                </p>
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
      </div>
    </main>
  );
}
