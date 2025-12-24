"use client";

import { useState, useTransition } from "react";
import { Badge, Button } from "@/components/ui";
import { generateJoinLinkAction } from "./actions";
import type { GroupJoinLink } from "@/types";

interface JoinLinkSectionProps {
  groupId: string;
  organisationId: string;
  joinLink: GroupJoinLink | null;
}

export default function JoinLinkSection({
  groupId,
  organisationId,
  joinLink,
}: JoinLinkSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLink = () => {
    setError(null);
    const formData = new FormData();
    formData.append("groupId", groupId);
    formData.append("organisationId", organisationId);

    startTransition(async () => {
      const result = await generateJoinLinkAction(formData);
      if (!result.success && result.error) {
        setError(result.error);
      }
    });
  };

  const handleCopy = async () => {
    if (!joinLink) return;
    const fullUrl = `${window.location.origin}/join/${joinLink.token}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex items-center justify-between mb-1">
        <h5 className="text-sm font-medium text-gray-700">Join link</h5>
        {joinLink && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleGenerateLink}
            disabled={isPending}
          >
            {isPending ? "Generating..." : "Regenerate link"}
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Multi-use link that anyone can use to join this group.
      </p>

      {error && (
        <p className="text-sm text-red-600 mb-2">{error}</p>
      )}

      {joinLink ? (
        <div className="bg-white px-3 py-2 rounded border border-gray-200 text-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="info">Multi-use</Badge>
              <span className="text-gray-500 text-xs">
                {joinLink.uses_count} uses
                {joinLink.max_uses !== null && ` / ${joinLink.max_uses} max`}
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <code
            className="block font-mono text-xs bg-gray-100 px-2 py-1.5 rounded select-all cursor-pointer"
            onClick={handleCopy}
          >
            /join/{joinLink.token}
          </code>
        </div>
      ) : (
        <Button
          type="button"
          size="sm"
          onClick={handleGenerateLink}
          disabled={isPending}
        >
          {isPending ? "Generating..." : "Generate join link"}
        </Button>
      )}
    </div>
  );
}
