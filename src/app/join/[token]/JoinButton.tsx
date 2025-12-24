"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Alert } from "@/components/ui";

interface JoinButtonProps {
  joinLinkId: string;
  groupId: string;
  userId: string;
}

export default function JoinButton({ joinLinkId, groupId, userId }: JoinButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      // 1. Add to group
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: groupId,
          user_id: userId,
          status: "active",
        });

      if (memberError) {
        // Check if already a member (unique constraint violation)
        if (memberError.code === "23505") {
          // Already a member, just redirect
          router.push("/groups");
          return;
        }
        throw new Error(memberError.message);
      }

      // 2. Record redemption
      const { error: redemptionError } = await supabase
        .from("group_join_link_redemptions")
        .insert({
          join_link_id: joinLinkId,
          user_id: userId,
        });

      if (redemptionError && redemptionError.code !== "23505") {
        console.error("Error recording redemption:", redemptionError);
        // Don't throw - user is in group
      }

      // uses_count is incremented automatically by database trigger

      // 3. Redirect to groups page
      router.push("/groups");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join group");
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      <Button
        type="button"
        onClick={handleJoin}
        isLoading={isLoading}
        className="w-full"
      >
        Join Group
      </Button>
    </div>
  );
}
