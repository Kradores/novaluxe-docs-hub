import { createClient } from "@supabase/supabase-js";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  /* -------------------------------------------------------
     1️⃣ Fetch expired ZIPs
  ------------------------------------------------------- */
  const { data: expired, error } = await supabase
    .from("document_collections")
    .select("id, zip_path")
    .eq("zip_status", "ready")
    .lt("expires_at", new Date().toISOString());

  if (error) {
    console.error("Failed to fetch expired ZIPs", error);
    return new Response("DB error", { status: 500 });
  }

  if (!expired || expired.length === 0) {
    return new Response("No expired ZIPs", { status: 200 });
  }

  /* -------------------------------------------------------
     2️⃣ Delete ZIPs from Storage
  ------------------------------------------------------- */
  for (const row of expired) {
    if (!row.zip_path) continue;

    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([row.zip_path]);

    if (storageError) {
      console.error("Failed to delete ZIP", row.zip_path, storageError);
      continue; // best-effort cleanup
    }

    /* ---------------------------------------------------
       3️⃣ Reset DB state
    --------------------------------------------------- */
    await supabase
      .from("document_collections")
      .update({
        zip_status: "idle",
        zip_path: null,
        zip_ready_at: null,
      })
      .eq("id", row.id);
  }

  return new Response(`Cleaned ${expired.length} expired ZIP(s)`, {
    status: 200,
  });
});
