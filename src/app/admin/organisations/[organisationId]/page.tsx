import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Organisation, Group, GroupType, Cadence } from "@/types";

interface PageProps {
  params: Promise<{ organisationId: string }>;
}

async function createGroup(formData: FormData): Promise<void> {
  "use server";

  const organisationId = formData.get("organisationId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const groupType = (formData.get("groupType") as GroupType) || "community_connection";
  const cadence = (formData.get("cadence") as Cadence) || "weekly";

  if (!name || name.trim() === "") {
    console.error("Group name is required");
    return;
  }

  if (!organisationId) {
    console.error("Organisation ID is required");
    return;
  }

  const supabase = await createClient();

  // Insert into programmes table (Group maps to programmes in DB)
  const { error } = await supabase.from("programmes").insert({
    community_id: organisationId, // DB uses community_id
    name: name.trim(),
    description: description?.trim() || null,
    programme_type: groupType, // DB uses programme_type
    cadence,
  });

  if (error) {
    console.error("Error creating group:", error);
    return;
  }

  revalidatePath(`/admin/organisations/${organisationId}`);
}

export default async function OrganisationDetailPage({ params }: PageProps) {
  const { organisationId } = await params;
  const supabase = await createClient();

  // Fetch organisation details (from communities table)
  const { data: organisation, error: orgError } = await supabase
    .from("communities")
    .select("*")
    .eq("id", organisationId)
    .single();

  if (orgError || !organisation) {
    console.error("Error fetching organisation:", orgError);
    notFound();
  }

  // Fetch groups for this organisation (from programmes table)
  const { data: groups, error: groupsError } = await supabase
    .from("programmes")
    .select("*")
    .eq("community_id", organisationId)
    .order("created_at", { ascending: false });

  if (groupsError) {
    console.error("Error fetching groups:", groupsError);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Map DB fields to frontend types
  const mappedGroups: Group[] = (groups || []).map((g) => ({
    id: g.id,
    organisation_id: g.community_id,
    name: g.name,
    description: g.description,
    group_type: g.programme_type as GroupType,
    audience_description: g.audience_description,
    cadence: g.cadence as Cadence,
    is_active: g.is_active,
    created_at: g.created_at,
    updated_at: g.updated_at,
  }));

  const org = organisation as Organisation;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link
            href="/admin/organisations"
            className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
          >
            &larr; Back to Organisations
          </Link>
          <h1 className="text-3xl font-bold">{org.name}</h1>
          {org.description && (
            <p className="text-gray-600 mt-2">{org.description}</p>
          )}
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>
              Slug: <code className="font-mono bg-gray-100 px-1">{org.slug}</code>
            </span>
            <span
              className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                org.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {org.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </header>

        {/* Create Group Form */}
        <section className="mb-8 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create Group</h2>
          <form action={createGroup} className="space-y-4">
            <input type="hidden" name="organisationId" value={organisationId} />

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
                placeholder="Enter group name"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="groupType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Group Type
                </label>
                <select
                  id="groupType"
                  name="groupType"
                  defaultValue="community_connection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="community_connection">Organisation Connection</option>
                  <option value="cohort_blitz">Cohort Blitz</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="cadence"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cadence
                </label>
                <select
                  id="cadence"
                  name="cadence"
                  defaultValue="weekly"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="every_2_days">Every 2 Days</option>
                  <option value="every_3_days">Every 3 Days</option>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="one_time">One-time</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Group
            </button>
          </form>
        </section>

        {/* Groups List */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Groups</h2>
          {mappedGroups.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No groups found</p>
              <p className="text-gray-400 mt-2">
                Groups will appear here once created.
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
                      Type
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                      Cadence
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                      Active?
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mappedGroups.map((group) => (
                    <tr key={group.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        <div>
                          {group.name}
                          {group.description && (
                            <p className="text-gray-500 font-normal text-xs mt-0.5">
                              {group.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatGroupType(group.group_type)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatCadence(group.cadence)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            group.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {group.is_active ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(group.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function formatGroupType(type: GroupType): string {
  switch (type) {
    case "community_connection":
      return "Organisation Connection";
    case "cohort_blitz":
      return "Cohort Blitz";
    case "event":
      return "Event";
    default:
      return type;
  }
}

function formatCadence(cadence: Cadence): string {
  switch (cadence) {
    case "daily":
      return "Daily";
    case "every_2_days":
      return "Every 2 Days";
    case "every_3_days":
      return "Every 3 Days";
    case "weekly":
      return "Weekly";
    case "fortnightly":
      return "Fortnightly";
    case "monthly":
      return "Monthly";
    case "quarterly":
      return "Quarterly";
    case "one_time":
      return "One-time";
    default:
      return cadence;
  }
}
