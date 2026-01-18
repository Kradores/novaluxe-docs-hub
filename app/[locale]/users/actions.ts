"use server";

import { cache } from "react";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { ActiveUser, RoleModel } from "@/types/user";

const ROLE_MATRIX: Record<string, string[]> = {
  super_admin: ["super_admin", "admin", "user"],
  admin: ["admin", "user"],
  user: [],
};

export async function createUserInvitation(
  email: string,
  requestedRole: RoleModel | undefined,
) {
  if (!requestedRole) {
    throw new Error("Role is missing");
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const inviterRoleName = user?.app_metadata?.role;

  if (!inviterRoleName) {
    throw new Error("Forbidden");
  }

  if (!ROLE_MATRIX[inviterRoleName]?.includes(requestedRole.name)) {
    throw new Error("Forbidden");
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { error: inviteError } = await supabase
    .from("user_invitations")
    .upsert({
      email,
      role_id: requestedRole.id,
      invited_by: user.id,
      expires_at: expiresAt,
      accepted_at: null,
    });

  if (inviteError) {
    throw new Error("Failed to create invitation");
  }
}

export async function getActiveUsers() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc<
    "get_active_users",
    never,
    {
      Row: unknown;
      Result: ActiveUser[] | null;
      RelationName: "get_active_users";
      Relationships: null;
    }
  >("get_active_users");

  if (error) throw error;

  return data;
}

export const getRoles = cache(async () => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("roles")
    .select<string, RoleModel>("id, name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
});
