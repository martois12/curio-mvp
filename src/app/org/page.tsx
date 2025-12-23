import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/rbac";
import { getAdminOrganisations, getOrganisationGroups } from "@/lib/org-admin";
import { listInvites } from "@/lib/invites";
import { generateInvite } from "./actions";
import CSVUploadForm from "./CSVUploadForm";
import type { Organisation, Group, GroupInvite } from "@/types";

export default async function OrgPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Super admins should use the admin interface
  if (user.role === "super_admin") {
    redirect("/admin/organisations");
  }

  // Get organisations this admin can manage
  const organisations = await getAdminOrganisations(user.id);

  // Fetch groups and invites for each organisation
  const orgData: {
    org: Organisation;
    groups: Group[];
    groupInvites: Record<string, GroupInvite[]>;
  }[] = [];

  for (const org of organisations) {
    const groups = await getOrganisationGroups(org.id);
    const groupInvites: Record<string, GroupInvite[]> = {};

    for (const group of groups) {
      groupInvites[group.id] = await listInvites(group.id);
    }

    orgData.push({ org, groups, groupInvites });
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
          <h1 className="text-3xl font-bold">Organisation Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your groups and invite members
          </p>
        </header>

        {organisations.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-yellow-800 mb-2">
              No organisations assigned
            </p>
            <p className="text-sm text-yellow-600">
              You have not been assigned to any organisations yet.
              Contact a super admin to be added as an organisation admin.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orgData.map(({ org, groups, groupInvites }) => (
              <section key={org.id} className="bg-white shadow-sm rounded-lg overflow-hidden">
                {/* Organisation Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {org.name}
                      </h2>
                      {org.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {org.description}
                        </p>
                      )}
                    </div>
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
                </div>

                {/* Groups */}
                <div className="px-6 py-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Groups ({groups.length})
                  </h3>

                  {groups.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No groups in this organisation yet.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {groups.map((group) => {
                        const invites = groupInvites[group.id] || [];
                        return (
                          <div
                            key={group.id}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            {/* Group Header */}
                            <div className="px-4 py-3 bg-white border-b border-gray-100">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {group.name}
                                  </h4>
                                  {group.description && (
                                    <p className="text-sm text-gray-500">
                                      {group.description}
                                    </p>
                                  )}
                                </div>
                                <span
                                  className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                    group.is_active
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {group.is_active ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </div>

                            {/* Invite Section */}
                            <div className="px-4 py-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-sm font-medium text-gray-700">
                                  Invites ({invites.length})
                                </h5>
                                <form action={generateInvite} className="flex items-center gap-2">
                                  <input type="hidden" name="groupId" value={group.id} />
                                  <input type="hidden" name="organisationId" value={org.id} />
                                  <button
                                    type="submit"
                                    className="px-3 py-1.5 text-sm bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                  >
                                    Generate Invite Link
                                  </button>
                                </form>
                              </div>

                              {invites.length > 0 ? (
                                <div className="space-y-2">
                                  {invites.map((invite) => (
                                    <div
                                      key={invite.id}
                                      className="bg-white px-3 py-2 rounded border border-gray-200 text-sm"
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                          {invite.email && (
                                            <span className="text-gray-700">
                                              {invite.email}
                                            </span>
                                          )}
                                          <span
                                            className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                              invite.status === "joined"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}
                                          >
                                            {invite.status}
                                          </span>
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                          {formatDate(invite.created_at)}
                                        </div>
                                      </div>
                                      <code className="block font-mono text-xs bg-gray-100 px-2 py-1.5 rounded select-all cursor-pointer">
                                        /invite/{invite.token}
                                      </code>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No invites yet. Generate one or upload a CSV.
                                </p>
                              )}

                              {/* CSV Upload */}
                              <CSVUploadForm
                                groupId={group.id}
                                organisationId={org.id}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          Logged in as{" "}
          <span className="font-medium">{user.email}</span>{" "}
          <span className="text-xs">({user.role})</span>
        </div>
      </div>
    </main>
  );
}
