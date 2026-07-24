"use server";

import { createSupabaseAdminClient } from "@/integrations/supabase/admin";

export async function assignRole(
  userId: string,
  email: string,
) {
  const supabase = await createSupabaseAdminClient();

  const { count, error: getUserRoleError } = await supabase
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (getUserRoleError) throw getUserRoleError;

  if (count) return;

  const { data: invite, error: inviteError } = await supabase
    .from("user_invitations")
    .select("*, roles(name)")
    .eq("email", email)
    .is("accepted_at", null)
    .maybeSingle();

  if (inviteError) throw inviteError;

  if (!invite) return;

  const { error: userRolesError } = await supabase
    .from("user_roles")
    .upsert({
      user_id: userId,
      role_id: invite.role_id,
    });

  if (userRolesError) throw userRolesError;

  const { error: userInvitationsError } = await supabase
    .from("user_invitations")
    .update({
      accepted_at: new Date().toISOString(),
    })
    .eq("id", invite.id);

  if (userInvitationsError) throw userInvitationsError;
}