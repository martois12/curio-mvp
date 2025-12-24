import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/rbac";
import { getUserGroups } from "@/lib/user-groups";
import {
  PageShell,
  PageHeader,
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  Badge,
  EmptyState,
} from "@/components/ui";
import LeaveGroupButton from "./LeaveGroupButton";

export default async function GroupsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const groups = await getUserGroups(user.id);

  return (
    <PageShell>
      <PageHeader
        title="My Groups"
        description="Groups you belong to on Curio"
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />

      {groups.length === 0 ? (
        <EmptyState
          title="No groups yet"
          description="You haven't joined any groups. Ask an organisation admin for an invite link to get started."
        />
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle as="h3" className="truncate">
                        {group.name}
                      </CardTitle>
                      <Badge variant={group.is_active ? "success" : "default"}>
                        {group.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      {group.organisation_name}
                    </p>
                    {group.description && (
                      <CardDescription className="mt-0">
                        {group.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <LeaveGroupButton groupId={group.id} groupName={group.name} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        {groups.length} {groups.length === 1 ? "group" : "groups"}
      </div>
    </PageShell>
  );
}
