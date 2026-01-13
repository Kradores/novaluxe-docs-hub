import { getTranslations } from "next-intl/server";

import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { CollectionDetails } from "@/types/site-collection";

type Props = {
  collectionId: string;
};

export default async function CollectionDetailsContent({
  collectionId,
}: Props) {
  const t = await getTranslations("constructionSiteDetail.view");
  const supabase = await createSupabaseServerClient();

  const { data: collection, error } = await supabase
    .from("document_collections")
    .select<string, CollectionDetails>(
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
      ),

      collection_uploaded_documents (
        id,
        file_name
      )
    `,
    )
    .eq("id", collectionId)
    .single();

  if (error || !collection) {
    return (
      <div className="text-sm text-muted-foreground">{t("noCollection")}</div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-medium mb-2">{t("companyDocuments")}</h3>
        {collection.collection_company_documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("none")}</p>
        ) : (
          <ul className="list-disc pl-4 text-sm">
            {collection.collection_company_documents.map((cd, i) => (
              <li key={i}>
                {cd.company_documents.company_document_types.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="font-medium mb-2">{t("workerDocumentTypes")}</h3>
        {collection.collection_worker_document_types.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("none")}</p>
        ) : (
          <ul className="list-disc pl-4 text-sm">
            {collection.collection_worker_document_types.map((t, i) => (
              <li key={i}>{t.worker_document_types.name}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="font-medium mb-2">{t("workers")}</h3>
        {collection.collection_workers.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("none")}</p>
        ) : (
          <ul className="list-disc pl-4 text-sm">
            {collection.collection_workers.map((w, i) => (
              <li key={i}>{w.workers.full_name}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="font-medium mb-2">{t("attachments")}</h3>
        {collection.collection_uploaded_documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("none")}</p>
        ) : (
          <ul className="list-disc pl-4 text-sm">
            {collection.collection_uploaded_documents.map((t) => (
              <li key={t.id}>{t.file_name}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
