"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import {
  ActiveUser,
  RoleModel,
  RoleName,
  UserInvitationData,
} from "@/types/user";
import { allRoutes } from "@/config/site";
import { canInviteUser, canRemoveUser } from "@/lib/auth/users";
import { createSupabaseAdminClient } from "@/integrations/supabase/admin";

export const removeUser = async (targetUserId: string) => {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await sb.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  if (user.id === targetUserId) {
    throw new Error("You cannot remove yourself");
  }

  const supabase = await createSupabaseAdminClient();

  const actorRole = user?.app_metadata?.role as RoleName | undefined;

  if (!actorRole) {
    throw new Error("Current user role not found");
  }

  const { data: targetRoleRow } = await supabase
    .from("user_roles")
    .select<string, { roles: { name: string } }>("roles(name)")
    .eq("user_id", targetUserId)
    .single();

  const targetRole = targetRoleRow?.roles?.name as RoleName | undefined;

  if (!targetRole) {
    throw new Error("Target user role not found");
  }

  if (!canRemoveUser(actorRole, targetRole)) {
    throw new Error("You are not allowed to remove this user");
  }

  const { error: roleDeleteError } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", targetUserId);

  if (roleDeleteError) {
    throw roleDeleteError;
  }

  const { error: deleteUserError } =
    await supabase.auth.admin.deleteUser(targetUserId);

  if (deleteUserError) {
    throw deleteUserError;
  }

  revalidatePath(allRoutes.users);
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

  if (!canInviteUser(inviterRoleName, requestedRole.name)) {
    throw new Error("Forbidden");
  }

  await supabase.from("user_invitations").delete().eq("email", email);

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

  revalidatePath(allRoutes.users);
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

  if (error) throw new Error(error.message);

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

export async function getPendingInvites() {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("user_invitations")
    .select<string, UserInvitationData>("id, email, expires_at, roles(name)")
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString());

  return data;
}
