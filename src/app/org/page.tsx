import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/rbac";
import { getAdminOrganisations, getOrganisationGroups } from "@/lib/org-admin";
import { listInvites } from "@/lib/invites";
import { getActiveJoinLink } from "@/lib/join-links";
import { generateInvite } from "./actions";
import CSVUploadForm from "./CSVUploadForm";
import JoinLinkSection from "./JoinLinkSection";
import type { Organisation, Group, GroupInvite, GroupJoinLink } from "@/types";
import {
  PageShell,
  PageHeader,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  EmptyState,
} from "@/components/ui";

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

  // Fetch groups, invites, and join links for each organisation
  const orgData: {
    org: Organisation;
    groups: Group[];
    groupInvites: Record<string, GroupInvite[]>;
    groupJoinLinks: Record<string, GroupJoinLink | null>;
  }[] = [];

  for (const org of organisations) {
    const groups = await getOrganisationGroups(org.id);
    const groupInvites: Record<string, GroupInvite[]> = {};
    const groupJoinLinks: Record<string, GroupJoinLink | null> = {};

    for (const group of groups) {
      groupInvites[group.id] = await listInvites(group.id);
      groupJoinLinks[group.id] = await getActiveJoinLink(group.id);
    }

    orgData.push({ org, groups, groupInvites, groupJoinLinks });
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <PageShell>
      <PageHeader
        title="Organisation Management"
        description="Manage your groups and invite members"
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />

      {organisations.length === 0 ? (
        <EmptyState
          variant="warning"
          title="No organisations assigned"
          description="You have not been assigned to any organisations yet. Contact a super admin to be added as an organisation admin."
        />
      ) : (
        <div className="space-y-8">
          {orgData.map(({ org, groups, groupInvites, groupJoinLinks }) => (
            <Card key={org.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{org.name}</CardTitle>
                    {org.description && (
                      <CardDescription>{org.description}</CardDescription>
                    )}
                  </div>
                  <Badge variant={org.is_active ? "success" : "default"}>
                    {org.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
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
                              <Badge variant={group.is_active ? "success" : "default"}>
                                {group.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>

                          {/* Invite Section */}
                          <div className="px-4 py-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-sm font-medium text-gray-700">
                                Invites ({invites.length})
                              </h5>
                              <form action={generateInvite}>
                                <input type="hidden" name="groupId" value={group.id} />
                                <input type="hidden" name="organisationId" value={org.id} />
                                <Button type="submit" size="sm">
                                  Generate Invite Link
                                </Button>
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
                                        <Badge
                                          variant={
                                            invite.status === "joined"
                                              ? "success"
                                              : "warning"
                                          }
                                        >
                                          {invite.status}
                                        </Badge>
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

                            {/* Join Link */}
                            <JoinLinkSection
                              groupId={group.id}
                              organisationId={org.id}
                              joinLink={groupJoinLinks[group.id]}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        Logged in as{" "}
        <span className="font-medium">{user.email}</span>{" "}
        <span className="text-xs">({user.role})</span>
      </div>
    </PageShell>
  );
}
