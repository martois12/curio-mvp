import { getCurrentUser } from "@/lib/rbac";
import Link from "next/link";

export default async function DebugMePage() {
  const user = await getCurrentUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Debug: User Info</h1>
          <p className="text-gray-600 mt-2">Development page showing current user details</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {user ? (
            <dl className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono break-all">
                  {user.id}
                </dd>
              </div>
              <div className="border-b border-gray-200 pb-3">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div className="border-b border-gray-200 pb-3">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.fullName || <span className="text-gray-400 italic">Not set</span>}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      user.role === "super_admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "organisation_admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-gray-500 text-center">No user data available</p>
          )}
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-gray-400">
            This page is only visible in development mode.
          </p>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
