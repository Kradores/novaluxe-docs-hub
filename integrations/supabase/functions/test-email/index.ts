import { createClient } from "@supabase/supabase-js";

import { sendInviteEmail } from "../_shared/gmail.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  try {
    /* -------------------------------------------------------------- */
    /* Auth                                                          */
    /* -------------------------------------------------------------- */

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

    /* -------------------------------------------------------------- */
    /* Role check                                                    */
    /* -------------------------------------------------------------- */

    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select<string, { roles: { name: string } }>("roles(name)")
      .eq("user_id", user.id);

    const roleNames = roles?.map((r) => r.roles.name) ?? [];

    const isAllowed =
      roleNames.includes("super_admin") || roleNames.includes("admin");

    if (!isAllowed) {
      return new Response("Forbidden", { status: 403 });
    }

    /* -------------------------------------------------------------- */
    /* Target email                                                  */
    /* -------------------------------------------------------------- */

    const body = await req.json().catch(() => ({}));
    const targetEmail = body.email?.toLowerCase();

    if (!targetEmail) {
      return new Response("Invalid email", { status: 400 });
    }

    /* -------------------------------------------------------------- */
    /* Send test email                                               */
    /* -------------------------------------------------------------- */

    const fakeToken = "email-test-token";

    await sendInviteEmail(targetEmail, fakeToken);

    return Response.json({
      success: true,
      sent_to: targetEmail,
    });
  } catch (err) {
    console.error("Email test failed:", err);
    return new Response("Email test failed", { status: 500 });
  }
});
