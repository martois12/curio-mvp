"use client";

import { useState, useRef } from "react";
import { bulkCreateInvites, type BulkInviteResult } from "./actions";

interface CSVUploadFormProps {
  groupId: string;
  organisationId: string;
}

export default function CSVUploadForm({
  groupId,
  organisationId,
}: CSVUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<BulkInviteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUploading(true);
    setResult(null);
    setError(null);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Please select a CSV file");
      setIsUploading(false);
      return;
    }

    try {
      const csvContent = await file.text();

      const formData = new FormData();
      formData.set("groupId", groupId);
      formData.set("organisationId", organisationId);
      formData.set("csvContent", csvContent);

      const uploadResult = await bulkCreateInvites(formData);
      setResult(uploadResult);

      // Reset file input on success
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h5 className="text-sm font-medium text-gray-700 mb-2">
        Bulk Invite via CSV
      </h5>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-1.5 file:px-3
              file:rounded file:border-0
              file:text-sm file:font-medium
              file:bg-gray-100 file:text-gray-700
              hover:file:bg-gray-200"
          />
          <p className="text-xs text-gray-500 mt-1">
            CSV format: email,name (name is optional). Max 200 rows.
          </p>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="px-3 py-1.5 text-sm bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Upload CSV"}
        </button>
      </form>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded text-sm">
          <div className="flex gap-4 mb-2">
            <span className="text-green-600 font-medium">
              {result.created} created
            </span>
            <span className="text-yellow-600 font-medium">
              {result.skipped} skipped
            </span>
          </div>

          {result.capped && (
            <p className="text-yellow-600 text-xs mb-2">
              CSV exceeded 200 rows. Only the first 200 were processed.
            </p>
          )}

          {result.errors.length > 0 && (
            <details className="text-xs text-gray-600">
              <summary className="cursor-pointer hover:text-gray-800">
                {result.errors.length} issue(s)
              </summary>
              <ul className="mt-1 ml-4 list-disc">
                {result.errors.slice(0, 10).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
                {result.errors.length > 10 && (
                  <li>...and {result.errors.length - 10} more</li>
                )}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
