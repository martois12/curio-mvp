import Link from "next/link";
import { getJoinLinkByToken, isJoinLinkValid, isUserGroupMember } from "@/lib/join-links";
import { getCurrentUser } from "@/lib/rbac";
import JoinForm from "./JoinForm";
import JoinButton from "./JoinButton";
import { Alert, Button } from "@/components/ui";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function JoinPage({ params }: PageProps) {
  const { token } = await params;
  const joinLink = await getJoinLinkByToken(token);

  // Invalid token
  if (!joinLink) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full text-center">
          <Alert variant="error" className="p-6">
            <h1 className="text-xl font-semibold mb-2">
              Invalid Join Link
            </h1>
            <p>
              This join link is not valid. Please check the link and try again,
              or contact the person who sent you the link.
            </p>
          </Alert>
        </div>
      </main>
    );
  }

  // Check if link is valid (active, not expired, not maxed out)
  if (!isJoinLinkValid(joinLink)) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full text-center">
          <Alert variant="warning" className="p-6">
            <h1 className="text-xl font-semibold mb-2">
              Link Expired or Unavailable
            </h1>
            <p>
              This join link is no longer active. It may have expired or reached
              its maximum number of uses. Contact the group administrator for a
              new link.
            </p>
          </Alert>
        </div>
      </main>
    );
  }

  // Check if user is logged in
  const user = await getCurrentUser();

  // If logged in, check if already a member
  if (user) {
    const isMember = await isUserGroupMember(user.id, joinLink.group_id);

    if (isMember) {
      return (
        <main className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
          <div className="max-w-md w-full text-center">
            <Alert variant="success" className="p-6">
              <h1 className="text-xl font-semibold mb-2">
                Already a Member
              </h1>
              <p className="mb-4">
                You are already a member of this group.
              </p>
              <Link href="/groups">
                <Button>View My Groups</Button>
              </Link>
            </Alert>
          </div>
        </main>
      );
    }

    // Logged in but not a member - show join button
    return (
      <main className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Join Group</h1>
            <p className="text-gray-600 mt-2">
              Click below to join the group
            </p>
          </div>
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <JoinButton
              joinLinkId={joinLink.id}
              groupId={joinLink.group_id}
              userId={user.id}
            />
          </div>
        </div>
      </main>
    );
  }

  // Not logged in - show signup form with login option
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Join Curio</h1>
          <p className="text-gray-600 mt-2">
            Create your account to join the group
          </p>
        </div>
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <JoinForm
            joinLinkId={joinLink.id}
            groupId={joinLink.group_id}
            token={token}
          />
        </div>
      </div>
    </main>
  );
}
