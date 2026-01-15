import { createClient } from "@supabase/supabase-js";

import { sendInviteEmail } from "../_shared/gmail.ts";

/**
 * Role hierarchy:
 * super_admin → admin → user
 */
const ROLE_MATRIX: Record<string, string[]> = {
  super_admin: ["super_admin", "admin", "user"],
  admin: ["admin", "user"],
  user: [],
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  try {
    /* ------------------------------------------------------------------ */
    /* Auth context                                                        */
    /* ------------------------------------------------------------------ */

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const jwt = authHeader.replace("Bearer ", "");

    const supabaseUser = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const {
      data: { user },
    } = await supabaseUser.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    /* ------------------------------------------------------------------ */
    /* Input                                                              */
    /* ------------------------------------------------------------------ */

    const body = await req.json();
    const email: string | undefined = body?.email?.toLowerCase();
    const requestedRoleName = body?.role;

    if (!email || !requestedRoleName) {
      return new Response("Invalid payload", { status: 400 });
    }

    /* ------------------------------------------------------------------ */
    /* Resolve inviter role                                                */
    /* ------------------------------------------------------------------ */

    const { data: inviterRoles, error: inviterRolesError } = await supabaseAdmin
      .from("user_roles")
      .select<string, { roles: { name: string } }>("roles(name)")
      .eq("user_id", user.id);

    if (inviterRolesError || !inviterRoles?.length) {
      return new Response("Forbidden", { status: 403 });
    }

    const inviterRoleNames = inviterRoles.map((r) => r.roles.name);

    const inviterPrimaryRole = inviterRoleNames.includes("super_admin")
      ? "super_admin"
      : inviterRoleNames.includes("admin")
        ? "admin"
        : "user";

    /* ------------------------------------------------------------------ */
    /* Permission check                                                    */
    /* ------------------------------------------------------------------ */

    if (!ROLE_MATRIX[inviterPrimaryRole]?.includes(requestedRoleName)) {
      return new Response("Forbidden", { status: 403 });
    }

    /* ------------------------------------------------------------------ */
    /* Resolve requested role ID                                           */
    /* ------------------------------------------------------------------ */

    const { data: roleRow, error: roleError } = await supabaseAdmin
      .from("roles")
      .select("id")
      .eq("name", requestedRoleName)
      .single();

    if (roleError || !roleRow) {
      return new Response("Invalid role", { status: 400 });
    }

    /* ------------------------------------------------------------------ */
    /* Create / replace invitation                                         */
    /* ------------------------------------------------------------------ */

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { error: inviteError } = await supabaseAdmin
      .from("user_invitations")
      .upsert({
        email,
        role_id: roleRow.id,
        token,
        invited_by: user.id,
        expires_at: expiresAt,
        accepted_at: null,
      });

    if (inviteError) {
      return new Response("Failed to create invitation", {
        status: 500,
      });
    }

    /* ------------------------------------------------------------------ */
    /* Send email (Gmail API wired elsewhere)                               */
    /* ------------------------------------------------------------------ */

    await sendInviteEmail(email, token);

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return new Response("Internal error", { status: 500 });
  }
});
