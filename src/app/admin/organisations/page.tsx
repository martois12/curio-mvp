import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Organisation } from "@/types";

/**
 * Generates a URL-friendly slug from a name.
 * Converts to lowercase, replaces spaces with hyphens, removes special characters.
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function createOrganisation(formData: FormData): Promise<void> {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;

  if (!name || name.trim() === "") {
    console.error("Organisation name is required");
    return;
  }

  const supabase = await createClient();
  const slug = generateSlug(name);

  // Check if slug already exists
  const { data: existing } = await supabase
    .from("organisations")
    .select("id")
    .eq("slug", slug)
    .single();

  let finalSlug = slug;
  if (existing) {
    // Append timestamp to make slug unique
    finalSlug = `${slug}-${Date.now()}`;
  }

  const { error } = await supabase.from("organisations").insert({
    name: name.trim(),
    slug: finalSlug,
    description: description?.trim() || null,
  });

  if (error) {
    console.error("Error creating organisation:", error);
    return;
  }

  revalidatePath("/admin/organisations");
}

export default async function AdminOrganisationsPage() {
  const supabase = await createClient();

  const { data: organisations, error } = await supabase
    .from("organisations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching organisations:", error);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
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
          <h1 className="text-3xl font-bold">Organisations</h1>
          <p className="text-gray-600 mt-2">
            Manage all organisations on the platform
          </p>
        </header>

        {/* Create Organisation Form */}
        <section className="mb-8 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create Organisation</h2>
          <form action={createOrganisation} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Enter organisation name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Enter a brief description (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Organisation
            </button>
          </form>
        </section>

        {/* Organisations List */}
        {!organisations || organisations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No organisations found</p>
            <p className="text-gray-400 mt-2">
              Organisations will appear here once created.
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
                    Created
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(organisations as Organisation[]).map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {org.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                      {org.slug}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          org.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {org.is_active ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(org.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/admin/organisations/${org.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Groups
                      </Link>
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
