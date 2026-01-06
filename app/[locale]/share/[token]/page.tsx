import { notFound } from "next/navigation";
import { format } from "date-fns";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { Link } from "@/config/i18n/navigation";

type Props = {
  params: { token: string };
};

export default async function ShareCollectionPage({ params }: Props) {
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
          file_path,
          company_document_types ( name )
        )
      ),

      collection_worker_document_types (
        worker_document_types ( name )
      ),

      collection_workers (
        workers ( full_name )
      )
    `,
    )
    .eq("share_token", token)
    .single();

  if (!collection) notFound();

  const isExpired =
    new Date(collection.expires_at).getTime() < new Date().getTime();

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Link expired</h1>
          <p className="text-sm text-muted-foreground">
            This document collection is no longer available.
          </p>
        </div>
      </div>
    );
  }

  // Generate signed URLs
  const documentsWithUrls = await Promise.all(
    collection.collection_documents.map(async (cd) => {
      const { data } = await supabase.storage
        .from("documents")
        .createSignedUrl(cd.company_documents.file_path, 60 * 10); // 10 min

      return {
        ...cd.company_documents,
        signedUrl: data?.signedUrl ?? null,
      };
    }),
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">{collection.name}</h1>
          <p className="text-sm text-muted-foreground">
            Expires on {format(new Date(collection.expires_at), "PPP")}
          </p>
        </header>

        {/* Company documents */}
        <section className="space-y-2">
          <h2 className="font-medium">Company documents</h2>

          {documentsWithUrls.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No documents included
            </p>
          ) : (
            <ul className="space-y-2">
              {documentsWithUrls.map((doc, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {doc.company_document_types.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doc.file_name}
                    </p>
                  </div>

                  {doc.signedUrl && (
                    <a
                      download
                      className="text-sm font-medium text-primary hover:underline"
                      href={doc.signedUrl}
                    >
                      Download
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Worker document types */}
        {collection.collection_worker_document_types.length > 0 && (
          <section className="space-y-2">
            <h2 className="font-medium">Worker document types</h2>
            <ul className="list-disc pl-5 text-sm">
              {collection.collection_worker_document_types.map((t, i) => (
                <li key={i}>{t.worker_document_types.name}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Workers */}
        {collection.collection_workers.length > 0 && (
          <section className="space-y-2">
            <h2 className="font-medium">Workers</h2>
            <ul className="list-disc pl-5 text-sm">
              {collection.collection_workers.map((w, i) => (
                <li key={i}>{w.workers.full_name}</li>
              ))}
            </ul>
          </section>
        )}
        <Link
          href={`/share/${token}/download`}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Download all (ZIP)
        </Link>
      </div>
    </main>
  );
}
