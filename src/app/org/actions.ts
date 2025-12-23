"use server";

import { revalidatePath } from "next/cache";
import { createInvite } from "@/lib/invites";
import { getCurrentUser } from "@/lib/rbac";
import { isAdminOfOrganisation } from "@/lib/org-admin";

const MAX_CSV_ROWS = 200;

export interface BulkInviteResult {
  created: number;
  skipped: number;
  errors: string[];
  capped: boolean;
}

/**
 * Generate a single invite for a group.
 */
export async function generateInvite(formData: FormData): Promise<void> {
  const groupId = formData.get("groupId") as string;
  const organisationId = formData.get("organisationId") as string;
  const email = formData.get("email") as string | null;

  if (!groupId) {
    console.error("Group ID is required");
    return;
  }

  // Verify user has access to this organisation
  const user = await getCurrentUser();
  if (!user) {
    console.error("Not authenticated");
    return;
  }

  // Super admins can access any org, org admins need explicit check
  if (user.role !== "super_admin") {
    const isAdmin = await isAdminOfOrganisation(user.id, organisationId);
    if (!isAdmin) {
      console.error("Not authorised for this organisation");
      return;
    }
  }

  const invite = await createInvite(groupId, email || undefined);

  if (!invite) {
    console.error("Failed to create invite");
    return;
  }

  revalidatePath("/org");
}

/**
 * Parse CSV content and extract email rows.
 * Expects format: email,name (name is optional)
 */
function parseCSV(
  content: string
): { email: string; name: string | null; row: number }[] {
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  const results: { email: string; name: string | null; row: number }[] = [];

  // Check if first line is a header
  const firstLine = lines[0]?.toLowerCase() || "";
  const hasHeader =
    firstLine.includes("email") ||
    firstLine.includes("name") ||
    firstLine.includes("e-mail");

  const startIndex = hasHeader ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by comma, handling quoted values
    const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));

    const email = parts[0] || "";
    const name = parts[1] || null;

    results.push({ email, name, row: i + 1 });
  }

  return results;
}

/**
 * Validate email format.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Bulk create invites from CSV data.
 */
export async function bulkCreateInvites(
  formData: FormData
): Promise<BulkInviteResult> {
  const groupId = formData.get("groupId") as string;
  const organisationId = formData.get("organisationId") as string;
  const csvContent = formData.get("csvContent") as string;

  const result: BulkInviteResult = {
    created: 0,
    skipped: 0,
    errors: [],
    capped: false,
  };

  if (!groupId || !csvContent) {
    result.errors.push("Missing required fields");
    return result;
  }

  // Verify user has access to this organisation
  const user = await getCurrentUser();
  if (!user) {
    result.errors.push("Not authenticated");
    return result;
  }

  if (user.role !== "super_admin") {
    const isAdmin = await isAdminOfOrganisation(user.id, organisationId);
    if (!isAdmin) {
      result.errors.push("Not authorised for this organisation");
      return result;
    }
  }

  // Parse CSV
  const rows = parseCSV(csvContent);

  // Check if capped
  if (rows.length > MAX_CSV_ROWS) {
    result.capped = true;
  }

  // Process up to MAX_CSV_ROWS
  const rowsToProcess = rows.slice(0, MAX_CSV_ROWS);
  const seenEmails = new Set<string>();

  for (const row of rowsToProcess) {
    const email = row.email.toLowerCase();

    // Validate email
    if (!email || !isValidEmail(email)) {
      result.skipped++;
      if (row.email) {
        result.errors.push(`Row ${row.row}: Invalid email "${row.email}"`);
      }
      continue;
    }

    // Check for duplicates within this upload
    if (seenEmails.has(email)) {
      result.skipped++;
      result.errors.push(`Row ${row.row}: Duplicate email "${email}"`);
      continue;
    }
    seenEmails.add(email);

    // Create invite
    const invite = await createInvite(groupId, email);
    if (invite) {
      result.created++;
    } else {
      result.skipped++;
      result.errors.push(`Row ${row.row}: Failed to create invite for "${email}"`);
    }
  }

  revalidatePath("/org");
  return result;
}
