"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Alert } from "@/components/ui";
import { leaveGroupAction } from "./actions";

interface LeaveGroupButtonProps {
  groupId: string;
  groupName: string;
}

export default function LeaveGroupButton({
  groupId,
  groupName,
}: LeaveGroupButtonProps) {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleLeave() {
    setIsLeaving(true);
    setError(null);

    const formData = new FormData();
    formData.set("groupId", groupId);

    const result = await leaveGroupAction(formData);

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error ?? "Failed to leave group");
      setIsLeaving(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-600">
          Leave <strong>{groupName}</strong>?
        </p>
        {error && <Alert variant="error">{error}</Alert>}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="danger"
            onClick={handleLeave}
            isLoading={isLeaving}
          >
            Leave
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowConfirm(false)}
            disabled={isLeaving}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button size="sm" variant="outline" onClick={() => setShowConfirm(true)}>
      Leave
    </Button>
  );
}
