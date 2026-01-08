import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/integrations/supabase/server";

const FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-collection-zip`;
const maxSeconds = Number.parseInt(
  process.env.MAX_SECONDS_FILE_DOWNLOAD ?? "60",
);

export async function GET(
  _req: Request,
  { params }: { params: { token: string } },
) {
  const { token } = await params;
  const supabase = await createSupabaseServerClient();

  /* -------------------------------------------------------
   * 1️⃣ Resolve collection via public token
   * ----------------------------------------------------- */
  const { data: collection, error } = await supabase
    .from("document_collections")
    .select(
      `
      id,
      name,
      zip_status,
      zip_path,
      expires_at
    `,
    )
    .eq("share_token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error || !collection) {
    return NextResponse.json(
      { error: "Collection not found or expired" },
      { status: 404 },
    );
  }

  /* -------------------------------------------------------
   * 2️⃣ ZIP ready → redirect to signed URL
   * ----------------------------------------------------- */
  if (collection.zip_status === "ready" && collection.zip_path) {
    const { data, error: signError } = await supabase.storage
      .from("documents")
      .createSignedUrl(collection.zip_path, maxSeconds);

    if (signError || !data?.signedUrl) {
      return NextResponse.json(
        { error: "Failed to create download URL" },
        { status: 500 },
      );
    }

    return NextResponse.redirect(data.signedUrl);
  }

  /* -------------------------------------------------------
   * 3️⃣ ZIP processing → tell client to wait
   * ----------------------------------------------------- */
  if (collection.zip_status === "processing") {
    return NextResponse.json({ status: "processing" }, { status: 202 });
  }

  /* -------------------------------------------------------
   * 4️⃣ ZIP idle / failed → trigger background job
   * ----------------------------------------------------- */
  await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ collectionId: collection.id }),
  });

  return NextResponse.json({ status: "started" }, { status: 202 });
}
