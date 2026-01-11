// app/construction-site/[id]/components/collection-details-content.tsx

import { createSupabaseServerClient } from "@/integrations/supabase/server";

type Props = {
  collectionId: string;
};

export default async function CollectionDetailsContent({
  collectionId,
}: Props) {
  const supabase = await createSupabaseServerClient();

  const { data: collection, error } = await supabase
    .from("document_collections")
    .select(
      `
      name,
      expires_at,

      collection_company_documents (
        company_documents (
          id,
          file_name,
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
    .eq("id", collectionId)
    .single();

  if (error || !collection) {
    return (
      <div className="text-sm text-muted-foreground">
        Failed to load collection details
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company documents */}
      <section>
        <h3 className="font-medium mb-2">Company documents</h3>
        {collection.collection_company_documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">None</p>
        ) : (
          <ul className="space-y-1">
            {collection.collection_company_documents.map((cd, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">
                  {cd.company_documents.company_document_types.name}
                </span>{" "}
                — {cd.company_documents.file_name}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Worker document types */}
      <section>
        <h3 className="font-medium mb-2">Worker document types</h3>
        {collection.collection_worker_document_types.length === 0 ? (
          <p className="text-sm text-muted-foreground">None</p>
        ) : (
          <ul className="list-disc pl-4 text-sm">
            {collection.collection_worker_document_types.map((t, i) => (
              <li key={i}>{t.worker_document_types.name}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Workers */}
      <section>
        <h3 className="font-medium mb-2">Workers</h3>
        {collection.collection_workers.length === 0 ? (
          <p className="text-sm text-muted-foreground">None</p>
        ) : (
          <ul className="list-disc pl-4 text-sm">
            {collection.collection_workers.map((w, i) => (
              <li key={i}>{w.workers.full_name}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
