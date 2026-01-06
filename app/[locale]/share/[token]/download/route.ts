// app/share/[token]/download/route.ts
import { Readable } from "stream";

import { NextResponse } from "next/server";
import archiver from "archiver";

import { createSupabaseServerClient } from "@/integrations/supabase/server";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: { token: string } },
) {
  const { token } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: collection } = await supabase
    .from("document_collections")
    .select(
      `
      id,
      name,
      expires_at,
      collection_documents (
        company_documents (
          file_name,
          file_path
        )
      )
    `,
    )
    .eq("share_token", token)
    .single();

  if (!collection) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (new Date(collection.expires_at) < new Date()) {
    return new NextResponse("Link expired", { status: 410 });
  }

  // Prepare archive
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = new Readable({
    read() {},
  });

  archive.on("data", (chunk) => stream.push(chunk));
  archive.on("end", () => stream.push(null));
  archive.on("error", (err) => {
    throw err;
  });

  // Append files
  for (const item of collection.collection_documents) {
    const doc = item.company_documents;

    const { data: signed } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.file_path, 60 * 10);

    if (!signed?.signedUrl) continue;

    const fileRes = await fetch(signed.signedUrl);
    if (!fileRes.ok || !fileRes.body) continue;

    archive.append(fileRes.body as any, {
      name: doc.file_name,
    });
  }

  archive.finalize();

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${collection.name}.zip"`,
    },
  });
}
