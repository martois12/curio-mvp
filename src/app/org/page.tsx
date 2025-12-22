import Link from "next/link";
import { getCurrentUser } from "@/lib/rbac";

export default async function OrgPage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Organisation Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your organisation&apos;s groups and members
          </p>
        </header>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">
            Organisation management features coming soon
          </p>
          <p className="text-sm text-gray-500">
            This page will allow organisation admins to manage their groups,
            members, and matching rounds.
          </p>
        </div>

        {user && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Logged in as{" "}
            <span className="font-medium">{user.email}</span>{" "}
            <span className="text-xs">({user.role})</span>
          </div>
        )}
      </div>
    </main>
  );
}
