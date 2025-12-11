import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Community } from "@/types";

export default async function AdminCommunitiesPage() {
  const supabase = await createClient();

  const { data: communities, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching communities:", error);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-gray-600 mt-2">Manage all communities on the platform</p>
        </header>

        {!communities || communities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No communities found</p>
            <p className="text-gray-400 mt-2">
              Communities will appear here once created.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                    Slug
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                    Active?
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                    Created at
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(communities as Community[]).map((community) => (
                  <tr key={community.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {community.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                      {community.slug}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          community.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {community.is_active ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(community.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
