import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/integrations/supabase/admin";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { allRoutes } from "@/config/site";

/* ------------------------------------------------------------------ */
/* Bootstrap helper                                                    */
/* ------------------------------------------------------------------ */

const isBootstrapSuperAdmin = (email?: string | null) => {
  if (!email) return false;
  const list = process.env.SUPER_ADMIN_EMAILS?.split(",") ?? [];
  return list.map((e) => e.trim().toLowerCase()).includes(email.toLowerCase());
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  /* ------------------------------------------------------------------ */
  /* Authenticated user                                                 */
  /* ------------------------------------------------------------------ */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(allRoutes.home, req.url));
  }

  /* ------------------------------------------------------------------ */
  /* Bootstrap super_admin (idempotent)                                  */
  /* ------------------------------------------------------------------ */

  if (isBootstrapSuperAdmin(user.email)) {
    const { data: superAdminRole } = await admin
      .from("roles")
      .select("id")
      .eq("name", "super_admin")
      .single();

    if (superAdminRole) {
      await admin.from("user_roles").upsert({
        user_id: user.id,
        role_id: superAdminRole.id,
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* No token → normal login                                            */
  /* ------------------------------------------------------------------ */

  if (!token) {
    return NextResponse.redirect(new URL(allRoutes.home, req.url));
  }

  /* ------------------------------------------------------------------ */
  /* Load invitation                                                    */
  /* ------------------------------------------------------------------ */

  const { data: invite } = await admin
    .from("user_invitations")
    .select("*")
    .eq("token", token)
    .single();

  if (
    !invite ||
    invite.accepted_at ||
    new Date(invite.expires_at) < new Date()
  ) {
    return NextResponse.redirect(new URL(allRoutes.inviteInvalid, req.url));
  }

  /* ------------------------------------------------------------------ */
  /* Email match enforcement                                            */
  /* ------------------------------------------------------------------ */

  if (invite.email.toLowerCase() !== user.email?.toLowerCase()) {
    return NextResponse.redirect(new URL(allRoutes.inviteInvalid, req.url));
  }

  /* ------------------------------------------------------------------ */
  /* Assign role (role_id)                                              */
  /* ------------------------------------------------------------------ */

  await admin.from("user_roles").upsert({
    user_id: user.id,
    role_id: invite.role_id,
  });

  /* ------------------------------------------------------------------ */
  /* Mark invitation accepted                                           */
  /* ------------------------------------------------------------------ */

  await admin
    .from("user_invitations")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  return NextResponse.redirect(new URL(allRoutes.home, req.url));
}
