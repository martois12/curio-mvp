"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/rbac";
import { leaveGroup } from "@/lib/user-groups";

export async function leaveGroupAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const groupId = formData.get("groupId") as string;

  if (!groupId) {
    return { success: false, error: "Group ID is required" };
  }

  const result = await leaveGroup(user.id, groupId);

  if (result.success) {
    revalidatePath("/groups");
  }

  return result;
}
