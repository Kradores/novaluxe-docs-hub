"use server";

import { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { isBootstrapSuperAdmin } from "@/lib/server/utils";
import { createSupabaseAdminClient } from "@/integrations/supabase/admin";

export async function assignRole(user?: User | null) {
  const supabase = await createSupabaseAdminClient();

  if (!user || !user.email) {
    throw new Error("Couldn't fetch the user");
  }

  const { data: invite, error: inviteError } = await supabase
    .from("user_invitations")
    .select("*, roles(name)")
    .eq("email", user.email)
    .is("accepted_at", null)
    .maybeSingle();

  if (inviteError) throw inviteError;

  // user already accepted and role assigned
  if (!invite) return;

  const { error: userRolesError } = await supabase.from("user_roles").upsert({
    user_id: user.id,
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

export async function isUserInvitedByEmail(email?: string) {
  if (!email) {
    return false;
  }
  const supabase = await createSupabaseServerClient();

  if (isBootstrapSuperAdmin(email)) {
    return true;
  }

  const { count, error } = await supabase
    .from("user_invitations")
    .select("*", { count: "exact", head: true })
    .eq("email", email);

  if (error) throw new Error(error.message);

  if (!count) {
    return false;
  }

  return true;
}
