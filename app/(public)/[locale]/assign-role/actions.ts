import { createSupabaseAdminClient } from "@/integrations/supabase/admin";
import { createSupabaseServerClient } from "@/integrations/supabase/server";

export async function assignRole() {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user || !user.email) {
    throw new Error("Couldn't fetch the user");
  }

  const supabase = await createSupabaseAdminClient();

  const { count, error: getUserRoleError } = await supabase
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (getUserRoleError) throw getUserRoleError;

  // user already has a role
  if (count) return;

  const { data: invite, error: inviteError } = await supabase
    .from("user_invitations")
    .select("*, roles(name)")
    .eq("email", user.email)
    .is("accepted_at", null)
    .maybeSingle();

  if (inviteError) throw inviteError;

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
