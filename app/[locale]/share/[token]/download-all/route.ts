import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/integrations/supabase/server";

const FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-collection-zip`;
const maxSeconds = Number.parseInt(
  process.env.MAX_SECONDS_FILE_DOWNLOAD ?? "60",
);

export async function GET(
  _: Request,
  { params }: { params: { token: string } },
) {
  const { token } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("document_collections")
    .select("id, zip_status, zip_path, expires_at")
    .eq("share_token", token)
    .single();

  // ❌ Collection not found
  if (error || !data) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 },
    );
  }

  // ❌ ZIP not ready
  if (data.zip_status !== "ready" || !data.zip_path) {
    return NextResponse.json({ error: "ZIP not ready" }, { status: 409 });
  }

  // ❌ Expired
  const now = new Date();
  const expiresAt = new Date(data.expires_at);

  if (expiresAt <= now) {
    return NextResponse.json(
      { error: "Link expired" },
      { status: 410 }, // Gone
    );
  }

  // ✅ Generate signed URL
  const { data: signed, error: signError } = await supabase.storage
    .from("documents")
    .createSignedUrl(data.zip_path, maxSeconds);

  if (signError || !signed?.signedUrl) {
    return NextResponse.json({ error: "Failed to sign ZIP" }, { status: 500 });
  }

  // ✅ Redirect to Supabase Storage
  return NextResponse.redirect(signed.signedUrl, 307);
}
