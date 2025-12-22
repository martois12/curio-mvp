import { getInviteByToken } from "@/lib/invites";
import InviteForm from "./InviteForm";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params;
  const invite = await getInviteByToken(token);

  // Invalid token
  if (!invite) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-red-800 mb-2">
              Invalid Invite Link
            </h1>
            <p className="text-red-600">
              This invite link is not valid. Please check the link and try again,
              or contact the person who sent you the invite.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Already used
  if (invite.status === "joined") {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-yellow-800 mb-2">
              Invite Already Used
            </h1>
            <p className="text-yellow-600">
              This invite link has already been used. If you created an account,
              you can{" "}
              <a href="/login" className="underline hover:no-underline">
                log in here
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Valid invite - show signup form
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Join Curio</h1>
          <p className="text-gray-600 mt-2">
            Create your account to join the group
          </p>
        </div>
        <InviteForm inviteId={invite.id} groupId={invite.group_id} />
      </div>
    </main>
  );
}
