"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, FormField, Alert } from "@/components/ui";

interface InviteFormProps {
  inviteId: string;
  groupId: string;
}

export default function InviteForm({ inviteId, groupId }: InviteFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    const supabase = createClient();

    try {
      // 1. Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Failed to create account");
      }

      const userId = authData.user.id;

      // 2. Create user record
      const { error: userError } = await supabase.from("users").insert({
        id: userId,
        email,
        full_name: fullName,
        role: "user",
      });

      if (userError) {
        console.error("Error creating user record:", userError);
        // Don't throw - auth account exists, user can still proceed
      }

      // 3. Add to group
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: groupId,
          user_id: userId,
          status: "active",
        });

      if (memberError) {
        console.error("Error adding to group:", memberError);
        // Don't throw - user account exists, they can be added manually
      }

      // 4. Mark invite as joined
      const { error: inviteError } = await supabase
        .from("invites")
        .update({
          status: "joined",
          joined_at: new Date().toISOString(),
        })
        .eq("id", inviteId);

      if (inviteError) {
        console.error("Error marking invite joined:", inviteError);
        // Don't throw - user is signed up and in group
      }

      // 5. Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name" htmlFor="firstName" required>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            required
            autoComplete="given-name"
          />
        </FormField>
        <FormField label="Last Name" htmlFor="lastName" required>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            required
            autoComplete="family-name"
          />
        </FormField>
      </div>

      <FormField label="Email" htmlFor="email" required>
        <Input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="password"
        required
        hint="Must be at least 6 characters"
      >
        <Input
          type="password"
          id="password"
          name="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </FormField>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Account & Join
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
          Log in
        </Link>
      </p>
    </form>
  );
}
