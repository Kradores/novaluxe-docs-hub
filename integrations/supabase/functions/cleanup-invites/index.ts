import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

Deno.serve(async () => {
  try {
    const { data, error } = await supabase
      .from("user_invitations")
      .delete()
      .is("accepted_at", null)
      .lt("expires_at", new Date().toISOString())
      .select("id");

    if (error) {
      console.error("Invite cleanup error:", error);
      return new Response("Cleanup failed", { status: 500 });
    }

    return Response.json({
      success: true,
      deleted: data?.length ?? 0,
    });
  } catch (err) {
    console.error("Cleanup exception:", err);
    return new Response("Cleanup failed", { status: 500 });
  }
});
