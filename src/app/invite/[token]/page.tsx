import Link from "next/link";
import { getInviteByToken } from "@/lib/invites";
import InviteForm from "./InviteForm";
import { Alert } from "@/components/ui";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params;
  const invite = await getInviteByToken(token);

  // Invalid token
  if (!invite) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full text-center">
          <Alert variant="error" className="p-6">
            <h1 className="text-xl font-semibold mb-2">
              Invalid Invite Link
            </h1>
            <p>
              This invite link is not valid. Please check the link and try again,
              or contact the person who sent you the invite.
            </p>
          </Alert>
        </div>
      </main>
    );
  }

  // Already used
  if (invite.status === "joined") {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full text-center">
          <Alert variant="warning" className="p-6">
            <h1 className="text-xl font-semibold mb-2">
              Invite Already Used
            </h1>
            <p>
              This invite link has already been used. If you created an account,
              you can{" "}
              <Link href="/login" className="underline hover:no-underline font-medium">
                log in here
              </Link>
              .
            </p>
          </Alert>
        </div>
      </main>
    );
  }

  // Valid invite - show signup form
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
          <InviteForm inviteId={invite.id} groupId={invite.group_id} />
        </div>
      </div>
    </main>
  );
}
