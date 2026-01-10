import JSZip from "jszip";
import { createClient } from "@supabase/supabase-js";

Deno.serve(async (req) => {
  try {
    const { collectionId } = await req.json();

    if (!collectionId) {
      return new Response("Missing collectionId", { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    /* ---------------------------------------------------------
       1️⃣ Mark collection as processing
    --------------------------------------------------------- */
    await supabase
      .from("document_collections")
      .update({ zip_status: "processing" })
      .eq("id", collectionId);

    /* ---------------------------------------------------------
       2️⃣ Fetch documents
    --------------------------------------------------------- */
    const { data: docs, error: docsError } = await supabase
      .from("collection_documents")
      .select(
        `
        company_documents (
          file_name,
          file_path
        )
      `,
      )
      .eq("collection_id", collectionId);

    if (docsError) throw docsError;

    const zip = new JSZip();

    /* ---------------------------------------------------------
       3️⃣ Add files to ZIP
    --------------------------------------------------------- */
    for (const row of docs ?? []) {
      const doc = row.company_documents;
      if (!doc?.file_path) continue;

      const { data: file } = await supabase.storage
        .from("documents")
        .download(doc.file_path);

      if (!file) continue;

      const buffer = new Uint8Array(await file.arrayBuffer());
      zip.file(doc.file_name, buffer);
    }

    /* ---------------------------------------------------------
       4️⃣ Generate ZIP
    --------------------------------------------------------- */
    const zipBytes = await zip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    /* ---------------------------------------------------------
       5️⃣ Upload ZIP
    --------------------------------------------------------- */
    const zipPath = `collections/${collectionId}.zip`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(zipPath, zipBytes, {
        contentType: "application/zip",
        upsert: true,
      });

    if (error) {
      console.log(error);
    }

    /* ---------------------------------------------------------
       6️⃣ Mark as ready
    --------------------------------------------------------- */
    const { error: docError } = await supabase
      .from("document_collections")
      .update({
        zip_status: "ready",
        zip_path: zipPath,
        zip_generated_at: new Date().toISOString(),
        zip_size: zipBytes.byteLength,
      })
      .eq("id", collectionId);

    if (docError) {
      console.log(docError);
    }

    return new Response(JSON.stringify({ status: "ready" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);

    // best-effort failure state
    try {
      const { collectionId } = await req.json();
      await createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      )
        .from("document_collections")
        .update({ zip_status: "failed" })
        .eq("id", collectionId);
    } catch {}

    return new Response("ZIP generation failed", { status: 500 });
  }
});
